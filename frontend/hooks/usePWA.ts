import { useState, useEffect, useCallback } from 'react';

// Tipos para PWA
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

interface PWAActions {
  install: () => Promise<boolean>;
  update: () => Promise<void>;
  checkForUpdates: () => Promise<void>;
  skipWaiting: () => void;
}

// Hook principal para PWA
export function usePWA(): PWAState & PWAActions {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    isOnline: navigator.onLine,
    updateAvailable: false,
    registration: null
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Registrar service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registrado:', registration);
          setState(prev => ({ ...prev, registration }));

          // Escuchar actualizaciones
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🔄 Actualización disponible');
                  setState(prev => ({ ...prev, updateAvailable: true }));
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ Error registrando Service Worker:', error);
        });
    }
  }, []);

  // Detectar si la app está instalada/standalone
  useEffect(() => {
    const checkStandalone = () => {
      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://');
      
      setState(prev => ({ 
        ...prev, 
        isStandalone,
        isInstalled: isStandalone
      }));
    };

    checkStandalone();
    
    // Escuchar cambios en display-mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkStandalone);
    
    return () => mediaQuery.removeEventListener('change', checkStandalone);
  }, []);

  // Escuchar evento beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setState(prev => ({ ...prev, isInstallable: true }));
      console.log('📱 App puede ser instalada');
    };

    const handleAppInstalled = () => {
      console.log('✅ App instalada');
      setState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        isInstallable: false 
      }));
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Escuchar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      console.log('🌐 Conexión restaurada');
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
      console.log('📡 Sin conexión');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Escuchar mensajes del service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'SW_ACTIVATED') {
          console.log('🚀 Service Worker activado:', event.data.version);
        }
      };

      navigator.serviceWorker.addEventListener('message', handleMessage);
      return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
    }
  }, []);

  // Función para instalar la app
  const install = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.log('❌ No hay prompt de instalación disponible');
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      
      if (choice.outcome === 'accepted') {
        console.log('✅ Usuario aceptó instalar la app');
        setState(prev => ({ ...prev, isInstallable: false }));
        setDeferredPrompt(null);
        return true;
      } else {
        console.log('❌ Usuario rechazó instalar la app');
        return false;
      }
    } catch (error) {
      console.error('❌ Error instalando app:', error);
      return false;
    }
  }, [deferredPrompt]);

  // Función para actualizar la app
  const update = useCallback(async (): Promise<void> => {
    if (!state.registration) {
      console.log('❌ No hay registro de Service Worker');
      return;
    }

    try {
      await state.registration.update();
      console.log('🔄 Actualizando Service Worker...');
    } catch (error) {
      console.error('❌ Error actualizando:', error);
    }
  }, [state.registration]);

  // Función para forzar actualización
  const skipWaiting = useCallback(() => {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setState(prev => ({ ...prev, updateAvailable: false }));
      console.log('⏭️ Forzando actualización...');
      
      // Recargar página después de un momento
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [state.registration]);

  // Función para comprobar actualizaciones
  const checkForUpdates = useCallback(async (): Promise<void> => {
    if (!state.registration) return;
    
    try {
      await state.registration.update();
    } catch (error) {
      console.error('❌ Error comprobando actualizaciones:', error);
    }
  }, [state.registration]);

  return {
    ...state,
    install,
    update,
    checkForUpdates,
    skipWaiting
  };
}

// Hook para notificaciones push
export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verificar soporte
    const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.log('❌ Push notifications no soportadas');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        console.log('✅ Permisos de notificación concedidos');
        return true;
      } else {
        console.log('❌ Permisos de notificación denegados');
        return false;
      }
    } catch (error) {
      console.error('❌ Error solicitando permisos:', error);
      return false;
    }
  }, [isSupported]);

  const subscribe = useCallback(async (vapidPublicKey: string): Promise<PushSubscription | null> => {
    if (permission !== 'granted') {
      console.log('❌ Sin permisos para suscribirse');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });

      setSubscription(subscription);
      console.log('✅ Suscrito a push notifications');
      return subscription;
    } catch (error) {
      console.error('❌ Error suscribiéndose:', error);
      return null;
    }
  }, [permission]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!subscription) {
      console.log('❌ No hay suscripción activa');
      return false;
    }

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      console.log('✅ Desuscrito de push notifications');
      return true;
    } catch (error) {
      console.error('❌ Error desuscribiéndose:', error);
      return false;
    }
  }, [subscription]);

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe
  };
}

// Hook para compartir contenido
export function useWebShare() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('share' in navigator);
  }, []);

  const share = useCallback(async (data: ShareData): Promise<boolean> => {
    if (!isSupported) {
      console.log('❌ Web Share API no soportada');
      return false;
    }

    try {
      await navigator.share(data);
      console.log('✅ Contenido compartido');
      return true;
    } catch (error) {
      console.error('❌ Error compartiendo:', error);
      return false;
    }
  }, [isSupported]);

  return {
    isSupported,
    share
  };
}

// Hook para gestión de archivos
export function useFileHandling() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('launchQueue' in window);
  }, []);

  const handleFiles = useCallback((callback: (files: FileSystemFileHandle[]) => void) => {
    if (!isSupported) {
      console.log('❌ File Handling API no soportada');
      return;
    }

    if ('launchQueue' in window) {
      (window as any).launchQueue.setConsumer((launchParams: any) => {
        if (launchParams.files && launchParams.files.length) {
          callback(launchParams.files);
        }
      });
    }
  }, [isSupported]);

  return {
    isSupported,
    handleFiles
  };
}