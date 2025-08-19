'use client';

import React, { useState } from 'react';
import { usePushNotifications } from '../../../../hooks/usePushNotifications';
import { Bell, BellOff, Settings, TestTube, Check, X, AlertCircle, Smartphone } from 'lucide-react';

interface PropiedadesConfiguracionNotificaciones {
  abierto: boolean;
  onCerrar: () => void;
}

const ConfiguracionNotificaciones: React.FC<PropiedadesConfiguracionNotificaciones> = ({
  abierto,
  onCerrar
}) => {
  const {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    testNotification
  } = usePushNotifications();

  const [showSuccess, setShowSuccess] = useState(false);
  const [testLoading, setTestLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      await subscribe();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error suscribiendo:', error);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await unsubscribe();
    } catch (error) {
      console.error('Error desuscribiendo:', error);
    }
  };

  const handleTestNotification = async () => {
    setTestLoading(true);
    try {
      await testNotification();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error enviando notificación de prueba:', error);
    } finally {
      setTestLoading(false);
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="text-white" size={24} />
              <h2 className="text-xl font-semibold text-white">Notificaciones Push</h2>
            </div>
            <button 
              onClick={onCerrar} 
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Estado de soporte */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className={`p-2 rounded-full ${isSupported ? 'bg-green-100' : 'bg-red-100'}`}>
              {isSupported ? (
                <Smartphone className="text-green-600" size={20} />
              ) : (
                <AlertCircle className="text-red-600" size={20} />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {isSupported ? 'Compatible' : 'No compatible'}
              </p>
              <p className="text-sm text-gray-600">
                {isSupported 
                  ? 'Tu navegador soporta notificaciones push'
                  : 'Tu navegador no soporta notificaciones push'
                }
              </p>
            </div>
          </div>

          {isSupported && (
            <>
              {/* Estado de permisos */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Estado de permisos</h3>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    permission === 'granted' ? 'bg-green-500' :
                    permission === 'denied' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <span className="text-sm text-gray-700">
                    {permission === 'granted' ? 'Permisos concedidos' :
                     permission === 'denied' ? 'Permisos denegados' : 'Permisos pendientes'}
                  </span>
                </div>
              </div>

              {/* Estado de suscripción */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Estado de notificaciones</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {isSubscribed ? (
                      <Bell className="text-green-600" size={20} />
                    ) : (
                      <BellOff className="text-gray-400" size={20} />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {isSubscribed ? 'Activadas' : 'Desactivadas'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isSubscribed 
                          ? 'Recibirás notificaciones de nuevos mensajes'
                          : 'No recibirás notificaciones push'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                    disabled={isLoading || permission === 'denied'}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isSubscribed
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      isSubscribed ? 'Desactivar' : 'Activar'
                    )}
                  </button>
                </div>
              </div>

              {/* Botón de prueba */}
              {isSubscribed && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Probar notificaciones</h3>
                  <button
                    onClick={handleTestNotification}
                    disabled={testLoading}
                    className="w-full flex items-center justify-center space-x-2 p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {testLoading ? (
                      <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <TestTube size={16} />
                        <span>Enviar notificación de prueba</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Información adicional */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">¿Qué notificaciones recibiré?</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>Nuevos mensajes privados</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>Reacciones a tus mensajes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>Llamadas entrantes</span>
                  </div>
                </div>
              </div>

              {/* Advertencia de permisos denegados */}
              {permission === 'denied' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-medium text-red-800">Permisos denegados</p>
                      <p className="text-sm text-red-700 mt-1">
                        Para activar las notificaciones, debes permitir notificaciones en la configuración de tu navegador.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Mensaje de éxito */}
          {showSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Check className="text-green-600" size={20} />
                <p className="font-medium text-green-800">¡Listo!</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Las notificaciones funcionan incluso cuando el navegador está cerrado
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionNotificaciones;