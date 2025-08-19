'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMobileOptimization, useTouchGestures } from '../../../hooks/useMobileOptimization';

// Botón optimizado para móvil
interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  hapticFeedback?: boolean;
  children: React.ReactNode;
}

export function MobileButton({ 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  hapticFeedback = true,
  children,
  onClick,
  className = '',
  ...props 
}: MobileButtonProps) {
  const { deviceInfo, shouldUseTouchOptimizations } = useMobileOptimization();
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Vibración háptica en móviles
    if (hapticFeedback && 'vibrate' in navigator && deviceInfo.isMobile) {
      navigator.vibrate(10);
    }
    onClick?.(e);
  };

  const sizeClasses = {
    sm: shouldUseTouchOptimizations() ? 'px-3 py-2 text-sm min-h-[40px]' : 'px-3 py-1.5 text-sm',
    md: shouldUseTouchOptimizations() ? 'px-4 py-3 text-base min-h-[44px]' : 'px-4 py-2 text-sm',
    lg: shouldUseTouchOptimizations() ? 'px-6 py-4 text-lg min-h-[52px]' : 'px-6 py-3 text-base'
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
  };

  return (
    <button
      onClick={handleClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${isPressed ? 'scale-95' : ''}
        ${shouldUseTouchOptimizations() ? 'touch-manipulation' : ''}
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

// Lista optimizada con virtualización
interface MobileListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  gap?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  emptyState?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function MobileList<T>({ 
  items, 
  renderItem,
  itemHeight = 80,
  gap = 0,
  onEndReached,
  endReachedThreshold = 100,
  emptyState,
  header,
  footer,
  className = ''
}: MobileListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const { deviceInfo } = useMobileOptimization();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;

      // Calcular rango visible
      const start = Math.floor(scrollTop / (itemHeight + gap));
      const visibleCount = Math.ceil(containerHeight / (itemHeight + gap));
      const end = Math.min(start + visibleCount + 5, items.length); // Buffer de 5 items

      setVisibleRange({ start: Math.max(0, start - 5), end });

      // Detectar cuando llegamos al final
      if (onEndReached && scrollHeight - scrollTop - containerHeight < endReachedThreshold) {
        onEndReached();
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Calcular inicial

    return () => container.removeEventListener('scroll', handleScroll);
  }, [items.length, itemHeight, gap, onEndReached, endReachedThreshold]);

  const totalHeight = items.length * (itemHeight + gap);
  const offsetY = visibleRange.start * (itemHeight + gap);
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  if (items.length === 0 && emptyState) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        {emptyState}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`overflow-y-auto overscroll-contain ${
        deviceInfo.isMobile ? '-webkit-overflow-scrolling-touch' : ''
      } ${className}`}
    >
      {header}
      
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div 
          style={{ 
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div 
              key={visibleRange.start + index}
              style={{ 
                height: itemHeight,
                marginBottom: index < visibleItems.length - 1 ? gap : 0
              }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
      
      {footer}
    </div>
  );
}

// Drawer móvil con soporte de gestos
interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'bottom';
  children: React.ReactNode;
  className?: string;
}

export function MobileDrawer({ 
  isOpen, 
  onClose, 
  position = 'bottom',
  children,
  className = ''
}: MobileDrawerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [translateValue, setTranslateValue] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { deviceInfo } = useMobileOptimization();
  
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (!isOpen) {
      setTranslateValue(0);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !drawerRef.current) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    
    let delta = 0;
    
    if (position === 'bottom') {
      delta = currentY - touchStartY.current;
      // Solo permitir arrastrar hacia abajo
      if (delta > 0) {
        setTranslateValue(delta);
      }
    } else if (position === 'left') {
      delta = currentX - touchStartX.current;
      // Solo permitir arrastrar hacia la izquierda
      if (delta < 0) {
        setTranslateValue(delta);
      }
    } else if (position === 'right') {
      delta = currentX - touchStartX.current;
      // Solo permitir arrastrar hacia la derecha
      if (delta > 0) {
        setTranslateValue(delta);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || !drawerRef.current) return;
    
    setIsDragging(false);
    
    const threshold = position === 'bottom' 
      ? drawerRef.current.offsetHeight * 0.3
      : drawerRef.current.offsetWidth * 0.3;
    
    if (Math.abs(translateValue) > threshold) {
      onClose();
    }
    
    setTranslateValue(0);
  };

  const positionClasses = {
    left: 'left-0 top-0 h-full w-[80vw] max-w-sm',
    right: 'right-0 top-0 h-full w-[80vw] max-w-sm',
    bottom: 'bottom-0 left-0 right-0 max-h-[90vh]'
  };

  const transformStyle = {
    left: `translateX(${isOpen ? translateValue : '-100%'})`,
    right: `translateX(${isOpen ? translateValue : '100%'})`,
    bottom: `translateY(${isOpen ? translateValue : '100%'})`
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
          style={{ opacity: isOpen && translateValue === 0 ? 1 : 0.5 }}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`
          fixed z-50 bg-white shadow-xl
          ${positionClasses[position]}
          ${isDragging ? '' : 'transition-transform duration-300'}
          ${className}
        `}
        style={{
          transform: transformStyle[position],
          touchAction: 'none'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle para arrastrar */}
        {position === 'bottom' && deviceInfo.isMobile && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
        )}
        
        {children}
      </div>
    </>
  );
}

