'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../src/contextos/AuthContext';
import { useTraduccion } from '../../../src/i18n/useTraduccion';

// Tema para páginas de auth
const tema = {
  primario: '#059669',
  secundario: '#0ea5e9',
  acento: '#8b5cf6',
  texto: '#1f2937',
  textoSecundario: '#6b7280'
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { t } = useTraduccion();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Usuarios de demo para facilitar testing
  const demoUsers = [
    { email: 'admin@lapublica.es', role: 'Admin', nick: '@admin_publico', password: 'admin123' },
    { email: 'empresa@ejemplo.es', role: 'Empresa', nick: '@techsoft_oficial', password: 'empresa123' },
    { email: 'empleado@generalitat.cat', role: 'Empleado Público', nick: '@joan_cat', password: 'empleado123' },
    { email: 'gestor@lapublica.es', role: 'Gestor', nick: '@carlos_gestor', password: 'gestor123' },
    { email: 'madrid@madrid.es', role: 'Ayuntamiento', nick: '@madrid_oficial', password: 'madrid123' },
    { email: 'ugt@ugt.es', role: 'Sindicato', nick: '@ugt_madrid', password: 'ugt123' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError(t.validacion.completaCampos);
      return;
    }

    try {
      await login(formData.email, formData.password);
      
      // El contexto maneja el estado del usuario automáticamente
      // Redirigir al dashboard principal después del login exitoso
      router.push('/xarxa-social');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  const getDashboardUrl = (role: string): string => {
    switch (role) {
      case 'ADMIN': return '/admin-completo';
      case 'EMPRESA': return '/empresa-completa';
      case 'GESTOR_EMPRESAS': return '/gestor-completo';
      case 'ADMINISTRACION_PUBLICA': return '/administracion-completa';
      case 'SINDICATO': return '/sindicato-completo';
      case 'EMPLEADO_PUBLICO': return '/empleado-completo';
      default: return '/xarxa-social';
    }
  };

  const handleDemoLogin = (demoUser: any) => {
    setFormData({
      email: demoUser.email,
      password: demoUser.password
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br" style={{
      background: `linear-gradient(135deg, ${tema.primario}10, ${tema.secundario}05)`
    }}>
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
              backgroundColor: tema.primario
            }}>
              <span className="text-2xl text-white">🏢</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: tema.texto }}>{t.lapublica}</h1>
          </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold" style={{ color: tema.texto }}>{t.iniciarSesion}</h2>
                <p className="text-sm mt-2" style={{ color: tema.textoSecundario }}>{t.login.accedeAlDashboard}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: tema.texto }}>{t.login.email}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{
                      borderColor: error ? '#ef4444' : `${tema.primario}20`
                    }}
                    placeholder="tu@email.com"
                    disabled={isLoading}
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: tema.texto }}>{t.login.contraseña}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                      style={{
                        borderColor: error ? '#ef4444' : `${tema.primario}20`
                      }}
                      placeholder={t.login.contraseña}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Botón Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                  style={{ backgroundColor: tema.primario }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Iniciando...</span>
                    </span>
                  ) : (
                    t.iniciarSesion
                  )}
                </button>
              </form>

              {/* Links */}
              <div className="mt-6 text-center space-y-3">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm hover:underline"
                  style={{ color: tema.primario }}
                >
                  {t.login.olvidasteContraseña}
                </Link>
                
                <div className="text-sm" style={{ color: tema.textoSecundario }}>
                  {t.login.noTienesCuenta}{' '}
                  <Link 
                    href="/auth/register" 
                    className="font-medium hover:underline"
                    style={{ color: tema.primario }}
                  >
                    {t.crearCuenta}
                  </Link>
                </div>
              </div>
            </div>

          {/* Usuarios Demo */}
          <div className="mt-8 bg-white rounded-xl p-6 border" style={{ borderColor: `${tema.primario}20` }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: tema.texto }}>{t.login.usuariosPrueba}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoUsers.map((user, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(user)}
                  className="text-left p-2 rounded hover:shadow-sm transition-all duration-200"
                  style={{ backgroundColor: `${tema.primario}05` }}
                >
                  <div className="text-xs font-medium" style={{ color: tema.texto }}>{user.role} {user.nick}</div>
                  <div className="text-xs" style={{ color: tema.textoSecundario }}>{user.email}</div>
                </button>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: tema.textoSecundario }}>{t.login.hazClicAutocompletar}</p>
          </div>
        </div>
      </div>
    </div>
  );
}