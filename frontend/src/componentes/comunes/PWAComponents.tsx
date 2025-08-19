'use client';

import React, { useState, useEffect } from 'react';
import { usePWA, usePushNotifications, useWebShare } from '../../../hooks/usePWA';

// Componente para el banner de instalación
export function InstallBanner() {
  const { isInstallable, isInstalled, install } = usePWA();
  const [showBanner, setShowBanner] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Mostrar banner solo si es instalable y no está instalado ni ha sido descartado
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    setIsDismissed(dismissed === 'true');
    
    if (isInstallable && !isInstalled && !dismissed) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showBanner || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg p-4 border border-blue-500">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📱</div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">¡Instala La Pública!</h3>
            <p className="text-xs text-blue-100 mt-1">
              Accede más rápido y recibe notificaciones push
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="bg-white text-blue-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-50 transition-colors"
              >
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="text-blue-100 px-3 py-1.5 rounded-md text-xs hover:text-white transition-colors"
              >
                Ahora no
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-blue-200 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para notificar actualizaciones
export function UpdateNotification() {
  const { updateAvailable, skipWaiting } = usePWA();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    setShowNotification(updateAvailable);
  }, [updateAvailable]);

  const handleUpdate = () => {
    skipWaiting();
    setShowNotification(false);
  };

  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="bg-green-600 text-white rounded-lg shadow-lg p-4 border border-green-500">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🔄</div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Nueva versión disponible</h3>
            <p className="text-xs text-green-100 mt-1">
              Actualiza La Pública para obtener las últimas mejoras
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleUpdate}
                className="bg-white text-green-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-green-50 transition-colors"
              >
                Actualizar
              </button>
              <button
                onClick={handleDismiss}
                className="text-green-100 px-3 py-1.5 rounded-md text-xs hover:text-white transition-colors"
              >
                Después
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-green-200 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para indicador de conexión
export function ConnectionIndicator() {
  const { isOnline } = usePWA();
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOffline(true);
    } else {
      // Ocultar después de un momento cuando vuelve la conexión
      const timer = setTimeout(() => {
        setShowOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showOffline && isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className={`text-center py-2 px-4 text-sm font-medium transition-colors ${
        isOnline 
          ? 'bg-green-600 text-white' 
          : 'bg-red-600 text-white'
      }`}>
        {isOnline ? (
          <>
            <span className="mr-2">🌐</span>
            Conexión restaurada
          </>
        ) : (
          <>
            <span className="mr-2">📡</span>
            Sin conexión - Algunas funciones pueden no estar disponibles
          </>
        )}
      </div>
    </div>
  );
}

// Componente para solicitar permisos de notificaciones
export function NotificationPermissionPrompt() {
  const { isSupported, permission, requestPermission } = usePushNotifications();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Mostrar prompt solo si está soportado y no se han solicitado permisos
    const dismissed = localStorage.getItem('notification-prompt-dismissed');
    
    if (isSupported && permission === 'default' && !dismissed) {
      // Esperar un momento antes de mostrar el prompt
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, permission]);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    setShowPrompt(false);
    
    if (!granted) {
      localStorage.setItem('notification-prompt-dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('notification-prompt-dismissed', 'true');
  };

  if (!showPrompt || !isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="bg-indigo-600 text-white rounded-lg shadow-lg p-4 border border-indigo-500">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🔔</div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Recibe notificaciones</h3>
            <p className="text-xs text-indigo-100 mt-1">
              No te pierdas nuevos mensajes y actualizaciones importantes
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleRequestPermission}
                className="bg-white text-indigo-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-indigo-50 transition-colors"
              >
                Permitir
              </button>
              <button
                onClick={handleDismiss}
                className="text-indigo-100 px-3 py-1.5 rounded-md text-xs hover:text-white transition-colors"
              >
                No gracias
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-indigo-200 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

// Botón de compartir
interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
  children: React.ReactNode;
}

export function ShareButton({ title, text, url, className = '', children }: ShareButtonProps) {
  const { isSupported, share } = useWebShare();

  const handleShare = async () => {
    if (isSupported) {
      const success = await share({
        title,
        text,
        url: url || window.location.href
      });
      
      if (!success) {
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    // Fallback para navegadores sin Web Share API
    if (navigator.clipboard) {
      const shareText = `${title}\n${text}\n${url || window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Enlace copiado al portapapeles');
      });
    } else {
      // Último fallback: abrir email
      const subject = encodeURIComponent(title);
      const body = encodeURIComponent(`${text}\n\n${url || window.location.href}`);
      window.open(`mailto:?subject=${subject}&body=${body}`);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 ${className}`}
      title="Compartir"
    >
      {children}
    </button>
  );
}

// Componente principal que incluye todas las funcionalidades PWA
export function PWAProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <InstallBanner />
      <UpdateNotification />
      <ConnectionIndicator />
      <NotificationPermissionPrompt />
    </>
  );
}

// Componente para mostrar información de PWA en configuración
export function PWAInfo() {
  const { isInstalled, isStandalone, isOnline, registration } = usePWA();
  const { isSupported: pushSupported, permission, subscription } = usePushNotifications();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Estado de la Aplicación</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">App instalada</span>
          <span className={`text-sm font-medium ${isInstalled ? 'text-green-600' : 'text-gray-400'}`}>
            {isInstalled ? '✅ Sí' : '❌ No'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Modo standalone</span>
          <span className={`text-sm font-medium ${isStandalone ? 'text-green-600' : 'text-gray-400'}`}>
            {isStandalone ? '✅ Sí' : '❌ No'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Conexión</span>
          <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
            {isOnline ? '🌐 Online' : '📡 Offline'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Service Worker</span>
          <span className={`text-sm font-medium ${registration ? 'text-green-600' : 'text-gray-400'}`}>
            {registration ? '✅ Activo' : '❌ Inactivo'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Push Notifications</span>
          <span className={`text-sm font-medium ${
            pushSupported && permission === 'granted' ? 'text-green-600' : 'text-gray-400'
          }`}>
            {!pushSupported && '❌ No soportado'}
            {pushSupported && permission === 'default' && '⏳ Sin permisos'}
            {pushSupported && permission === 'denied' && '❌ Denegado'}
            {pushSupported && permission === 'granted' && '✅ Habilitado'}
          </span>
        </div>
        
        {subscription && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Suscripción push</span>
            <span className="text-sm font-medium text-green-600">✅ Activa</span>
          </div>
        )}
      </div>
    </div>
  );
}