// Input optimizado para móvil
interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  onClear?: () => void;
}

export function MobileInput({ 
  label, 
  error, 
  icon,
  onClear,
  className = '',
  ...props 
}: MobileInputProps) {
  const { shouldUseTouchOptimizations } = useMobileOptimization();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className={`relative ${isFocused ? 'ring-2 ring-blue-500' : ''} rounded-lg`}>
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full
            ${shouldUseTouchOptimizations() ? 'px-4 py-3 text-base' : 'px-3 py-2 text-sm'}
            ${icon ? 'pl-10' : ''}
            ${onClear && props.value ? 'pr-10' : ''}
            border border-gray-300 rounded-lg
            focus:outline-none focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
        />
        
        {onClear && props.value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Tab optimizado para móvil con scroll horizontal
interface MobileTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: number;
  }>;
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function MobileTabs({ tabs, activeTab, onChange, className = '' }: MobileTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { deviceInfo } = useMobileOptimization();

  useEffect(() => {
    // Auto-scroll para mantener el tab activo visible
    if (containerRef.current && deviceInfo.isMobile) {
      const activeElement = containerRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeTab, deviceInfo.isMobile]);

  return (
    <div 
      ref={containerRef}
      className={`
        flex overflow-x-auto hide-scrollbar
        ${deviceInfo.isMobile ? '-mx-4 px-4' : ''}
        ${className}
      `}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="flex space-x-1 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium
              transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              ${deviceInfo.isMobile ? 'text-sm whitespace-nowrap' : 'text-sm'}
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`
                ml-1 px-1.5 py-0.5 text-xs rounded-full
                ${activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}
              `}>
                {tab.badge > 99 ? '99+' : tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Card optimizado con soporte de swipe
interface MobileCardProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  swipeThreshold?: number;
  children: React.ReactNode;
  className?: string;
}

export function MobileCard({ 
  onSwipeLeft,
  onSwipeRight,
  swipeThreshold = 100,
  children,
  className = ''
}: MobileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartX = useRef(0);
  const { deviceInfo } = useMobileOptimization();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!deviceInfo.isMobile) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!deviceInfo.isMobile || !cardRef.current) return;
    
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - touchStartX.current;
    
    // Limitar el desplazamiento
    const maxSwipe = cardRef.current.offsetWidth * 0.3;
    const limitedDelta = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
    
    setSwipeOffset(limitedDelta);
  };

  const handleTouchEnd = () => {
    if (!deviceInfo.isMobile) return;
    
    if (Math.abs(swipeOffset) > swipeThreshold) {
      if (swipeOffset > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (swipeOffset < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
    
    setSwipeOffset(0);
  };

  return (
    <div
      ref={cardRef}
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200
        transition-transform duration-200
        ${className}
      `}
      style={{
        transform: `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.02}deg)`,
        opacity: 1 - Math.abs(swipeOffset) / 500
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}