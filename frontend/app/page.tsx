'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirigir automáticamente a la página de autenticación
    router.push('/auth');
  }, [router]);

  // Mostrar loading mientras se redirige
  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #05966908, #0ea5e905)'
    }}>
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
          backgroundColor: '#059669'
        }}>
          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900">Cargando La Pública...</h2>
        <p className="text-sm text-gray-600">Redirigiendo al sistema de autenticación</p>
      </div>
    </div>
  );
}