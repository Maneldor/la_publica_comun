'use client';

import React, { useState, useEffect } from 'react';
import { useOfflineSync } from '../../../hooks/useOfflineSync';

interface OfflineIndicatorProps {
  className?: string;
  showDetails?: boolean;
  apiUrl?: string;
}

// Componente principal de indicador offline
export function OfflineIndicator({ 
  className = '', 
  showDetails = false,
  apiUrl 
}: OfflineIndicatorProps) {
  const offlineSync = useOfflineSync(apiUrl);
  const [showFullStats, setShowFullStats] = useState(false);
  
  const stats = offlineSync.getStats();

  // No mostrar nada si estamos online y no hay acciones pendientes
  if (offlineSync.isOnline && stats.totalPending === 0) {
    return null;
  }

  const handleSync = async () => {
    try {
      await offlineSync.forcSync();
    } catch (error) {
      console.error('Error en sincronización manual:', error);
    }
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-40 ${className}`}>
      <div className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
        offlineSync.isOnline 
          ? 'bg-blue-600 text-white' 
          : 'bg-orange-600 text-white'
      }`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-lg">
              {offlineSync.isOnline ? '🔄' : '📡'}
            </span>
            
            <div>
              {offlineSync.isOnline ? (
                stats.totalPending > 0 ? (
                  offlineSync.syncInProgress ? (
                    <span>Sincronizando {stats.totalPending} acciones...</span>
                  ) : (
                    <span>{stats.totalPending} acciones pendientes de sincronizar</span>
                  )
                ) : (
                  <span>Todo sincronizado</span>
                )
              ) : (
                <span>
                  Sin conexión
                  {stats.totalPending > 0 && ` • ${stats.totalPending} acciones guardadas`}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showDetails && stats.totalPending > 0 && (
              <button
                onClick={() => setShowFullStats(!showFullStats)}
                className="px-2 py-1 text-xs bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
              >
                {showFullStats ? 'Ocultar' : 'Detalles'}
              </button>
            )}
            
            {offlineSync.isOnline && stats.totalPending > 0 && !offlineSync.syncInProgress && (
              <button
                onClick={handleSync}
                className="px-3 py-1 text-xs bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
              >
                Sincronizar ahora
              </button>
            )}
            
            {stats.totalPending > 0 && (
              <button
                onClick={offlineSync.clearPendingActions}
                className="px-2 py-1 text-xs bg-red-500 bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
                title="Limpiar cola"
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        {/* Estadísticas detalladas */}
        {showFullStats && stats.totalPending > 0 && (
          <div className="mt-3 pt-3 border-t border-white border-opacity-20">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                {Object.entries(stats.actionsByType).map(([type, count]) => (
                  <div key={type} className="bg-white bg-opacity-10 rounded p-2">
                    <div className="font-medium capitalize">
                      {type.replace('_', ' ')}
                    </div>
                    <div className="text-white text-opacity-80">
                      {count} pendiente{count !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
              
              {stats.lastSyncTime && (
                <div className="mt-2 text-xs text-white text-opacity-70">
                  Última sincronización: {new Date(stats.lastSyncTime).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Barra de progreso de sincronización */}
      {offlineSync.syncInProgress && (
        <div className="h-1 bg-white bg-opacity-20">
          <div className="h-full bg-white bg-opacity-40 animate-pulse"></div>
        </div>
      )}
    </div>
  );
}

// Componente compacto solo para mostrar estado
export function OfflineStatusBadge({ 
  className = '',
  onClick 
}: { 
  className?: string;
  onClick?: () => void;
}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
        isOnline 
          ? 'bg-green-100 text-green-800' 
          : 'bg-orange-100 text-orange-800 animate-pulse'
      } ${className}`}
    >
      <div className={`w-2 h-2 rounded-full ${
        isOnline ? 'bg-green-500' : 'bg-orange-500'
      }`}></div>
      {isOnline ? 'Online' : 'Offline'}
    </button>
  );
}

// Panel de gestión offline para configuración
export function OfflineManagementPanel() {
  const offlineSync = useOfflineSync();
  const [isExpanded, setIsExpanded] = useState(false);
  const stats = offlineSync.getStats();

  const handleClearAll = () => {
    if (confirm('¿Estás seguro de que quieres eliminar todas las acciones pendientes?')) {
      offlineSync.clearPendingActions();
    }
  };

  const handleForceSync = async () => {
    try {
      const result = await offlineSync.forcSync();
      alert(`Sincronización completada: ${result.successful} exitosas, ${result.failed} fallidas`);
    } catch (error) {
      alert('Error en la sincronización: ' + (error as Error).message);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {offlineSync.isOnline ? '🌐' : '📡'}
            </span>
            <div>
              <h3 className="font-semibold">Modo Offline</h3>
              <p className="text-sm text-gray-600">
                {offlineSync.isOnline ? 'Conectado' : 'Sin conexión'} • 
                {stats.totalPending} acciones pendientes
              </p>
            </div>
          </div>
          <span className={`transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}>
            ▼
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="mt-4 space-y-4">
            {/* Estado actual */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm font-medium text-gray-600">Estado</div>
                <div className="text-lg font-semibold">
                  {offlineSync.isOnline ? '🟢 Online' : '🔴 Offline'}
                </div>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm font-medium text-gray-600">Acciones pendientes</div>
                <div className="text-lg font-semibold">{stats.totalPending}</div>
              </div>
            </div>

            {/* Desglose por tipo */}
            {Object.keys(stats.actionsByType).length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Acciones por tipo:</h4>
                <div className="space-y-1">
                  {Object.entries(stats.actionsByType).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="capitalize">{type.replace('_', ' ')}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Información adicional */}
            {stats.lastSyncTime && (
              <div className="text-sm text-gray-600">
                Última sincronización: {new Date(stats.lastSyncTime).toLocaleString()}
              </div>
            )}

            {stats.oldestAction && (
              <div className="text-sm text-gray-600">
                Acción más antigua: {new Date(stats.oldestAction).toLocaleString()}
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-2 pt-2">
              {offlineSync.isOnline && stats.totalPending > 0 && (
                <button
                  onClick={handleForceSync}
                  disabled={offlineSync.syncInProgress}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {offlineSync.syncInProgress ? 'Sincronizando...' : 'Sincronizar'}
                </button>
              )}
              
              {stats.totalPending > 0 && (
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
                >
                  Limpiar todo
                </button>
              )}
            </div>

            {/* Estado de sincronización */}
            {offlineSync.syncInProgress && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Sincronizando acciones pendientes...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}