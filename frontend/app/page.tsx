'use client';

import { useTema } from '../hooks/useComunidad';
import { useComunidad } from './ComunidadContext';
import Link from 'next/link';
import { ArrowRight, Users, Calendar, MessageCircle, Building } from 'lucide-react';

export default function HomePage() {
  const tema = useTema();
  const { configuracion } = useComunidad();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: tema.primario || '#059669' }}
              >
                LP
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  La Pública {configuracion.nombre}
                </h1>
                <p className="text-sm text-gray-500">Red social del sector público</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/auth/login" 
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/auth/register" 
                className="px-4 py-2 text-white rounded-lg transition-colors"
                style={{ backgroundColor: tema.primario || '#059669' }}
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido a La Pública {configuracion.nombre}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            La red social profesional diseñada específicamente para empleados del sector público, 
            empresas colaboradoras y organizaciones de {configuracion.nombre}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              style={{ backgroundColor: tema.primario || '#059669' }}
            >
              Únete Ahora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/demo-groups"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
            >
              Ver Demo
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: tema.primario + '20' || '#05966920' }}
            >
              <Users 
                className="w-8 h-8" 
                style={{ color: tema.primario || '#059669' }} 
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">Networking Profesional</h3>
            <p className="text-gray-600 text-sm">
              Conecta con profesionales del sector público y empresas colaboradoras.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: tema.primario + '20' || '#05966920' }}
            >
              <Calendar 
                className="w-8 h-8" 
                style={{ color: tema.primario || '#059669' }} 
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">Eventos y Formación</h3>
            <p className="text-gray-600 text-sm">
              Participa en eventos, cursos y actividades de desarrollo profesional.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: tema.primario + '20' || '#05966920' }}
            >
              <MessageCircle 
                className="w-8 h-8" 
                style={{ color: tema.primario || '#059669' }} 
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">Comunicación Directa</h3>
            <p className="text-gray-600 text-sm">
              Sistema de mensajería y foros especializados en el sector público.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: tema.primario + '20' || '#05966920' }}
            >
              <Building 
                className="w-8 h-8" 
                style={{ color: tema.primario || '#059669' }} 
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">Colaboración Institucional</h3>
            <p className="text-gray-600 text-sm">
              Facilita la colaboración entre administraciones y empresas del sector.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Listo para formar parte de La Pública?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Únete a miles de profesionales del sector público que ya están construyendo 
            el futuro de la administración pública en {configuracion.nombre}.
          </p>
          <Link 
            href="/auth/register"
            className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            style={{ backgroundColor: tema.primario || '#059669' }}
          >
            Crear Cuenta Gratis
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2024 La Pública {configuracion.nombre}. Plataforma especializada para el sector público.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}