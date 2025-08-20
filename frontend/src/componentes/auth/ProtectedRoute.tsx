'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contextos/AuthContext';

type UserRole = 'ADMIN' | 'EMPRESA' | 'GESTOR_EMPRESAS' | 'ADMINISTRACION_PUBLICA' | 'SINDICATO' | 'EMPLEADO_PUBLICO' | 'AGENTE_IA';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
  fallback?: React.ReactNode;
}

const tema = {
  primario: '#059669',
  secundario: '#0ea5e9',
  texto: '#1f2937',
  textoSecundario: '#6b7280'
};

// Componente de loading
const AuthLoading = () => (
  <div className="min-h-screen bg-gradient-to-br flex items-center justify-center" style={{
    background: `linear-gradient(135deg, ${tema.primario}08, ${tema.secundario}05)`
  }}>
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
        backgroundColor: tema.primario
      }}>
        <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h2 className="text-xl font-semibold mb-2" style={{ color: tema.texto }}>Verificando acceso...</h2>
      <p className="text-sm" style={{ color: tema.textoSecundario }}>Un momento por favor</p>
    </div>
  </div>
);

// Componente de acceso denegado
const AccessDenied = ({ userRole, requiredRoles }: { userRole: UserRole; requiredRoles: UserRole[] }) => {
  const router = useRouter();
  
  const getRoleName = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'EMPRESA': return 'Empresa';
      case 'GESTOR_EMPRESAS': return 'Gestor de Empresas';
      case 'ADMINISTRACION_PUBLICA': return 'Administración Pública';
      case 'SINDICATO': return 'Sindicato';
      case 'EMPLEADO_PUBLICO': return 'Empleado Público';
      case 'AGENTE_IA': return 'Agente IA';
      default: return role;
    }
  };

  const goToDashboard = () => {
    switch (userRole) {
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
      default:
        router.push('/xarxa-social');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-8" style={{
      background: `linear-gradient(135deg, ${tema.primario}08, ${tema.secundario}05)`
    }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-3xl">🚫</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-4" style={{ color: tema.texto }}>Acceso Restringido</h2>
          
          <div className="mb-6">
            <p className="text-sm mb-3" style={{ color: tema.textoSecundario }}>
              Tu rol actual es: <strong>{getRoleName(userRole)}</strong>
            </p>
            <p className="text-sm mb-3" style={{ color: tema.textoSecundario }}>
              Esta sección requiere uno de estos roles:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {requiredRoles.map((role) => (
                <span 
                  key={role} 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${tema.primario}15`,
                    color: tema.primario
                  }}
                >
                  {getRoleName(role)}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={goToDashboard}
              className="w-full py-3 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: tema.primario }}
            >
              Ir a Mi Dashboard
            </button>
            
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full py-3 rounded-lg font-medium border transition-all duration-200 hover:shadow-sm"
              style={{ 
                borderColor: tema.primario,
                color: tema.primario 
              }}
            >
              Cambiar de Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredRoles, 
  fallback 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  // Determinar roles requeridos
  const rolesRequired = requiredRoles || (requiredRole ? [requiredRole] : []);
  
  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir al login
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);
  
  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return fallback || <AuthLoading />;
  }
  
  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (!isAuthenticated || !user) {
    return null;
  }
  
  // Si hay roles requeridos, verificar que el usuario tenga uno de ellos
  if (rolesRequired.length > 0 && !rolesRequired.includes(user.role as UserRole)) {
    return <AccessDenied userRole={user.role as UserRole} requiredRoles={rolesRequired} />;
  }
  
  // Usuario autenticado y autorizado
  return <>{children}</>;
}

// Hook para verificar permisos
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();
  
  const hasRole = (role: UserRole): boolean => {
    return isAuthenticated && user?.role === role;
  };
  
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return isAuthenticated && user ? roles.includes(user.role as UserRole) : false;
  };
  
  const isAdmin = (): boolean => {
    return hasRole('ADMIN');
  };
  
  const isEmpresa = (): boolean => {
    return hasRole('EMPRESA');
  };
  
  const isGestor = (): boolean => {
    return hasRole('GESTOR_EMPRESAS');
  };
  
  const canManageUsers = (): boolean => {
    return hasAnyRole(['ADMIN', 'GESTOR_EMPRESAS']);
  };
  
  const canConfigureAI = (): boolean => {
    return hasAnyRole(['ADMIN']);
  };
  
  const canViewBilling = (): boolean => {
    return hasAnyRole(['ADMIN', 'EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']);
  };
  
  return {
    user,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isAdmin,
    isEmpresa,
    isGestor,
    canManageUsers,
    canConfigureAI,
    canViewBilling
  };
}

// Componente para mostrar contenido condicional según rol
interface RoleBasedContentProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleBasedContent({ children, allowedRoles, fallback }: RoleBasedContentProps) {
  const { hasAnyRole } = usePermissions();
  
  if (hasAnyRole(allowedRoles)) {
    return <>{children}</>;
  }
  
  return fallback ? <>{fallback}</> : null;
}

// HOC para componentes que requieren autenticación
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: UserRole[]
) {
  const AuthenticatedComponent = (props: P) => {
    return (
      <ProtectedRoute requiredRoles={requiredRoles}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
  
  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return AuthenticatedComponent;
}