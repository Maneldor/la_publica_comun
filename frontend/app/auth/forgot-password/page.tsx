'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../src/servicios/auth';

// Tema para páginas de auth
const tema = {
  primario: '#059669',
  secundario: '#0ea5e9',
  acento: '#8b5cf6',
  texto: '#1f2937',
  textoSecundario: '#6b7280'
};

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Por favor, introduce tu email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, introduce un email válido');
      return;
    }

    try {
      const response = await forgotPassword(email);
      
      if (response.success) {
        setMessage(response.message);
        setEmailSent(true);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-8" style={{
        background: `linear-gradient(135deg, ${tema.primario}10, ${tema.secundario}05)`
      }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
              backgroundColor: tema.primario
            }}>
              <span className="text-2xl text-white">📧</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: tema.texto }}>Email Enviado</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: tema.texto }}>¡Revisa tu Email!</h2>
              <p className="text-sm" style={{ color: tema.textoSecundario }}>
                Hemos enviado las instrucciones de recuperación a:
              </p>
              <p className="font-medium mt-2" style={{ color: tema.primario }}>{email}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>¿No ves el email?</strong><br/>
                • Revisa la carpeta de spam<br/>
                • Puede tardar unos minutos en llegar<br/>
                • Verifica que el email sea correcto
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setEmailSent(false)}
                className="w-full py-3 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: tema.primario }}
              >
                Enviar a otro email
              </button>
              
              <Link 
                href="/auth/login"
                className="block w-full py-3 rounded-lg font-medium border transition-all duration-200 text-center hover:shadow-sm"
                style={{ 
                  borderColor: tema.primario,
                  color: tema.primario 
                }}
              >
                Volver al Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-8" style={{
      background: `linear-gradient(135deg, ${tema.primario}10, ${tema.secundario}05)`
    }}>      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
            backgroundColor: tema.primario
          }}>
            <span className="text-2xl text-white">🔐</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: tema.texto }}>La Pública</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold" style={{ color: tema.texto }}>Recuperar Contraseña</h2>
            <p className="text-sm mt-2" style={{ color: tema.textoSecundario }}>
              Introduce tu email y te enviaremos las instrucciones para restablecer tu contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: tema.texto }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                style={{
                  borderColor: error ? '#ef4444' : `${tema.primario}20`
                }}
                placeholder="tu@email.com"
                disabled={isLoading}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success */}
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-600">{message}</p>
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
                  <span>Enviando...</span>
                </span>
              ) : (
                'Enviar Instrucciones'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <div className="text-sm" style={{ color: tema.textoSecundario }}>
              ¿Recordaste tu contraseña?{' '}
              <Link 
                href="/auth/login" 
                className="font-medium hover:underline"
                style={{ color: tema.primario }}
              >
                Volver al Login
              </Link>
            </div>
            
            <div className="text-sm" style={{ color: tema.textoSecundario }}>
              ¿No tienes cuenta?{' '}
              <Link 
                href="/auth/register" 
                className="font-medium hover:underline"
                style={{ color: tema.primario }}
              >
                Regístrate aquí
              </Link>
            </div>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 bg-white rounded-xl p-4 border" style={{ borderColor: `${tema.primario}20` }}>
          <div className="flex items-start space-x-3">
            <span className="text-lg">💡</span>
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: tema.texto }}>¿Problemas para acceder?</h3>
              <p className="text-xs" style={{ color: tema.textoSecundario }}>
                Si no recibes el email en 5 minutos, verifica que el email sea correcto y revisa tu carpeta de spam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}