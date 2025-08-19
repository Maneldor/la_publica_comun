import { useState, useEffect, useCallback } from 'react';

// Tipos para el sistema offline
interface OfflineAction {
  id: string;
  type: 'send_message' | 'mark_read' | 'delete_message' | 'add_reaction' | 'remove_reaction';
  data: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

interface OfflineState {
  isOnline: boolean;
  pendingActions: OfflineAction[];
  syncInProgress: boolean;
  lastSyncTime: number | null;
  conflictResolution: 'server' | 'local' | 'manual';
}

interface SyncResult {
  successful: number;
  failed: number;
  conflicts: number;
  errors: any[];
}

// Hook principal para manejo offline
export function useOfflineSync(apiUrl: string = 'http://localhost:3001') {
  const [state, setState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    pendingActions: [],
    syncInProgress: false,
    lastSyncTime: null,
    conflictResolution: 'server'
  });

  // Inicializar desde localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('offline-sync-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(prev => ({
          ...prev,
          pendingActions: parsed.pendingActions || [],
          lastSyncTime: parsed.lastSyncTime || null,
          conflictResolution: parsed.conflictResolution || 'server'
        }));
      } catch (error) {
        console.error('Error cargando estado offline:', error);
      }
    }
  }, []);

  // Guardar estado en localStorage
  const saveState = useCallback((newState: Partial<OfflineState>) => {
    setState(prev => {
      const updated = { ...prev, ...newState };
      
      // Guardar solo lo necesario en localStorage
      const toSave = {
        pendingActions: updated.pendingActions,
        lastSyncTime: updated.lastSyncTime,
        conflictResolution: updated.conflictResolution
      };
      
      localStorage.setItem('offline-sync-state', JSON.stringify(toSave));
      return updated;
    });
  }, []);

  // Escuchar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Conexión restaurada, iniciando sincronización...');
      saveState({ isOnline: true });
      
      // Sincronizar automáticamente cuando vuelve la conexión
      setTimeout(() => {
        syncPendingActions();
      }, 1000);
    };

    const handleOffline = () => {
      console.log('📡 Sin conexión, entrando en modo offline');
      saveState({ isOnline: false });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Añadir acción a la cola offline
  const addOfflineAction = useCallback((
    type: OfflineAction['type'], 
    data: any, 
    maxRetries: number = 3
  ): string => {
    const action: OfflineAction = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      retries: 0,
      maxRetries
    };

    const newPendingActions = [...state.pendingActions, action];
    saveState({ pendingActions: newPendingActions });

    console.log(`📝 Acción añadida a cola offline: ${type}`, action);
    
    // Si estamos online, intentar sincronizar inmediatamente
    if (state.isOnline && !state.syncInProgress) {
      setTimeout(() => syncPendingActions(), 100);
    }

    return action.id;
  }, [state.pendingActions, state.isOnline, state.syncInProgress]);

  // Ejecutar una acción individual
  const executeAction = async (action: OfflineAction): Promise<boolean> => {
    try {
      let response;
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      switch (action.type) {
        case 'send_message':
          response = await fetch(`${apiUrl}/api/messaging/messages`, {
            method: 'POST',
            headers,
            body: JSON.stringify(action.data)
          });
          break;

        case 'mark_read':
          response = await fetch(`${apiUrl}/api/messaging/messages/${action.data.messageId}/read`, {
            method: 'PATCH',
            headers
          });
          break;

        case 'delete_message':
          response = await fetch(`${apiUrl}/api/messaging/messages/${action.data.messageId}`, {
            method: 'DELETE',
            headers
          });
          break;

        case 'add_reaction':
          response = await fetch(`${apiUrl}/api/messaging/messages/${action.data.messageId}/reactions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ emoji: action.data.emoji })
          });
          break;

        case 'remove_reaction':
          response = await fetch(`${apiUrl}/api/messaging/messages/${action.data.messageId}/reactions`, {
            method: 'DELETE',
            headers,
            body: JSON.stringify({ emoji: action.data.emoji })
          });
          break;

        default:
          console.warn('Tipo de acción no reconocido:', action.type);
          return false;
      }

      if (response && response.ok) {
        console.log(`✅ Acción sincronizada: ${action.type}`);
        return true;
      } else {
        const error = response ? await response.text() : 'Sin respuesta';
        console.error(`❌ Error sincronizando ${action.type}:`, error);
        return false;
      }

    } catch (error) {
      console.error(`❌ Error ejecutando acción ${action.type}:`, error);
      return false;
    }
  };

  // Sincronizar todas las acciones pendientes
  const syncPendingActions = useCallback(async (): Promise<SyncResult> => {
    if (state.syncInProgress || !state.isOnline || state.pendingActions.length === 0) {
      return { successful: 0, failed: 0, conflicts: 0, errors: [] };
    }

    console.log(`🔄 Iniciando sincronización de ${state.pendingActions.length} acciones`);
    
    saveState({ syncInProgress: true });

    const result: SyncResult = {
      successful: 0,
      failed: 0,
      conflicts: 0,
      errors: []
    };

    const remainingActions: OfflineAction[] = [];

    for (const action of state.pendingActions) {
      try {
        const success = await executeAction(action);
        
        if (success) {
          result.successful++;
          // No añadir a remainingActions (se elimina)
        } else {
          // Incrementar reintentos
          const updatedAction = {
            ...action,
            retries: action.retries + 1
          };

          if (updatedAction.retries < updatedAction.maxRetries) {
            remainingActions.push(updatedAction);
            console.log(`🔁 Reintentando acción ${action.type} (${updatedAction.retries}/${updatedAction.maxRetries})`);
          } else {
            result.failed++;
            result.errors.push({
              actionId: action.id,
              type: action.type,
              error: 'Máximo de reintentos alcanzado'
            });
            console.error(`💀 Acción ${action.type} descartada tras ${action.maxRetries} reintentos`);
          }
        }
      } catch (error) {
        result.errors.push({
          actionId: action.id,
          type: action.type,
          error: error instanceof Error ? error.message : 'Error desconocido'
        });
        
        // Mantener para reintento si no se han agotado
        if (action.retries < action.maxRetries) {
          remainingActions.push({
            ...action,
            retries: action.retries + 1
          });
        } else {
          result.failed++;
        }
      }

      // Pequeña pausa entre acciones para no saturar
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    saveState({
      pendingActions: remainingActions,
      syncInProgress: false,
      lastSyncTime: Date.now()
    });

    console.log(`✅ Sincronización completada:`, result);
    return result;
  }, [state.syncInProgress, state.isOnline, state.pendingActions, apiUrl]);

  // Limpiar acciones antiguas (más de 7 días)
  const cleanOldActions = useCallback(() => {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const filteredActions = state.pendingActions.filter(
      action => action.timestamp > sevenDaysAgo
    );

    if (filteredActions.length !== state.pendingActions.length) {
      const removed = state.pendingActions.length - filteredActions.length;
      console.log(`🧹 Limpiadas ${removed} acciones antiguas`);
      saveState({ pendingActions: filteredActions });
    }
  }, [state.pendingActions]);

  // Limpiar automáticamente cada hora
  useEffect(() => {
    const interval = setInterval(cleanOldActions, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [cleanOldActions]);

  // Forzar sincronización manual
  const forcSync = useCallback(async (): Promise<SyncResult> => {
    if (!state.isOnline) {
      throw new Error('Sin conexión a internet');
    }
    return syncPendingActions();
  }, [state.isOnline, syncPendingActions]);

  // Limpiar todas las acciones pendientes
  const clearPendingActions = useCallback(() => {
    saveState({ pendingActions: [] });
    console.log('🗑️ Cola de acciones offline limpiada');
  }, []);

  // Obtener estadísticas
  const getStats = useCallback(() => {
    const actionsByType = state.pendingActions.reduce((acc, action) => {
      acc[action.type] = (acc[action.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPending: state.pendingActions.length,
      actionsByType,
      oldestAction: state.pendingActions.length > 0 
        ? Math.min(...state.pendingActions.map(a => a.timestamp))
        : null,
      lastSyncTime: state.lastSyncTime,
      isOnline: state.isOnline,
      syncInProgress: state.syncInProgress
    };
  }, [state]);

  return {
    // Estado
    isOnline: state.isOnline,
    pendingActions: state.pendingActions,
    syncInProgress: state.syncInProgress,
    lastSyncTime: state.lastSyncTime,
    
    // Acciones
    addOfflineAction,
    syncPendingActions,
    forcSync,
    clearPendingActions,
    getStats,
    
    // Configuración
    setConflictResolution: (strategy: OfflineState['conflictResolution']) => {
      saveState({ conflictResolution: strategy });
    }
  };
}

// Hook para operaciones offline específicas de mensajería
export function useOfflineMessaging(apiUrl?: string) {
  const offlineSync = useOfflineSync(apiUrl);

  const sendMessageOffline = useCallback(async (messageData: any) => {
    if (offlineSync.isOnline) {
      // Si estamos online, enviar directamente
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/messaging/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(messageData)
        });

        if (response.ok) {
          return await response.json();
        } else {
          throw new Error('Error enviando mensaje');
        }
      } catch (error) {
        // Si falla, añadir a cola offline
        console.log('💾 Error online, guardando mensaje para sincronización posterior');
        const actionId = offlineSync.addOfflineAction('send_message', messageData);
        return { offline: true, actionId, tempId: `temp_${Date.now()}` };
      }
    } else {
      // Si estamos offline, añadir directamente a la cola
      console.log('📡 Sin conexión, guardando mensaje para enviar más tarde');
      const actionId = offlineSync.addOfflineAction('send_message', messageData);
      return { offline: true, actionId, tempId: `temp_${Date.now()}` };
    }
  }, [offlineSync, apiUrl]);

  const markAsReadOffline = useCallback((messageId: string) => {
    return offlineSync.addOfflineAction('mark_read', { messageId });
  }, [offlineSync]);

  const deleteMessageOffline = useCallback((messageId: string) => {
    return offlineSync.addOfflineAction('delete_message', { messageId });
  }, [offlineSync]);

  const addReactionOffline = useCallback((messageId: string, emoji: string) => {
    return offlineSync.addOfflineAction('add_reaction', { messageId, emoji });
  }, [offlineSync]);

  const removeReactionOffline = useCallback((messageId: string, emoji: string) => {
    return offlineSync.addOfflineAction('remove_reaction', { messageId, emoji });
  }, [offlineSync]);

  return {
    ...offlineSync,
    sendMessageOffline,
    markAsReadOffline,
    deleteMessageOffline,
    addReactionOffline,
    removeReactionOffline
  };
}