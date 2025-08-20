// Servicio de Autenticación para La Pública

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellidos?: string;
  nick: string; // Nickname visible para otros usuarios
  role: 'ADMIN' | 'GESTOR_EMPRESAS' | 'EMPRESA' | 'ADMINISTRACION_PUBLICA' | 'SINDICATO' | 'EMPLEADO_PUBLICO' | 'AGENTE_IA';
  isEmailVerified: boolean;
  avatar?: string;
  company?: {
    id: string;
    name: string;
    plan: 'BASICO' | 'AVANZADO' | 'EXPERTO';
  };
  employee?: {
    community: string;
    organization: string;
    jobTitle: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellidos?: string;
  nick: string; // Nickname visible para otros usuarios
  role: Usuario['role'];
  // Datos adicionales según el rol
  companyData?: {
    name: string;
    cif: string;
    sector: string;
    description: string;
  };
  employeeData?: {
    community: string;
    organization: string;
    jobTitle: string;
    department: string;
  };
}

export interface AuthResponse {
  success: boolean;
  user?: Usuario;
  token?: string;
  refreshToken?: string;
  message?: string;
}

// Simulación de base de datos local
const MOCK_USERS: Usuario[] = [
  {
    id: '1',
    email: 'admin@lapublica.es',
    nombre: 'Super',
    apellidos: 'Admin',
    nick: '@admin_publico',
    role: 'ADMIN',
    isEmailVerified: true
  },
  {
    id: '2',
    email: 'empresa@ejemplo.es',
    nombre: 'TechSoft',
    apellidos: 'SL',
    nick: '@techsoft_oficial',
    role: 'EMPRESA',
    isEmailVerified: true,
    company: {
      id: 'comp1',
      name: 'TechSoft SL',
      plan: 'AVANZADO'
    }
  },
  {
    id: '3',
    email: 'empleado@generalitat.cat',
    nombre: 'Joan',
    apellidos: 'Martí',
    nick: '@joan_cat',
    role: 'EMPLEADO_PUBLICO',
    isEmailVerified: true,
    employee: {
      community: 'Catalunya',
      organization: 'Generalitat de Catalunya',
      jobTitle: 'Técnico Superior'
    }
  },
  {
    id: '4',
    email: 'gestor@lapublica.es',
    nombre: 'Carlos',
    apellidos: 'Gestor',
    nick: '@carlos_gestor',
    role: 'GESTOR_EMPRESAS',
    isEmailVerified: true
  },
  {
    id: '5',
    email: 'madrid@madrid.es',
    nombre: 'Ayuntamiento',
    apellidos: 'Madrid',
    nick: '@madrid_oficial',
    role: 'ADMINISTRACION_PUBLICA',
    isEmailVerified: true
  },
  {
    id: '6',
    email: 'ugt@ugt.es',
    nombre: 'UGT',
    apellidos: 'Madrid',
    nick: '@ugt_madrid',
    role: 'SINDICATO',
    isEmailVerified: true
  }
];

// Simulación de tokens almacenados
const TOKEN_KEY = 'lapublica_auth_token';
const REFRESH_TOKEN_KEY = 'lapublica_refresh_token';
const USER_KEY = 'lapublica_user';

class AuthService {
  private currentUser: Usuario | null = null;

  constructor() {
    // Cargar usuario desde localStorage al inicializar
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    try {
      const userData = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (userData && token) {
        this.currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.clearStorage();
    }
  }

  private saveUserToStorage(user: Usuario, token: string, refreshToken: string) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    this.currentUser = user;
  }

