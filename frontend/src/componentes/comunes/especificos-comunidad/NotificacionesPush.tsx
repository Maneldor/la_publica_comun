'use client';

import React, { useState } from 'react';
import { Bell, BellOff, Check, X, TestTube } from 'lucide-react';
import { usePushNotifications } from '../../../../hooks/usePushNotifications';
import { Boton } from './ui/Boton';

interface PropiedadesNotificacionesPush {
  className?: string;
}

export const NotificacionesPush: React.FC<PropiedadesNotificacionesPush> = ({ className = '' }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    testNotification
  } = usePushNotifications();

  const handleToggleNotifications = async () => {
    try {
      if (isSubscribed) {
        await unsubscribe();
      } else {
        await subscribe();
      }
    } catch (err) {
      console.error('Error al cambiar estado de notificaciones:', err);
    }
  };

  const handleTestNotification = async () => {
    try {
      await testNotification();
    } catch (err) {
      console.error('Error al enviar notificación de prueba:', err);
    }
  };

  if (!isSupported) {
    return (
      <div className={`text-gray-500 text-sm ${className}`}>
        Las notificaciones push no son compatibles en este navegador
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Botón para abrir configuración */}
      <button
        onClick={() => setMostrarModal(true)}
        className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
          isSubscribed 
            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
            : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
        }`}
        title={isSubscribed ? 'Notificaciones activadas' : 'Notificaciones desactivadas'}
      >
        {isSubscribed ? <Bell size={20} /> : <BellOff size={20} />}
        <span className="text-sm font-medium">
          Notificaciones
        </span>
      </button>

      {/* Modal de configuración */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Bell size={20} />
                <span>Notificaciones Push</span>
              </h3>
              <button
                onClick={() => setMostrarModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Estado actual */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Estado actual</p>
                    <p className="text-xs text-gray-600">
                      {permission === 'granted' 
                        ? isSubscribed ? 'Notificaciones activadas' : 'Permisos concedidos'
                        : permission === 'denied' 
                          ? 'Permisos denegados' 
                          : 'Permisos no solicitados'
                      }
                    </p>
                  </div>
                  <div className={`p-2 rounded-full ${
                    isSubscribed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isSubscribed ? <Check size={16} /> : <BellOff size={16} />}
                  </div>
                </div>

                {/* Descripción */}
                <div className="text-sm text-gray-600">
                  <p>
                    Las notificaciones push te permiten recibir avisos instantáneos sobre:
                  </p>
                  <ul className="mt-2 space-y-1 ml-4">
                    <li>• Mensajes nuevos</li>
                    <li>• Actualizaciones importantes</li>
                    <li>• Actividad en tus grupos</li>
                  </ul>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Acciones */}
                <div className="space-y-3">
                  {permission === 'denied' && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Has denegado los permisos de notificación. Para activarlas, 
                        debes permitirlas manualmente en la configuración de tu navegador.
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <Boton
                      onClick={handleToggleNotifications}
                      disabled={isLoading || permission === 'denied'}
                      variante={isSubscribed ? 'secundario' : 'primario'}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Procesando...</span>
                        </div>
                      ) : (
                        isSubscribed ? 'Desactivar' : 'Activar'
                      )}
                    </Boton>

                    {isSubscribed && (
                      <Boton
                        onClick={handleTestNotification}
                        disabled={isLoading}
                        variante="secundario"
                        className="flex items-center space-x-2"
                      >
                        <TestTube size={16} />
                        <span>Probar</span>
                      </Boton>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
              <p className="text-xs text-gray-500">
                Puedes cambiar estas preferencias en cualquier momento desde la configuración.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificacionesPush;