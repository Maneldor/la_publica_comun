'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../src/servicios/auth';

const tema = {
  primario: '#059669',
  secundario: '#0ea5e9',
  acento: '#8b5cf6',
  texto: '#1f2937',
  textoSecundario: '#6b7280'
};

export default function AuthPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirigir al dashboard correspondiente
      switch (user.role) {
        case 'ADMIN':
          router.push('/admin-completo');
          break;
        case 'EMPRESA':
          router.push('/empresa-completa');
          break;
        case 'GESTOR_EMPRESAS':
          router.push('/gestor-completo');
          break;
        case 'ADMINISTRACION_PUBLICA':
          router.push('/administracion-completa');
          break;
        case 'SINDICATO':
          router.push('/sindicato-completo');
          break;
        case 'EMPLEADO_PUBLICO':
          router.push('/empleado-completo');
          break;
        default:
          router.push('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center" style={{
        background: `linear-gradient(135deg, ${tema.primario}08, ${tema.secundario}05)`
      }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
            backgroundColor: tema.primario
          }}>
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: tema.texto }}>Cargando...</h2>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Mostrar mensaje de redirección mientras se redirige
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center" style={{
        background: `linear-gradient(135deg, ${tema.primario}08, ${tema.secundario}05)`
      }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
            backgroundColor: tema.primario
          }}>
            <span className="text-2xl text-white">🚀</span>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: tema.texto }}>Redirigiendo a tu dashboard...</h2>
          <p className="text-sm" style={{ color: tema.textoSecundario }}>Bienvenido, {user.nombre}</p>
        </div>
      </div>
    );
  }

  // Página principal de autenticación para usuarios no autenticados
  return (
    <div className="min-h-screen bg-gradient-to-br" style={{
      background: `linear-gradient(135deg, ${tema.primario}, ${tema.secundario})`
    }}>
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center text-white mb-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <span className="text-4xl">🏢</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">La Pública</h1>
            <p className="text-xl opacity-90 mb-8">La red social del sector público español</p>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Conecta empresas, administraciones públicas y empleados del sector público con el poder de la Inteligencia Artificial
            </p>
          </div>

          {/* Características principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: '🤖',
                title: 'Asistentes IA',
                desc: 'Agentes inteligentes especializados en RRHH público'
              },
              {
                icon: '👥',
                title: 'Red Profesional',
                desc: 'Conecta con empleados públicos de toda España'
              },
              {
                icon: '📊',
                title: 'Análisis Avanzado',
                desc: 'Métricas y reportes de rendimiento'
              },
              {
                icon: '🏢',
                title: 'Multi-organización',
                desc: 'Empresas, administraciones y sindicatos'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 text-white text-center">
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-90">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Link
              href="/auth/login"
              className="w-full sm:w-auto px-8 py-4 bg-white rounded-2xl font-semibold transition-all duration-200 hover:shadow-2xl hover:scale-105 text-center"
              style={{ color: tema.primario }}
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/register"
              className="w-full sm:w-auto px-8 py-4 bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white rounded-2xl font-semibold text-white transition-all duration-200 hover:bg-white hover:text-gray-900 text-center"
            >
              Crear Cuenta Gratis
            </Link>
          </div>

          {/* Tipos de usuario */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white text-center mb-6">¿Quién puede unirse?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: '👥',
                  title: 'Empleados Públicos',
                  desc: 'Funcionarios y trabajadores del sector público'
                },
                {
                  icon: '🏢',
                  title: 'Empresas',
                  desc: 'Empresas que buscan talento del sector público'
                },
                {
                  icon: '🏦',
                  title: 'Administraciones',
                  desc: 'Organismos públicos y entidades oficiales'
                },
                {
                  icon: '✊',
                  title: 'Sindicatos',
                  desc: 'Organizaciones sindicales y representativas'
                },
                {
                  icon: '👤',
                  title: 'Gestores',
                  desc: 'Profesionales de RRHH especializados'
                },
                {
                  icon: '🤖',
                  title: 'Agentes IA',
                  desc: 'Asistentes virtuales inteligentes'
                }
              ].map((userType, index) => (
                <div key={index} className="text-white text-center">
                  <span className="text-3xl mb-3 block">{userType.icon}</span>
                  <h3 className="font-semibold mb-2">{userType.title}</h3>
                  <p className="text-sm opacity-90">{userType.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-white mt-12 opacity-75">
            <p className="text-sm">
              © 2024 La Pública. Transformando el sector público español con IA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}