import { useState, useEffect, useCallback, useRef } from 'react';

// Tipos para el sistema de caché
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
  version?: string;
  size?: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheOptions {
  ttl?: number; // Time to live en ms
  maxSize?: number; // Tamaño máximo en bytes
  maxEntries?: number; // Número máximo de entradas
  strategy?: 'lru' | 'lfu' | 'fifo' | 'ttl'; // Estrategia de evicción
  persistence?: 'memory' | 'localStorage' | 'indexedDB';
  compress?: boolean; // Comprimir datos grandes
  encryption?: boolean; // Encriptar datos sensibles
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  entries: number;
  hitRate: number;
}

// Hook principal para caché inteligente
export function useSmartCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutos por defecto
    maxSize = 5 * 1024 * 1024, // 5MB por defecto
    maxEntries = 100,
    strategy = 'lru',
    persistence = 'memory',
    compress = false,
    encryption = false
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);
  
  const memoryCache = useRef<Map<string, CacheEntry<any>>>(new Map());
  const stats = useRef<CacheStats>({
    hits: 0,
    misses: 0,
    size: 0,
    entries: 0,
    hitRate: 0
  });

  // Obtener caché según el tipo de persistencia
  const getCacheStorage = useCallback(() => {
    switch (persistence) {
      case 'localStorage':
        return {
          get: (key: string) => {
            const item = localStorage.getItem(`cache_${key}`);
            return item ? JSON.parse(item) : null;
          },
          set: (key: string, value: CacheEntry<T>) => {
            localStorage.setItem(`cache_${key}`, JSON.stringify(value));
          },
          delete: (key: string) => {
            localStorage.removeItem(`cache_${key}`);
          },
          clear: () => {
            Object.keys(localStorage)
              .filter(k => k.startsWith('cache_'))
              .forEach(k => localStorage.removeItem(k));
          },
          size: () => {
            let size = 0;
            Object.keys(localStorage)
              .filter(k => k.startsWith('cache_'))
              .forEach(k => {
                size += localStorage.getItem(k)?.length || 0;
              });
            return size;
          }
        };
        
      case 'indexedDB':
        // Implementación simplificada de IndexedDB
        return {
          get: async (key: string) => {
            // TODO: Implementar IndexedDB
            return memoryCache.current.get(key);
          },
          set: async (key: string, value: CacheEntry<T>) => {
            memoryCache.current.set(key, value);
          },
          delete: async (key: string) => {
            memoryCache.current.delete(key);
          },
          clear: async () => {
            memoryCache.current.clear();
          },
          size: () => {
            return Array.from(memoryCache.current.values())
              .reduce((acc, entry) => acc + (entry.size || 0), 0);
          }
        };
        
      default: // memory
        return {
          get: (key: string) => memoryCache.current.get(key),
          set: (key: string, value: CacheEntry<T>) => {
            memoryCache.current.set(key, value);
          },
          delete: (key: string) => {
            memoryCache.current.delete(key);
          },
          clear: () => {
            memoryCache.current.clear();
          },
          size: () => {
            return Array.from(memoryCache.current.values())
              .reduce((acc, entry) => acc + (entry.size || 0), 0);
          }
        };
    }
  }, [persistence]);

  // Calcular el tamaño aproximado de los datos
  const calculateSize = useCallback((data: any): number => {
    try {
      return JSON.stringify(data).length * 2; // Aproximación en bytes
    } catch {
      return 0;
    }
  }, []);

  // Comprimir datos si es necesario
  const compressData = useCallback(async (data: T): Promise<string> => {
    if (!compress || typeof data !== 'object') {
      return JSON.stringify(data);
    }

    // Usar CompressionStream API si está disponible
    if ('CompressionStream' in window) {
      const json = JSON.stringify(data);
      const stream = new Blob([json]).stream();
      const compressedStream = stream.pipeThrough(
        new (window as any).CompressionStream('gzip')
      );
      const blob = await new Response(compressedStream).blob();
      return await blob.text();
    }

    return JSON.stringify(data);
  }, [compress]);

  // Descomprimir datos
  const decompressData = useCallback(async (data: string): Promise<T> => {
    if (!compress) {
      return JSON.parse(data);
    }

    // Usar DecompressionStream API si está disponible
    if ('DecompressionStream' in window) {
      try {
        const stream = new Blob([data]).stream();
        const decompressedStream = stream.pipeThrough(
          new (window as any).DecompressionStream('gzip')
        );
        const text = await new Response(decompressedStream).text();
        return JSON.parse(text);
      } catch {
        // Si falla la descompresión, intentar como JSON normal
        return JSON.parse(data);
      }
    }

    return JSON.parse(data);
  }, [compress]);

  // Aplicar estrategia de evicción
  const evictEntries = useCallback((storage: any) => {
    const entries = Array.from(memoryCache.current.entries());
    
    if (entries.length >= maxEntries) {
      let toEvict: string[] = [];
      
      switch (strategy) {
        case 'lru': // Least Recently Used
          entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
          toEvict = entries.slice(0, Math.floor(maxEntries * 0.2)).map(e => e[0]);
          break;
          
        case 'lfu': // Least Frequently Used
          entries.sort((a, b) => a[1].accessCount - b[1].accessCount);
          toEvict = entries.slice(0, Math.floor(maxEntries * 0.2)).map(e => e[0]);
          break;
          
        case 'fifo': // First In First Out
          entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
          toEvict = entries.slice(0, Math.floor(maxEntries * 0.2)).map(e => e[0]);
          break;
          
        case 'ttl': // Time To Live
          const now = Date.now();
          toEvict = entries
            .filter(([_, entry]) => now - entry.timestamp > ttl)
            .map(e => e[0]);
          break;
      }
      
      toEvict.forEach(key => {
        storage.delete(key);
        memoryCache.current.delete(key);
      });
    }
  }, [maxEntries, strategy, ttl]);

  // Obtener datos del caché
  const getCachedData = useCallback(async () => {
    const storage = getCacheStorage();
    const cached = await storage.get(key);
    
    if (cached) {
      const now = Date.now();
      const age = now - cached.timestamp;
      
      // Verificar si ha expirado
      if (age > ttl) {
        setIsStale(true);
        stats.current.misses++;
        return null;
      }
      
      // Actualizar estadísticas
      cached.accessCount++;
      cached.lastAccessed = now;
      await storage.set(key, cached);
      
      stats.current.hits++;
      stats.current.hitRate = stats.current.hits / (stats.current.hits + stats.current.misses);
      
      // Descomprimir si es necesario
      const data = typeof cached.data === 'string' && compress
        ? await decompressData(cached.data)
        : cached.data;
      
      return data;
    }
    
    stats.current.misses++;
    return null;
  }, [key, ttl, compress, getCacheStorage, decompressData]);

  // Guardar datos en caché
  const setCachedData = useCallback(async (data: T) => {
    const storage = getCacheStorage();
    
    // Comprimir si es necesario
    const processedData = compress ? await compressData(data) : data;
    const size = calculateSize(processedData);
    
    // Verificar tamaño máximo
    if (size > maxSize) {
      console.warn(`Datos demasiado grandes para cachear: ${size} bytes`);
      return;
    }
    
    const entry: CacheEntry<any> = {
      data: processedData,
      timestamp: Date.now(),
      size,
      accessCount: 1,
      lastAccessed: Date.now()
    };
    
    // Aplicar evicción si es necesario
    evictEntries(storage);
    
    await storage.set(key, entry);
    stats.current.entries = memoryCache.current.size;
    stats.current.size = await storage.size();
  }, [key, compress, maxSize, getCacheStorage, compressData, calculateSize, evictEntries]);

  // Función principal de fetch con caché
  const fetchWithCache = useCallback(async (force: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Intentar obtener del caché primero
      if (!force) {
        const cached = await getCachedData();
        if (cached !== null) {
          setData(cached);
          setLoading(false);
          setIsStale(false);
          return cached;
        }
      }
      
      // Fetch nuevo si no hay caché o está forzado
      const freshData = await fetcher();
      
      // Guardar en caché
      await setCachedData(freshData);
      
      setData(freshData);
      setIsStale(false);
      return freshData;
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      
      // Si hay error, intentar devolver datos stale del caché
      const cached = await getCachedData();
      if (cached !== null) {
        setData(cached);
        setIsStale(true);
        return cached;
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetcher, getCachedData, setCachedData]);

  // Invalidar caché
  const invalidate = useCallback(async () => {
    const storage = getCacheStorage();
    await storage.delete(key);
    setData(null);
    setIsStale(false);
  }, [key, getCacheStorage]);

  // Prefetch en segundo plano
  const prefetch = useCallback(async () => {
    try {
      const freshData = await fetcher();
      await setCachedData(freshData);
    } catch (error) {
      console.error('Error en prefetch:', error);
    }
  }, [fetcher, setCachedData]);

  // Revalidar mientras se usa caché stale
  const revalidate = useCallback(async () => {
    // Devolver datos stale inmediatamente si existen
    const cached = await getCachedData();
    if (cached !== null) {
      setData(cached);
      setIsStale(true);
    }
    
    // Fetch en segundo plano
    prefetch();
  }, [getCachedData, prefetch]);

  // Obtener estadísticas
  const getStats = useCallback((): CacheStats => {
    return { ...stats.current };
  }, []);

  // Limpiar todo el caché
  const clearCache = useCallback(async () => {
    const storage = getCacheStorage();
    await storage.clear();
    memoryCache.current.clear();
    stats.current = {
      hits: 0,
      misses: 0,
      size: 0,
      entries: 0,
      hitRate: 0
    };
  }, [getCacheStorage]);

  // Auto-fetch inicial
  useEffect(() => {
    fetchWithCache();
  }, [key]);

  return {
    data,
    loading,
    error,
    isStale,
    refetch: fetchWithCache,
    invalidate,
    prefetch,
    revalidate,
    getStats,
    clearCache
  };
}

