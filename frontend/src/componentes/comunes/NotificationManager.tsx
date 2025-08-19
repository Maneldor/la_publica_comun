'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePushNotifications } from '../../../hooks/usePWA';

interface NotificationManagerProps {
  apiUrl?: string;
  vapidKey?: string;
  userId?: string;
  onNotificationReceived?: (notification: any) => void;
}

interface NotificationSettings {
  enabled: boolean;
  messages: boolean;
  reactions: boolean;
  calls: boolean;
  groups: boolean;
  mentions: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  sound: boolean;
  vibration: boolean;
}

export function NotificationManager({ 
  apiUrl = 'http://localhost:3001',
  vapidKey,
  userId,
  onNotificationReceived 
}: NotificationManagerProps) {
  const { 
    isSupported, 
    permission, 
    subscription, 
    requestPermission, 
    subscribe, 
    unsubscribe 
  } = usePushNotifications();

  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    messages: true,
    reactions: true,
    calls: true,
    groups: true,
    mentions: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    sound: true,
    vibration: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar configuración al montar
  useEffect(() => {
    if (userId) {
      loadNotificationSettings();
    }
  }, [userId]);

  // Configurar service worker para escuchar notificaciones
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      };
    }
  }, []);

  const handleServiceWorkerMessage = useCallback((event: MessageEvent) => {
    if (event.data.type === 'NOTIFICATION_RECEIVED') {
      console.log('📱 Notificación recibida:', event.data.notification);
      onNotificationReceived?.(event.data.notification);
    }
  }, [onNotificationReceived]);

  const loadNotificationSettings = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/messaging/push/settings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data || settings);
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const saveNotificationSettings = async (newSettings: NotificationSettings) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/messaging/push/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ settings: newSettings })
      });

      if (response.ok) {
        setSettings(newSettings);
        setError(null);
      } else {
        throw new Error('Error guardando configuración');
      }
    } catch (error) {
      console.error('Error guardando configuración:', error);
      setError('Error guardando configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const enableNotifications = async () => {
    if (!isSupported) {
      setError('Las notificaciones push no están soportadas en este navegador');
      return false;
    }

    if (!vapidKey) {
      setError('Clave VAPID no configurada');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Solicitar permisos
      const permissionGranted = await requestPermission();
      if (!permissionGranted) {
        setError('Permisos de notificación denegados');
        return false;
      }

      // Suscribirse
      const newSubscription = await subscribe(vapidKey);
      if (!newSubscription) {
        setError('Error al suscribirse a las notificaciones');
        return false;
      }

      // Enviar suscripción al servidor
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      const response = await fetch(`${apiUrl}/api/messaging/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          subscription: newSubscription,
          deviceInfo
        })
      });

      if (!response.ok) {
        throw new Error('Error registrando suscripción en el servidor');
      }

      // Actualizar configuración
      const newSettings = { ...settings, enabled: true };
      await saveNotificationSettings(newSettings);

      console.log('✅ Notificaciones habilitadas correctamente');
      return true;

    } catch (error) {
      console.error('Error habilitando notificaciones:', error);
      setError('Error habilitando notificaciones');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disableNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (subscription) {
        // Desuscribirse localmente
        await unsubscribe();

        // Notificar al servidor
        await fetch(`${apiUrl}/api/messaging/push/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ 
            endpoint: subscription.endpoint,
            reason: 'user_disabled'
          })
        });
      }

      // Actualizar configuración
      const newSettings = { ...settings, enabled: false };
      await saveNotificationSettings(newSettings);

      console.log('✅ Notificaciones deshabilitadas');
      return true;

    } catch (error) {
      console.error('Error deshabilitando notificaciones:', error);
      setError('Error deshabilitando notificaciones');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const testNotification = async (type: string = 'general') => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/messaging/push/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ type })
      });

      if (response.ok) {
        console.log(`✅ Notificación de prueba (${type}) enviada`);
      } else {
        throw new Error('Error enviando notificación de prueba');
      }
    } catch (error) {
      console.error('Error en notificación de prueba:', error);
      setError('Error enviando notificación de prueba');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Estado
    isSupported,
    permission,
    subscription,
    settings,
    isLoading,
    error,
    isEnabled: settings.enabled && permission === 'granted',

    // Acciones
    enableNotifications,
    disableNotifications,
    saveNotificationSettings,
    testNotification,
    
    // Configuraciones específicas
    updateSetting: (key: keyof NotificationSettings, value: any) => {
      const newSettings = { ...settings, [key]: value };
      saveNotificationSettings(newSettings);
    }
  };
}

// Componente de configuración de notificaciones
export function NotificationSettings({ 
  notificationManager 
}: { 
  notificationManager: ReturnType<typeof NotificationManager> 
}) {
  const {
    isSupported,
    permission,
    settings,
    isLoading,
    error,
    isEnabled,
    enableNotifications,
    disableNotifications,
    updateSetting,
    testNotification
  } = notificationManager;

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <span className="text-yellow-600">⚠️</span>
          <p className="text-sm text-yellow-800">
            Las notificaciones push no están disponibles en este navegador
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estado principal */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Notificaciones Push</h3>
            <p className="text-sm text-gray-600">
              Recibe notificaciones de mensajes y actividad
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm ${
              isEnabled ? 'text-green-600' : 'text-gray-500'
            }`}>
              {isEnabled ? '✅ Habilitadas' : '❌ Deshabilitadas'}
            </span>
            <button
              onClick={isEnabled ? disableNotifications : enableNotifications}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isEnabled
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              } disabled:opacity-50`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Procesando...
                </span>
              ) : (
                isEnabled ? 'Deshabilitar' : 'Habilitar'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {permission === 'denied' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              Los permisos de notificación están bloqueados. 
              Debes habilitarlos desde la configuración del navegador.
            </p>
          </div>
        )}
      </div>

      {/* Configuraciones detalladas */}
      {isEnabled && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold mb-4">Tipos de notificaciones</h4>
          
          <div className="space-y-4">
            {[
              { key: 'messages', label: 'Mensajes nuevos', icon: '💬' },
              { key: 'reactions', label: 'Reacciones', icon: '😊' },
              { key: 'calls', label: 'Llamadas', icon: '📞' },
              { key: 'groups', label: 'Actividad en grupos', icon: '👥' },
              { key: 'mentions', label: 'Menciones', icon: '@' }
            ].map(({ key, label, icon }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm">{label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[key as keyof NotificationSettings] as boolean}
                    onChange={(e) => updateSetting(key as keyof NotificationSettings, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h5 className="font-medium mb-3">Configuración adicional</h5>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">🔊 Sonido</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sound}
                    onChange={(e) => updateSetting('sound', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">📳 Vibración</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.vibration}
                    onChange={(e) => updateSetting('vibration', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Botones de prueba */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h5 className="font-medium mb-3">Probar notificaciones</h5>
            <div className="flex flex-wrap gap-2">
              {[
                { type: 'general', label: 'General', icon: '🔔' },
                { type: 'message', label: 'Mensaje', icon: '💬' },
                { type: 'reaction', label: 'Reacción', icon: '😊' },
                { type: 'call', label: 'Llamada', icon: '📞' }
              ].map(({ type, label, icon }) => (
                <button
                  key={type}
                  onClick={() => testNotification(type)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}