import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../src/contextos/AuthContext';

export const usePushNotifications = () => {
  const { user, token } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:3001';
  
  // VAPID Public Key (debe coincidir con el del backend)
  const VAPID_PUBLIC_KEY = 'BOkGrSAkmFL3O3I41N4Rrw3feWFQgGqBbBwhtoKsERAe6OPQsLNk4qPV7e-dnMM9VyGgenUCBi-o4LRrxEoobpM';

  // Convertir VAPID key a Uint8Array
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Convertir ArrayBuffer a Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    return window.btoa(binary);
  };

  // Verificar soporte para push notifications
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission);
        checkSubscription();
      }
    }
  }, []);

  // Verificar si ya existe una suscripción
  const checkSubscription = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
          setSubscription(existingSubscription);
          setIsSubscribed(true);
        }
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
    }
  }, []);

  // Registrar service worker
  const registerServiceWorker = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Esperar a que el service worker esté listo
      await navigator.serviceWorker.ready;
      
      return registration;
    } catch (err) {
      console.error('Error registering service worker:', err);
      throw new Error('No se pudo registrar el service worker');
    }
  }, []);

  // Solicitar permisos de notificación
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      throw new Error('Las notificaciones push no son compatibles en este navegador');
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);
    
    if (permission !== 'granted') {
      throw new Error('Permisos de notificación denegados');
    }
    
    return permission;
  }, [isSupported]);

  // Suscribirse a push notifications
  const subscribe = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isSupported) {
        throw new Error('Las notificaciones push no son compatibles');
      }

      // Solicitar permisos si no los tenemos
      if (permission !== 'granted') {
        await requestPermission();
      }

      // Registrar service worker
      const registration = await registerServiceWorker();

      // Crear suscripción con VAPID key
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });

      // Enviar suscripción al servidor
      if (!user || !token) {
        throw new Error('Usuario no autenticado');
      }

      const subscriptionData = {
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(pushSubscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(pushSubscription.getKey('auth')!)
        }
      };

      const response = await fetch(`${API_BASE_URL}/api/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subscription: subscriptionData,
          userId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Error al registrar suscripción en el servidor');
      }

      setSubscription(pushSubscription);
      setIsSubscribed(true);
      
      return pushSubscription;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, permission, requestPermission, registerServiceWorker]);

  // Desuscribirse de push notifications
  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!subscription) {
        throw new Error('No hay suscripción activa');
      }

      // Desuscribirse en el cliente
      await subscription.unsubscribe();

      // Notificar al servidor
      if (token && user) {
        await fetch(`${API_BASE_URL}/api/push/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
            userId: user.id
          })
        });
      }

      setSubscription(null);
      setIsSubscribed(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  // Probar notificación
  const testNotification = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!user || !token) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${API_BASE_URL}/api/push/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          title: '🧪 Notificación de prueba',
          body: 'Las notificaciones push funcionan correctamente!',
          type: 'test'
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar notificación de prueba');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    subscription,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    testNotification,
    requestPermission
  };
};