// Hook para caché de imágenes
export function useImageCache() {
  const [cachedImages, setCachedImages] = useState<Map<string, string>>(new Map());
  const cacheSize = useRef(0);
  const maxCacheSize = 50 * 1024 * 1024; // 50MB

  const preloadImage = useCallback(async (url: string): Promise<string> => {
    // Si ya está en caché, devolverlo
    if (cachedImages.has(url)) {
      return cachedImages.get(url)!;
    }

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Verificar tamaño
      if (cacheSize.current + blob.size > maxCacheSize) {
        // Limpiar caché más antiguo
        const entries = Array.from(cachedImages.entries());
        const toRemove = Math.floor(entries.length * 0.2);
        
        for (let i = 0; i < toRemove; i++) {
          const [key] = entries[i];
          URL.revokeObjectURL(cachedImages.get(key)!);
          cachedImages.delete(key);
        }
      }
      
      const objectUrl = URL.createObjectURL(blob);
      setCachedImages(prev => new Map(prev).set(url, objectUrl));
      cacheSize.current += blob.size;
      
      return objectUrl;
    } catch (error) {
      console.error('Error cacheando imagen:', error);
      return url;
    }
  }, [cachedImages, maxCacheSize]);

  const clearImageCache = useCallback(() => {
    cachedImages.forEach(objectUrl => URL.revokeObjectURL(objectUrl));
    setCachedImages(new Map());
    cacheSize.current = 0;
  }, [cachedImages]);

  useEffect(() => {
    return () => {
      // Limpiar URLs al desmontar
      cachedImages.forEach(objectUrl => URL.revokeObjectURL(objectUrl));
    };
  }, []);

  return {
    preloadImage,
    clearImageCache,
    getCachedUrl: (url: string) => cachedImages.get(url) || url,
    cacheSize: cacheSize.current
  };
}