  private clearStorage() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.currentUser = null;
  }

  // Generar token simulado
  private generateToken(): string {
    return 'jwt_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  // Simular delay de red
  private async simulateNetworkDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  }

  // LOGIN
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.simulateNetworkDelay();

    const user = MOCK_USERS.find(u => u.email === credentials.email);
    
    if (!user) {
      return {
        success: false,
        message: 'Usuario no encontrado'
      };
    }

    // Simulación simple de verificación de contraseña
    // En producción, esto se haría en el backend
    const passwordCorrect = credentials.password.length >= 6;
    
    if (!passwordCorrect) {
      return {
        success: false,
        message: 'Contraseña incorrecta'
      };
    }

    const token = this.generateToken();
    const refreshToken = this.generateToken();
    
    this.saveUserToStorage(user, token, refreshToken);

    return {
      success: true,
      user,
      token,
      refreshToken,
      message: 'Login exitoso'
    };
  }

  // REGISTRO
  async register(data: RegisterData): Promise<AuthResponse> {
    await this.simulateNetworkDelay();

    // Verificar si el email ya existe
    const existingUser = MOCK_USERS.find(u => u.email === data.email);
    if (existingUser) {
      return {
        success: false,
        message: 'El email ya está registrado'
      };
    }

    // Crear nuevo usuario
    const newUser: Usuario = {
      id: 'user_' + Date.now(),
      email: data.email,
      nombre: data.nombre,
      apellidos: data.apellidos,
      nick: data.nick,
      role: data.role,
      isEmailVerified: false
    };

    // Añadir datos específicos según el rol
    if (data.role === 'EMPRESA' && data.companyData) {
      newUser.company = {
        id: 'comp_' + Date.now(),
        name: data.companyData.name,
        plan: 'BASICO' // Plan por defecto
      };
    }

    if (data.role === 'EMPLEADO_PUBLICO' && data.employeeData) {
      newUser.employee = {
        community: data.employeeData.community,
        organization: data.employeeData.organization,
        jobTitle: data.employeeData.jobTitle
      };
    }

    // Añadir a la "base de datos" simulada
    MOCK_USERS.push(newUser);

    const token = this.generateToken();
    const refreshToken = this.generateToken();
    
    this.saveUserToStorage(newUser, token, refreshToken);

    return {
      success: true,
      user: newUser,
      token,
      refreshToken,
      message: 'Registro exitoso'
    };
  }

  // LOGOUT
  async logout(): Promise<void> {
    await this.simulateNetworkDelay();
    this.clearStorage();
  }

  // OBTENER USUARIO ACTUAL
  getCurrentUser(): Usuario | null {
    return this.currentUser;
  }

  // VERIFICAR SI ESTÁ AUTENTICADO
  isAuthenticated(): boolean {
    return this.currentUser !== null && localStorage.getItem(TOKEN_KEY) !== null;
  }

  // OBTENER TOKEN
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // VERIFICAR EMAIL
  async verifyEmail(token: string): Promise<AuthResponse> {
    await this.simulateNetworkDelay();

    if (this.currentUser) {
      this.currentUser.isEmailVerified = true;
      this.saveUserToStorage(
        this.currentUser, 
        this.getToken() || '', 
        localStorage.getItem(REFRESH_TOKEN_KEY) || ''
      );

      return {
        success: true,
        user: this.currentUser,
        message: 'Email verificado correctamente'
      };
    }

    return {
      success: false,
      message: 'Error al verificar email'
    };
  }

  // RECUPERAR CONTRASEÑA
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await this.simulateNetworkDelay();

    const user = MOCK_USERS.find(u => u.email === email);
    
    if (user) {
      return {
        success: true,
        message: 'Se ha enviado un email de recuperación'
      };
    }

    return {
      success: false,
      message: 'Email no encontrado'
    };
  }

  // OBTENER DASHBOARD URL SEGÚN ROL
  getDashboardUrl(role: Usuario['role']): string {
    switch (role) {
      case 'ADMIN':
        return '/admin-completo';
      case 'EMPRESA':
        return '/empresa-completa';
      case 'GESTOR_EMPRESAS':
        return '/gestor-completo';
      case 'ADMINISTRACION_PUBLICA':
        return '/administracion-completa';
      case 'SINDICATO':
        return '/sindicato-completo';
      case 'EMPLEADO_PUBLICO':
        return '/empleado-completo';
      default:
        return '/xarxa-social';
    }
  }

  // REFRESCAR TOKEN
  async refreshToken(): Promise<AuthResponse> {
    await this.simulateNetworkDelay();

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (!refreshToken || !this.currentUser) {
      return {
        success: false,
        message: 'No hay token de actualización válido'
      };
    }

    const newToken = this.generateToken();
    const newRefreshToken = this.generateToken();
    
    this.saveUserToStorage(this.currentUser, newToken, newRefreshToken);

    return {
      success: true,
      user: this.currentUser,
      token: newToken,
      refreshToken: newRefreshToken,
      message: 'Token actualizado'
    };
  }
}

// Instancia singleton del servicio
const authService = new AuthService();
export default authService;

// Hooks y utilidades
export const useAuth = () => {
  const [user, setUser] = React.useState<Usuario | null>(authService.getCurrentUser());
  const [isLoading, setIsLoading] = React.useState(false);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.success && response.user) {
        setUser(response.user);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      if (response.success && response.user) {
        setUser(response.user);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      return await authService.forgotPassword(email);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: authService.isAuthenticated(),
    login,
    register,
    logout,
    forgotPassword,
    getDashboardUrl: authService.getDashboardUrl
  };
};

// Importar React para el hook
import React from 'react';