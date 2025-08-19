'use client';

import React, { useState, useEffect } from 'react';
import { useMobileOptimization } from '../../../hooks/useMobileOptimization';
import { usePWA } from '../../../hooks/usePWA';

interface MobileLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  bottomNav?: React.ReactNode;
  floatingAction?: React.ReactNode;
  showOfflineIndicator?: boolean;
  className?: string;
}

// Layout principal optimizado para móvil
export function MobileLayout({
  children,
  header,
  footer,
  bottomNav,
  floatingAction,
  showOfflineIndicator = true,
  className = ''
}: MobileLayoutProps) {
  const { deviceInfo, isFullscreenMobile } = useMobileOptimization();
  const { isOnline } = usePWA();
  const [scrolled, setScrolled] = useState(false);
  const [viewportHeight, setViewportHeight] = useState('100vh');

  // Manejar altura del viewport en móviles
  useEffect(() => {
    const updateViewportHeight = () => {
      // Usar window.innerHeight para manejar correctamente las barras del navegador
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      setViewportHeight(`${window.innerHeight}px`);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);

  // Detectar scroll para efectos en el header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calcular padding inferior para bottom nav
  const bottomPadding = bottomNav ? (deviceInfo.isMobile ? 'pb-20' : 'pb-16') : '';

  return (
    <div 
      className={`flex flex-col ${className}`}
      style={{ 
        minHeight: viewportHeight,
        height: deviceInfo.isMobile ? viewportHeight : 'auto'
      }}
    >
      {/* Indicador offline */}
      {showOfflineIndicator && !isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-orange-600 text-white text-center py-1 text-sm">
          📡 Sin conexión
        </div>
      )}

      {/* Header */}
      {header && (
        <div 
          className={`
            sticky top-0 z-40 transition-all duration-200
            ${scrolled ? 'shadow-md' : ''}
            ${!isOnline ? 'top-7' : ''}
          `}
        >
          {header}
        </div>
      )}

      {/* Contenido principal */}
      <main className={`flex-1 overflow-y-auto ${bottomPadding}`}>
        {children}
      </main>

      {/* Footer opcional */}
      {footer && !deviceInfo.isMobile && (
        <footer className="mt-auto">
          {footer}
        </footer>
      )}

      {/* Navegación inferior para móvil */}
      {bottomNav && (
        <div className={`
          fixed bottom-0 left-0 right-0 z-40
          ${isFullscreenMobile() ? 'pb-safe' : ''}
        `}>
          {bottomNav}
        </div>
      )}

      {/* Botón flotante */}
      {floatingAction && (
        <div className={`
          fixed z-30
          ${bottomNav 
            ? deviceInfo.isMobile ? 'bottom-24' : 'bottom-20' 
            : 'bottom-6'
          }
          right-6
        `}>
          {floatingAction}
        </div>
      )}
    </div>
  );
}

// Header móvil con animaciones
interface MobileHeaderProps {
  title?: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightActions?: React.ReactNode[];
  transparent?: boolean;
  className?: string;
}

export function MobileHeader({
  title,
  subtitle,
  leftAction,
  rightActions = [],
  transparent = false,
  className = ''
}: MobileHeaderProps) {
  const { deviceInfo } = useMobileOptimization();

  return (
    <header className={`
      ${transparent ? 'bg-transparent' : 'bg-white'}
      ${deviceInfo.isMobile ? 'px-4 py-3' : 'px-6 py-4'}
      ${className}
    `}>
      <div className="flex items-center justify-between">
        {/* Acción izquierda */}
        <div className="flex items-center gap-3">
          {leftAction && (
            <div className="-ml-2">
              {leftAction}
            </div>
          )}
          
          {/* Título */}
          {title && (
            <div>
              <h1 className={`
                font-semibold text-gray-900
                ${deviceInfo.isMobile ? 'text-lg' : 'text-xl'}
              `}>
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Acciones derechas */}
        {rightActions.length > 0 && (
          <div className="flex items-center gap-2 -mr-2">
            {rightActions.map((action, index) => (
              <div key={index}>{action}</div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

// Navegación inferior para móvil
interface MobileBottomNavProps {
  items: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    onClick: () => void;
  }>;
  activeId: string;
  className?: string;
}

export function MobileBottomNav({ items, activeId, className = '' }: MobileBottomNavProps) {
  const { deviceInfo } = useMobileOptimization();

  return (
    <nav className={`
      bg-white border-t border-gray-200
      ${deviceInfo.isMobile ? 'px-2 py-2' : 'px-4 py-3'}
      ${className}
    `}>
      <div className="flex justify-around items-center">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`
              flex flex-col items-center justify-center
              ${deviceInfo.isMobile ? 'px-3 py-2' : 'px-4 py-2'}
              rounded-lg transition-colors relative
              ${activeId === item.id
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <div className="relative">
              {item.icon}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className={`
              mt-1 text-xs font-medium
              ${deviceInfo.isMobile ? 'text-[10px]' : 'text-xs'}
            `}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// Botón de acción flotante
interface MobileFloatingActionProps {
  icon: React.ReactNode;
  onClick: () => void;
  badge?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MobileFloatingAction({
  icon,
  onClick,
  badge,
  className = '',
  size = 'md'
}: MobileFloatingActionProps) {
  const { deviceInfo } = useMobileOptimization();
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: deviceInfo.isMobile ? 'w-12 h-12' : 'w-10 h-10',
    md: deviceInfo.isMobile ? 'w-14 h-14' : 'w-12 h-12',
    lg: deviceInfo.isMobile ? 'w-16 h-16' : 'w-14 h-14'
  };

  return (
    <button
      onClick={onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`
        ${sizeClasses[size]}
        bg-blue-600 text-white rounded-full shadow-lg
        flex items-center justify-center
        transition-all duration-200
        hover:bg-blue-700 active:scale-95
        ${isPressed ? 'scale-95 shadow-md' : 'shadow-lg'}
        ${className}
      `}
    >
      <div className="relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
    </button>
  );
}

// Panel de navegación lateral con gestos
interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right';
}

export function MobileSidebar({ 
  isOpen, 
  onClose, 
  children,
  position = 'left' 
}: MobileSidebarProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const { deviceInfo } = useMobileOptimization();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!deviceInfo.isMobile) return;
    setIsDragging(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !deviceInfo.isMobile) return;
    
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - touchStartX.current;
    
    if (position === 'left' && deltaX < 0) {
      setTranslateX(deltaX);
    } else if (position === 'right' && deltaX > 0) {
      setTranslateX(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (Math.abs(translateX) > 100) {
      onClose();
    }
    
    setTranslateX(0);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 h-full bg-white shadow-xl z-50
          ${position === 'left' ? 'left-0' : 'right-0'}
          ${deviceInfo.isMobile ? 'w-[85vw]' : 'w-80'}
          ${isDragging ? '' : 'transition-transform duration-300'}
          ${isOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'}
        `}
        style={{
          transform: `translateX(${isOpen ? translateX : position === 'left' ? '-100%' : '100%'}px)`
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </>
  );
}

// Contenedor con pull-to-refresh
interface MobilePullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export function MobilePullToRefresh({ 
  onRefresh, 
  children,
  className = '' 
}: MobilePullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const { deviceInfo } = useMobileOptimization();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!deviceInfo.isMobile || window.scrollY > 0) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!deviceInfo.isMobile || window.scrollY > 0 || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;
    
    if (deltaY > 0) {
      setIsPulling(true);
      // Aplicar resistencia
      const resistance = Math.min(deltaY * 0.5, 150);
      setPullDistance(resistance);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;
    
    setIsPulling(false);
    
    if (pullDistance > 80) {
      setIsRefreshing(true);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Indicador de pull-to-refresh */}
      <div
        className="flex justify-center overflow-hidden transition-all duration-300"
        style={{
          height: isRefreshing ? 60 : pullDistance,
          opacity: pullDistance > 40 ? 1 : pullDistance / 40
        }}
      >
        <div className="flex items-center justify-center">
          {isRefreshing ? (
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              className={`w-6 h-6 text-blue-600 transition-transform ${
                pullDistance > 80 ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
        </div>
      </div>

      {/* Contenido */}
      {children}
    </div>
  );
}