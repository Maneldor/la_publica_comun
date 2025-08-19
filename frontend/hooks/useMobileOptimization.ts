import { useState, useEffect, useCallback } from 'react';

// Tipos para optimización móvil
interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  orientation: 'portrait' | 'landscape';
  deviceType: 'phone' | 'tablet' | 'desktop';
  hasHover: boolean;
  pixelRatio: number;
  viewportHeight: number;
  viewportWidth: number;
}

interface MobileOptimizations {
  reducedAnimations: boolean;
  compactMode: boolean;
  touchOptimized: boolean;
  lowDataMode: boolean;
  offlineFirst: boolean;
}

// Hook principal para optimización móvil
export function useMobileOptimization() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    screenSize: 'lg',
    orientation: 'landscape',
    deviceType: 'desktop',
    hasHover: true,
    pixelRatio: 1,
    viewportHeight: 0,
    viewportWidth: 0
  });

  const [optimizations, setOptimizations] = useState<MobileOptimizations>({
    reducedAnimations: false,
    compactMode: false,
    touchOptimized: false,
    lowDataMode: false,
    offlineFirst: false
  });

  // Detectar información del dispositivo
  const detectDeviceInfo = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Detectar tipo de dispositivo
    const isMobile = width < 768 || /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = (width >= 768 && width < 1024) || /ipad|tablet|playbook|silk/i.test(userAgent);
    const isDesktop = width >= 1024 && !isMobile && !isTablet;
    
    // Detectar touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Detectar capacidad de hover
    const hasHover = window.matchMedia('(hover: hover)').matches;
    
    // Determinar tamaño de pantalla
    let screenSize: DeviceInfo['screenSize'] = 'lg';
    if (width < 640) screenSize = 'xs';
    else if (width < 768) screenSize = 'sm';
    else if (width < 1024) screenSize = 'md';
    else if (width < 1280) screenSize = 'lg';
    else screenSize = 'xl';
    
    // Determinar orientación
    const orientation: DeviceInfo['orientation'] = height > width ? 'portrait' : 'landscape';
    
    // Determinar tipo de dispositivo específico
    let deviceType: DeviceInfo['deviceType'] = 'desktop';
    if (isMobile && !isTablet) deviceType = 'phone';
    else if (isTablet) deviceType = 'tablet';
    
    const newDeviceInfo: DeviceInfo = {
      isMobile,
      isTablet,
      isDesktop,
      isTouchDevice,
      screenSize,
      orientation,
      deviceType,
      hasHover,
      pixelRatio: window.devicePixelRatio || 1,
      viewportHeight: height,
      viewportWidth: width
    };

    setDeviceInfo(newDeviceInfo);
    
    // Aplicar optimizaciones automáticas basadas en el dispositivo
    const autoOptimizations: MobileOptimizations = {
      reducedAnimations: isMobile || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      compactMode: screenSize === 'xs' || screenSize === 'sm',
      touchOptimized: isTouchDevice,
      lowDataMode: /slow|2g|3g/.test((navigator as any).connection?.effectiveType || ''),
      offlineFirst: isMobile && 'serviceWorker' in navigator
    };

    setOptimizations(autoOptimizations);

    return newDeviceInfo;
  }, []);

  // Escuchar cambios de viewport
  useEffect(() => {
    detectDeviceInfo();

    const handleResize = () => {
      detectDeviceInfo();
    };

    const handleOrientationChange = () => {
      // Pequeño delay para que se complete el cambio
      setTimeout(detectDeviceInfo, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [detectDeviceInfo]);

  // Aplicar CSS variables para optimizaciones
  useEffect(() => {
    const root = document.documentElement;
    
    // Variables CSS para optimizaciones
    root.style.setProperty('--mobile-optimized', deviceInfo.isMobile ? '1' : '0');
    root.style.setProperty('--touch-optimized', deviceInfo.isTouchDevice ? '1' : '0');
    root.style.setProperty('--has-hover', deviceInfo.hasHover ? '1' : '0');
    root.style.setProperty('--screen-width', `${deviceInfo.viewportWidth}px`);
    root.style.setProperty('--screen-height', `${deviceInfo.viewportHeight}px`);
    root.style.setProperty('--pixel-ratio', deviceInfo.pixelRatio.toString());
    
    // Clases CSS para el body
    document.body.classList.toggle('mobile-device', deviceInfo.isMobile);
    document.body.classList.toggle('tablet-device', deviceInfo.isTablet);
    document.body.classList.toggle('desktop-device', deviceInfo.isDesktop);
    document.body.classList.toggle('touch-device', deviceInfo.isTouchDevice);
    document.body.classList.toggle('no-hover', !deviceInfo.hasHover);
    document.body.classList.toggle('portrait', deviceInfo.orientation === 'portrait');
    document.body.classList.toggle('landscape', deviceInfo.orientation === 'landscape');
    
    // Optimizaciones
    document.body.classList.toggle('reduced-animations', optimizations.reducedAnimations);
    document.body.classList.toggle('compact-mode', optimizations.compactMode);
    document.body.classList.toggle('low-data-mode', optimizations.lowDataMode);
    
  }, [deviceInfo, optimizations]);

  // Configuraciones específicas para móvil
  const getMobileConfig = useCallback(() => {
    return {
      // Configuración de touch
      touchTargetSize: deviceInfo.isMobile ? 44 : 32,
      minimumTouchGap: deviceInfo.isMobile ? 8 : 4,
      
      // Configuración de viewport
      viewportPadding: deviceInfo.isMobile ? 16 : 24,
      contentMaxWidth: deviceInfo.screenSize === 'xs' ? '100%' : '1200px',
      
      // Configuración de tipografía
      baseFontSize: deviceInfo.isMobile ? 16 : 14,
      lineHeight: deviceInfo.isMobile ? 1.6 : 1.5,
      
      // Configuración de animaciones
      animationDuration: optimizations.reducedAnimations ? 0 : 300,
      transitionDuration: optimizations.reducedAnimations ? 0 : 200,
      
      // Configuración de imágenes
      imageQuality: optimizations.lowDataMode ? 'low' : 'high',
      lazyLoadThreshold: deviceInfo.isMobile ? 100 : 200,
      
      // Configuración de networking
      prefetchEnabled: !optimizations.lowDataMode,
      cacheStrategy: optimizations.offlineFirst ? 'cache-first' : 'network-first'
    };
  }, [deviceInfo, optimizations]);

  // Funciones de utilidad
  const isSmallScreen = useCallback(() => {
    return deviceInfo.screenSize === 'xs' || deviceInfo.screenSize === 'sm';
  }, [deviceInfo.screenSize]);

  const isMediumScreen = useCallback(() => {
    return deviceInfo.screenSize === 'md';
  }, [deviceInfo.screenSize]);

  const isLargeScreen = useCallback(() => {
    return deviceInfo.screenSize === 'lg' || deviceInfo.screenSize === 'xl';
  }, [deviceInfo.screenSize]);

  const shouldUseCompactLayout = useCallback(() => {
    return optimizations.compactMode || deviceInfo.screenSize === 'xs';
  }, [optimizations.compactMode, deviceInfo.screenSize]);

  const shouldReduceAnimations = useCallback(() => {
    return optimizations.reducedAnimations;
  }, [optimizations.reducedAnimations]);

  const shouldUseTouchOptimizations = useCallback(() => {
    return optimizations.touchOptimized || deviceInfo.isTouchDevice;
  }, [optimizations.touchOptimized, deviceInfo.isTouchDevice]);

  // Configurar optimizaciones manuales
  const setOptimization = useCallback((key: keyof MobileOptimizations, value: boolean) => {
    setOptimizations(prev => ({ ...prev, [key]: value }));
  }, []);

  // Obtener clase CSS apropiada
  const getResponsiveClass = useCallback((classes: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    mobile?: string;
    tablet?: string;
    desktop?: string;
    touch?: string;
    hover?: string;
  }) => {
    const classNames: string[] = [];

    // Por tamaño de pantalla
    if (classes[deviceInfo.screenSize]) {
      classNames.push(classes[deviceInfo.screenSize]!);
    }

    // Por tipo de dispositivo
    if (deviceInfo.isMobile && classes.mobile) {
      classNames.push(classes.mobile);
    }
    if (deviceInfo.isTablet && classes.tablet) {
      classNames.push(classes.tablet);
    }
    if (deviceInfo.isDesktop && classes.desktop) {
      classNames.push(classes.desktop);
    }

    // Por capacidades
    if (deviceInfo.isTouchDevice && classes.touch) {
      classNames.push(classes.touch);
    }
    if (deviceInfo.hasHover && classes.hover) {
      classNames.push(classes.hover);
    }

    return classNames.join(' ');
  }, [deviceInfo]);

  // Detectar si estamos en modo pantalla completa móvil (PWA)
  const isFullscreenMobile = useCallback(() => {
    return deviceInfo.isMobile && (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://')
    );
  }, [deviceInfo.isMobile]);

  return {
    // Información del dispositivo
    deviceInfo,
    
    // Optimizaciones activas
    optimizations,
    
    // Configuración móvil
    mobileConfig: getMobileConfig(),
    
    // Funciones de utilidad
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    shouldUseCompactLayout,
    shouldReduceAnimations,
    shouldUseTouchOptimizations,
    isFullscreenMobile,
    
    // Helpers para CSS
    getResponsiveClass,
    
    // Configuración manual
    setOptimization,
    
    // Detección manual
    detectDeviceInfo
  };
}

// Hook para gestos touch
export function useTouchGestures() {
  const [touchState, setTouchState] = useState({
    isTouch: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    direction: null as 'left' | 'right' | 'up' | 'down' | null,
    distance: 0,
    duration: 0,
    startTime: 0
  });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const startTime = Date.now();
    
    setTouchState({
      isTouch: true,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX: 0,
      deltaY: 0,
      direction: null,
      distance: 0,
      duration: 0,
      startTime
    });
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    
    setTouchState(prev => {
      if (!prev.isTouch) return prev;
      
      const deltaX = touch.clientX - prev.startX;
      const deltaY = touch.clientY - prev.startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      let direction: typeof prev.direction = null;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      return {
        ...prev,
        currentX: touch.clientX,
        currentY: touch.clientY,
        deltaX,
        deltaY,
        direction,
        distance,
        duration: Date.now() - prev.startTime
      };
    });
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTouchState(prev => ({
      ...prev,
      isTouch: false,
      duration: Date.now() - prev.startTime
    }));
  }, []);

  const isSwipeGesture = useCallback((minDistance: number = 50, maxDuration: number = 1000) => {
    return !touchState.isTouch && 
           touchState.distance >= minDistance && 
           touchState.duration <= maxDuration;
  }, [touchState]);

  const isSwipeLeft = useCallback((minDistance: number = 50) => {
    return isSwipeGesture(minDistance) && touchState.direction === 'left';
  }, [isSwipeGesture, touchState.direction]);

  const isSwipeRight = useCallback((minDistance: number = 50) => {
    return isSwipeGesture(minDistance) && touchState.direction === 'right';
  }, [isSwipeGesture, touchState.direction]);

  const isSwipeUp = useCallback((minDistance: number = 50) => {
    return isSwipeGesture(minDistance) && touchState.direction === 'up';
  }, [isSwipeGesture, touchState.direction]);

  const isSwipeDown = useCallback((minDistance: number = 50) => {
    return isSwipeGesture(minDistance) && touchState.direction === 'down';
  }, [isSwipeGesture, touchState.direction]);

  return {
    touchState,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    gestures: {
      isSwipeGesture,
      isSwipeLeft,
      isSwipeRight,
      isSwipeUp,
      isSwipeDown
    }
  };
}