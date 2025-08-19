'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../src/contextos/AuthContext';
import { obtenerComunidadActual } from '../../../configuracion/comunidades';

// Tema para páginas de auth
const tema = {
  primario: '#059669',
  secundario: '#0ea5e9',
  acento: '#8b5cf6',
  texto: '#1f2937',
  textoSecundario: '#6b7280'
};

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  nombre: string;
  apellidos: string;
  nick: string;
  comunidad: string;
  acceptTerms: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellidos: '',
    nick: '',
    comunidad: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para detección automática de comunidad
  const [comunidadDetectada, setComunidadDetectada] = useState<string>('');
  const [mostrarConfirmacionComunidad, setMostrarConfirmacionComunidad] = useState(false);
  const [confirmacionComunidad, setConfirmacionComunidad] = useState<boolean | null>(null);

  const comunidades = [
    'Catalunya', 'Madrid', 'Andalucía', 'Valencia', 
    'Galicia', 'Euskadi', 'Castilla y León', 'Castilla-La Mancha',
    'Canarias', 'Aragón', 'Murcia', 'Asturias',
    'Extremadura', 'Baleares', 'Navarra', 'Cantabria', 'La Rioja'
  ];

  // Detectar comunidad automáticamente al cargar
  useEffect(() => {
    const comunidadActual = obtenerComunidadActual();
    setComunidadDetectada(comunidadActual.nombre);
    setMostrarConfirmacionComunidad(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    if (error) setError('');
  };

  const handleConfirmacionComunidad = (respuesta: boolean) => {
    setConfirmacionComunidad(respuesta);
    if (respuesta) {
      // Usuario confirma que es de la comunidad detectada
      setFormData(prev => ({ ...prev, comunidad: comunidadDetectada }));
    }
    setMostrarConfirmacionComunidad(false);
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.nombre || !formData.apellidos || !formData.nick || !formData.comunidad) {
      setError('Por favor, completa todos los campos requeridos');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return false;
    }

    // Validar longitud del nickname (sin contar el @)
    const nickWithoutAt = formData.nick.startsWith('@') ? formData.nick.slice(1) : formData.nick;
    if (nickWithoutAt.length < 3) {
      setError('El nick debe tener al menos 3 caracteres');
      return false;
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    const registerData = {
      email: formData.email,
      password: formData.password,
      nick: formData.nick,
      firstName: formData.nombre,
      lastName: formData.apellidos,
      community: formData.comunidad,
      role: 'MIEMBRO' // Todos los registros son como miembro
    };

    try {
      await register(registerData);
      
      setSuccess('¡Registro exitoso! Redirigiendo a tu perfil...');
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/perfil'); // Redirigir al perfil para completar datos
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error en el registro');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br" style={{
      background: `linear-gradient(135deg, ${tema.primario}10, ${tema.secundario}05)`
    }}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{
              backgroundColor: tema.primario
            }}>
              <span className="text-2xl text-white">LP</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: tema.texto }}>La Pública</h1>
            <p className="text-sm mt-1" style={{ color: tema.textoSecundario }}>Crea tu cuenta de miembro</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nick */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: tema.texto }}>
                  Nick público *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 font-medium" style={{ color: tema.texto }}>@</span>
                  <input
                    type="text"
                    name="nick"
                    value={formData.nick.startsWith('@') ? formData.nick.slice(1) : formData.nick}
                    onChange={(e) => {
                      // Solo permitir letras, números y guiones bajos
                      const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                      setFormData(prev => ({ ...prev, nick: '@' + value }));
                      if (error) setError('');
                    }}
                    className="w-full pl-8 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="tunick"
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: tema.textoSecundario }}>
                  Este será tu identificador público en la plataforma
                </p>
              </div>

              {/* Nombre y Apellidos */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: tema.texto }}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: tema.texto }}>
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Tus apellidos"
                  />
                </div>
              </div>
              <p className="text-xs -mt-2" style={{ color: tema.textoSecundario }}>
                Tu nombre completo es privado por defecto
              </p>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: tema.texto }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Comunidad */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: tema.texto }}>
                  Comunidad Autónoma *
                </label>
                {confirmacionComunidad === true ? (
                  // Si confirmó la comunidad detectada, mostrar como campo fijo
                  <div className="w-full px-3 py-3 border rounded-lg bg-green-50 border-green-300">
                    <div className="flex items-center justify-between">
                      <span style={{ color: tema.texto }}>{formData.comunidad}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmacionComunidad(null);
                          setFormData(prev => ({ ...prev, comunidad: '' }));
                        }}
                        className="text-xs px-2 py-1 text-green-600 hover:text-green-700"
                      >
                        Cambiar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Si no confirmó o rechazó, mostrar dropdown normal
                  <select
                    name="comunidad"
                    value={formData.comunidad}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecciona tu comunidad</option>
                    {comunidades.map(comunidad => (
                      <option key={comunidad} value={comunidad}>{comunidad}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Contraseñas */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: tema.texto }}>
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: tema.texto }}>
                  Confirmar contraseña *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Repite tu contraseña"
                />
              </div>

              {/* Términos y Condiciones */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="mt-1"
                  style={{ accentColor: tema.primario }}
                />
                <label className="text-sm" style={{ color: tema.textoSecundario }}>
                  Acepto los{' '}
                  <Link href="/legal/terms" className="underline" style={{ color: tema.primario }}>
                    términos y condiciones
                  </Link>
                  {' '}y la{' '}
                  <Link href="/legal/privacy" className="underline" style={{ color: tema.primario }}>
                    política de privacidad
                  </Link>
                </label>
              </div>

              {/* Botón de registro */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 hover:shadow-lg"
                style={{ backgroundColor: tema.primario }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registrando...</span>
                  </span>
                ) : (
                  'Crear cuenta'
                )}
              </button>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}
            </form>

            {/* Link de Login */}
            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: tema.textoSecundario }}>
                ¿Ya tienes cuenta?{' '}
                <Link 
                  href="/auth/login" 
                  className="font-medium hover:underline"
                  style={{ color: tema.primario }}
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Comunidad */}
      {mostrarConfirmacionComunidad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-100">
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: tema.texto }}>
                Confirmación de comunidad
              </h3>
              <p className="text-sm" style={{ color: tema.textoSecundario }}>
                Hemos detectado que estás en <strong>{comunidadDetectada}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-center font-medium" style={{ color: tema.texto }}>
                ¿Eres de <strong>{comunidadDetectada}</strong>?
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleConfirmacionComunidad(true)}
                  className="flex-1 py-3 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg"
                  style={{ backgroundColor: tema.primario }}
                >
                  Sí, soy de {comunidadDetectada}
                </button>
                <button
                  onClick={() => handleConfirmacionComunidad(false)}
                  className="flex-1 py-3 rounded-lg font-medium border transition-all duration-200 hover:shadow-sm"
                  style={{ 
                    borderColor: tema.primario,
                    color: tema.primario 
                  }}
                >
                  No, seleccionar otra
                </button>
              </div>

              <p className="text-xs text-center" style={{ color: tema.textoSecundario }}>
                Puedes cambiar tu comunidad más tarde desde tu perfil
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}