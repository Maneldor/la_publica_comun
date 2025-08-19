'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  UserPlus, 
  Building, 
  MessageSquare, 
  Calendar, 
  Briefcase, 
  Eye, 
  Heart, 
  Share, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Globe, 
  MapPin, 
  Clock, 
  Target, 
  Zap, 
  Award, 
  Star, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  PieChart, 
  Activity, 
  Layers, 
  Database, 
  Shield, 
  Settings,
  Bell,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  FileText,
  Archive,
  MoreHorizontal
} from 'lucide-react';
import { useComunidad } from '../../../../hooks/useComunidad';
import { Boton } from './ui/Boton';
import { 
  Usuario, 
  Grupo, 
  Post, 
  EventoPost, 
  OfertaPost, 
  TipoUsuario,
  CategoriaGrupo
} from '../../../../tipos/redSocial';

interface PropiedadesAnalyticsGlobales {
  usuario: Usuario;
  estadisticasGenerales: EstadisticasGenerales;
  estadisticasComunidades: EstadisticasComunidad[];
  tendenciasUsuarios: TendenciasTiempo[];
  rendimientoContenido: RendimientoContenido;
  reporteActividad: ReporteActividad;
  alertasSeguridad: AlertaSeguridad[];
  configuracionAnalytics: ConfiguracionAnalytics;
  onActualizarConfiguracion: (config: ConfiguracionAnalytics) => Promise<void>;
  onExportarReporte: (tipo: TipoReporte, filtros: FiltrosReporte) => Promise<void>;
  onGenerarInforme: (parametros: ParametrosInforme) => Promise<void>;
}

interface EstadisticasGenerales {
  totalUsuarios: number;
  usuariosActivos: number;
  nuevosUsuariosMes: number;
  totalGrupos: number;
  gruposActivos: number;
  totalPosts: number;
  postsMes: number;
  totalEventos: number;
  eventosMes: number;
  totalOfertas: number;
  ofertasMes: number;
  tasaRetencion: number;
  tiempoPromedioSesion: number;
  paginasVistasSesion: number;
  tasaRebote: number;
}

interface EstadisticasComunidad {
  comunidadId: string;
  nombre: string;
  usuarios: number;
  usuariosActivos: number;
  grupos: number;
  posts: number;
  eventos: number;
  ofertas: number;
  crecimientoUsuarios: number;
  participacion: number;
  satisfaccion: number;
}

interface TendenciasTiempo {
  fecha: string;
  usuarios: number;
  usuariosActivos: number;
  posts: number;
  eventos: number;
  sesiones: number;
  tiempoSesion: number;
}

interface RendimientoContenido {
  postsMasPopulares: {
    id: string;
    contenido: string;
    autor: string;
    likes: number;
    comentarios: number;
    compartidos: number;
    alcance: number;
  }[];
  gruposMasActivos: {
    id: string;
    nombre: string;
    miembros: number;
    postsUltimoMes: number;
    participacion: number;
    crecimiento: number;
  }[];
  eventosMasPopulares: {
    id: string;
    titulo: string;
    asistentes: number;
    categoria: string;
    satisfaccion: number;
  }[];
  ofertasMasDemandadas: {
    id: string;
    titulo: string;
    candidatos: number;
    vistas: number;
    tasaConversion: number;
  }[];
}

interface ReporteActividad {
  horasActividad: {
    hora: number;
    actividad: number;
  }[];
  diasSemana: {
    dia: string;
    actividad: number;
  }[];
  dispositivosUsados: {
    dispositivo: string;
    porcentaje: number;
    usuarios: number;
  }[];
  ubicacionesUsuarios: {
    provincia: string;
    usuarios: number;
    porcentaje: number;
  }[];
}

interface AlertaSeguridad {
  id: string;
  tipo: 'spam' | 'contenido-inapropiado' | 'actividad-sospechosa' | 'error-sistema';
  titulo: string;
  descripcion: string;
  severidad: 'baja' | 'media' | 'alta' | 'critica';
  fecha: Date;
  resuelta: boolean;
  afectados: number;
}

interface ConfiguracionAnalytics {
  frecuenciaReportes: 'diario' | 'semanal' | 'mensual';
  emailsNotificacion: string[];
  alertasEnabled: boolean;
  metricsEnabled: string[];
  retencionDatos: number; // días
  privacidadDatos: boolean;
}

type TipoReporte = 'usuarios' | 'contenido' | 'actividad' | 'completo';

interface FiltrosReporte {
  fechaDesde: Date;
  fechaHasta: Date;
  comunidades: string[];
  incluirDatos: string[];
}

interface ParametrosInforme {
  tipo: 'ejecutivo' | 'tecnico' | 'comunidad';
  periodo: 'semanal' | 'mensual' | 'trimestral' | 'anual';
  destinatarios: string[];
  incluirRecomendaciones: boolean;
}

// Componente de métricas principales
const MetricasPrincipales: React.FC<{ estadisticas: EstadisticasGenerales }> = ({ estadisticas }) => {
  const metricas = [
    {
      titulo: 'Total Usuarios',
      valor: estadisticas.totalUsuarios.toLocaleString(),
      cambio: `+${estadisticas.nuevosUsuariosMes}`,
      tendencia: 'positiva',
      icono: <Users size={24} />,
      color: 'blue',
      descripcion: 'usuarios registrados'
    },
    {
      titulo: 'Usuarios Activos',
      valor: estadisticas.usuariosActivos.toLocaleString(),
      cambio: `${Math.round((estadisticas.usuariosActivos / estadisticas.totalUsuarios) * 100)}%`,
      tendencia: 'positiva',
      icono: <Activity size={24} />,
      color: 'green',
      descripcion: 'del total'
    },
    {
      titulo: 'Grupos Activos',
      valor: estadisticas.gruposActivos.toLocaleString(),
      cambio: `${estadisticas.totalGrupos} total`,
      tendencia: 'neutral',
      icono: <Layers size={24} />,
      color: 'purple',
      descripcion: 'grupos funcionando'
    },
    {
      titulo: 'Posts Este Mes',
      valor: estadisticas.postsMes.toLocaleString(),
      cambio: '+15%',
      tendencia: 'positiva',
      icono: <MessageSquare size={24} />,
      color: 'orange',
      descripcion: 'vs mes anterior'
    },
    {
      titulo: 'Eventos Este Mes',
      valor: estadisticas.eventosMes.toLocaleString(),
      cambio: '+8%',
      tendencia: 'positiva',
      icono: <Calendar size={24} />,
      color: 'indigo',
      descripcion: 'vs mes anterior'
    },
    {
      titulo: 'Ofertas Activas',
      valor: estadisticas.totalOfertas.toLocaleString(),
      cambio: `+${estadisticas.ofertasMes}`,
      tendencia: 'positiva',
      icono: <Briefcase size={24} />,
      color: 'teal',
      descripcion: 'nuevas este mes'
    },
    {
      titulo: 'Tasa Retención',
      valor: `${estadisticas.tasaRetencion}%`,
      cambio: '+2.5%',
      tendencia: 'positiva',
      icono: <Target size={24} />,
      color: 'pink',
      descripcion: 'usuarios que regresan'
    },
    {
      titulo: 'Tiempo Sesión',
      valor: `${Math.round(estadisticas.tiempoPromedioSesion)}min`,
      cambio: '+1.2min',
      tendencia: 'positiva',
      icono: <Clock size={24} />,
      color: 'yellow',
      descripcion: 'promedio por sesión'
    }
  ];

  const obtenerColorMetrica = (color: string) => {
    const colores = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      indigo: 'bg-indigo-500',
      teal: 'bg-teal-500',
      pink: 'bg-pink-500',
      yellow: 'bg-yellow-500'
    };
    return colores[color as keyof typeof colores] || 'bg-gray-500';
  };

  const obtenerIconoTendencia = (tendencia: string) => {
    switch (tendencia) {
      case 'positiva': return <ArrowUp size={14} className="text-green-600" />;
      case 'negativa': return <ArrowDown size={14} className="text-red-600" />;
      default: return <Minus size={14} className="text-gray-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricas.map((metrica, indice) => (
        <div key={indice} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${obtenerColorMetrica(metrica.color)} text-white`}>
              {metrica.icono}
            </div>
            <div className="flex items-center space-x-1">
              {obtenerIconoTendencia(metrica.tendencia)}
              <span className={`text-sm font-medium ${
                metrica.tendencia === 'positiva' ? 'text-green-600' : 
                metrica.tendencia === 'negativa' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metrica.cambio}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{metrica.titulo}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{metrica.valor}</p>
            <p className="text-xs text-gray-500">{metrica.descripcion}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente de estadísticas por comunidad
const EstadisticasPorComunidad: React.FC<{ 
  estadisticas: EstadisticasComunidad[];
  onSeleccionarComunidad: (comunidadId: string) => void;
}> = ({ estadisticas, onSeleccionarComunidad }) => {
  const [ordenarPor, setOrdenarPor] = useState<'usuarios' | 'participacion' | 'crecimiento'>('usuarios');

  const estadisticasOrdenadas = [...estadisticas].sort((a, b) => {
    switch (ordenarPor) {
      case 'usuarios': return b.usuarios - a.usuarios;
      case 'participacion': return b.participacion - a.participacion;
      case 'crecimiento': return b.crecimientoUsuarios - a.crecimientoUsuarios;
      default: return 0;
    }
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Estadísticas por Comunidad</h3>
        <select
          value={ordenarPor}
          onChange={(e) => setOrdenarPor(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="usuarios">Ordenar por usuarios</option>
          <option value="participacion">Ordenar por participación</option>
          <option value="crecimiento">Ordenar por crecimiento</option>
        </select>
      </div>

      <div className="space-y-4">
        {estadisticasOrdenadas.map((comunidad, indice) => (
          <div
            key={comunidad.comunidadId}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => onSeleccionarComunidad(comunidad.comunidadId)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                {indice + 1}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{comunidad.nombre}</h4>
                <p className="text-sm text-gray-600">
                  {comunidad.usuarios.toLocaleString()} usuarios • {comunidad.grupos} grupos
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <p className="font-medium text-gray-900">{comunidad.usuariosActivos}</p>
                <p className="text-gray-600">Activos</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">{comunidad.participacion}%</p>
                <p className="text-gray-600">Participación</p>
              </div>
              <div className="text-center">
                <p className={`font-medium ${
                  comunidad.crecimientoUsuarios > 0 ? 'text-green-600' : 
                  comunidad.crecimientoUsuarios < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {comunidad.crecimientoUsuarios > 0 ? '+' : ''}{comunidad.crecimientoUsuarios}%
                </p>
                <p className="text-gray-600">Crecimiento</p>
              </div>
              <div className="text-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`${
                        i < Math.round(comunidad.satisfaccion / 20) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-xs">Satisfacción</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de gráfico de tendencias
const GraficoTendencias: React.FC<{ 
  datos: TendenciasTiempo[];
  metrica: 'usuarios' | 'posts' | 'eventos' | 'sesiones';
  onCambiarMetrica: (metrica: 'usuarios' | 'posts' | 'eventos' | 'sesiones') => void;
}> = ({ datos, metrica, onCambiarMetrica }) => {
  const obtenerValorMetrica = (item: TendenciasTiempo) => {
    switch (metrica) {
      case 'usuarios': return item.usuariosActivos;
      case 'posts': return item.posts;
      case 'eventos': return item.eventos;
      case 'sesiones': return item.sesiones;
      default: return 0;
    }
  };

  const valorMaximo = Math.max(...datos.map(obtenerValorMetrica));

  const metricas = [
    { key: 'usuarios', label: 'Usuarios Activos', color: 'blue' },
    { key: 'posts', label: 'Posts', color: 'green' },
    { key: 'eventos', label: 'Eventos', color: 'purple' },
    { key: 'sesiones', label: 'Sesiones', color: 'orange' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Tendencias de Actividad</h3>
        <div className="flex space-x-2">
          {metricas.map((item) => (
            <button
              key={item.key}
              onClick={() => onCambiarMetrica(item.key as any)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                metrica === item.key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico simplificado */}
      <div className="h-64 flex items-end justify-between space-x-1">
        {datos.slice(-30).map((item, indice) => {
          const valor = obtenerValorMetrica(item);
          const altura = (valor / valorMaximo) * 100;
          
          return (
            <div key={indice} className="flex flex-col items-center space-y-1 flex-1">
              <div
                className="bg-blue-500 rounded-t w-full min-h-[4px] transition-all hover:bg-blue-600"
                style={{ height: `${altura}%` }}
                title={`${item.fecha}: ${valor}`}
              />
              <span className="text-xs text-gray-500 transform -rotate-45 origin-bottom-left">
                {new Date(item.fecha).toLocaleDateString('es', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">
            {metricas.find(m => m.key === metrica)?.label}
          </span>
        </div>
      </div>
    </div>
  );
};

// Componente de rendimiento de contenido
const RendimientoContenido: React.FC<{ rendimiento: RendimientoContenido }> = ({ rendimiento }) => {
  const [seccionActiva, setSeccionActiva] = useState<'posts' | 'grupos' | 'eventos' | 'ofertas'>('posts');

  const secciones = [
    { key: 'posts', label: 'Posts Populares', icono: <MessageSquare size={16} /> },
    { key: 'grupos', label: 'Grupos Activos', icono: <Users size={16} /> },
    { key: 'eventos', label: 'Eventos Populares', icono: <Calendar size={16} /> },
    { key: 'ofertas', label: 'Ofertas Demandadas', icono: <Briefcase size={16} /> }
  ];

  const renderizarContenido = () => {
    switch (seccionActiva) {
      case 'posts':
        return (
          <div className="space-y-4">
            {rendimiento.postsMasPopulares.map((post, indice) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                    {indice + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {post.contenido}
                    </p>
                    <p className="text-xs text-gray-500">Por {post.autor}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Heart size={14} />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare size={14} />
                    <span>{post.comentarios}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share size={14} />
                    <span>{post.compartidos}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye size={14} />
                    <span>{post.alcance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'grupos':
        return (
          <div className="space-y-4">
            {rendimiento.gruposMasActivos.map((grupo, indice) => (
              <div key={grupo.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full font-semibold text-sm">
                    {indice + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{grupo.nombre}</h4>
                    <p className="text-sm text-gray-600">{grupo.miembros} miembros</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{grupo.postsUltimoMes}</p>
                    <p className="text-gray-600">Posts/mes</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{grupo.participacion}%</p>
                    <p className="text-gray-600">Participación</p>
                  </div>
                  <div className="text-center">
                    <p className={`font-medium ${grupo.crecimiento > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {grupo.crecimiento > 0 ? '+' : ''}{grupo.crecimiento}%
                    </p>
                    <p className="text-gray-600">Crecimiento</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'eventos':
        return (
          <div className="space-y-4">
            {rendimiento.eventosMasPopulares.map((evento, indice) => (
              <div key={evento.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-semibold text-sm">
                    {indice + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{evento.titulo}</h4>
                    <p className="text-sm text-gray-600">{evento.categoria}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{evento.asistentes}</p>
                    <p className="text-gray-600">Asistentes</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={`${
                            i < Math.round(evento.satisfaccion / 20) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">Satisfacción</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'ofertas':
        return (
          <div className="space-y-4">
            {rendimiento.ofertasMasDemandadas.map((oferta, indice) => (
              <div key={oferta.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-semibold text-sm">
                    {indice + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{oferta.titulo}</h4>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{oferta.candidatos}</p>
                    <p className="text-gray-600">Candidatos</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{oferta.vistas}</p>
                    <p className="text-gray-600">Vistas</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{oferta.tasaConversion}%</p>
                    <p className="text-gray-600">Conversión</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Rendimiento del Contenido</h3>
        <div className="flex space-x-2">
          {secciones.map((seccion) => (
            <button
              key={seccion.key}
              onClick={() => setSeccionActiva(seccion.key as any)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                seccionActiva === seccion.key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {seccion.icono}
              <span>{seccion.label}</span>
            </button>
          ))}
        </div>
      </div>

      {renderizarContenido()}
    </div>
  );
};

// Componente de alertas de seguridad
const AlertasSeguridad: React.FC<{ 
  alertas: AlertaSeguridad[];
  onResolverAlerta: (alertaId: string) => void;
}> = ({ alertas, onResolverAlerta }) => {
  const alertasActivas = alertas.filter(alerta => !alerta.resuelta);
  
  const obtenerColorSeveridad = (severidad: string) => {
    switch (severidad) {
      case 'critica': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const obtenerIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'spam': return <Mail size={16} />;
      case 'contenido-inapropiado': return <AlertCircle size={16} />;
      case 'actividad-sospechosa': return <Shield size={16} />;
      case 'error-sistema': return <XCircle size={16} />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Alertas de Seguridad
          {alertasActivas.length > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {alertasActivas.length}
            </span>
          )}
        </h3>
      </div>

      {alertasActivas.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Todo en orden</h4>
          <p className="text-gray-600">No hay alertas de seguridad activas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alertasActivas.map((alerta) => (
            <div key={alerta.id} className={`border rounded-lg p-4 ${obtenerColorSeveridad(alerta.severidad)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {obtenerIconoTipo(alerta.tipo)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{alerta.titulo}</h4>
                    <p className="text-sm mb-2">{alerta.descripcion}</p>
                    <div className="flex items-center space-x-4 text-xs">
                      <span>Severidad: {alerta.severidad}</span>
                      <span>Afectados: {alerta.afectados}</span>
                      <span>{alerta.fecha.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Boton
                  variante="secundario"
                  tamaño="sm"
                  onClick={() => onResolverAlerta(alerta.id)}
                >
                  Resolver
                </Boton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente principal
export const AnalyticsGlobales: React.FC<PropiedadesAnalyticsGlobales> = ({
  usuario,
  estadisticasGenerales,
  estadisticasComunidades,
  tendenciasUsuarios,
  rendimientoContenido,
  reporteActividad,
  alertasSeguridad,
  configuracionAnalytics,
  onActualizarConfiguracion,
  onExportarReporte,
  onGenerarInforme
}) => {
  const { configuracion } = useComunidad();
  const [pestañaActiva, setPestañaActiva] = useState<'resumen' | 'comunidades' | 'contenido' | 'actividad' | 'seguridad' | 'reportes'>('resumen');
  const [metricaTendencia, setMetricaTendencia] = useState<'usuarios' | 'posts' | 'eventos' | 'sesiones'>('usuarios');
  const [cargandoReporte, setCargandoReporte] = useState(false);

  const pestañas = [
    { id: 'resumen', nombre: 'Resumen', icono: <BarChart3 size={16} /> },
    { id: 'comunidades', nombre: 'Comunidades', icono: <Globe size={16} /> },
    { id: 'contenido', nombre: 'Contenido', icono: <MessageSquare size={16} /> },
    { id: 'actividad', nombre: 'Actividad', icono: <Activity size={16} /> },
    { id: 'seguridad', nombre: 'Seguridad', icono: <Shield size={16} /> },
    { id: 'reportes', nombre: 'Reportes', icono: <FileText size={16} /> }
  ];

  const manejarExportarReporte = async () => {
    setCargandoReporte(true);
    try {
      await onExportarReporte('completo', {
        fechaDesde: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        fechaHasta: new Date(),
        comunidades: estadisticasComunidades.map(c => c.comunidadId),
        incluirDatos: ['usuarios', 'contenido', 'actividad']
      });
    } catch (error) {
      console.error('Error exportando reporte:', error);
    } finally {
      setCargandoReporte(false);
    }
  };

  const renderizarContenido = () => {
    switch (pestañaActiva) {
      case 'resumen':
        return (
          <div className="space-y-6">
            <MetricasPrincipales estadisticas={estadisticasGenerales} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GraficoTendencias
                datos={tendenciasUsuarios}
                metrica={metricaTendencia}
                onCambiarMetrica={setMetricaTendencia}
              />
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad por Horas</h3>
                <div className="h-48 flex items-end justify-between space-x-1">
                  {reporteActividad.horasActividad.map((hora) => {
                    const maxActividad = Math.max(...reporteActividad.horasActividad.map(h => h.actividad));
                    const altura = (hora.actividad / maxActividad) * 100;
                    
                    return (
                      <div key={hora.hora} className="flex flex-col items-center space-y-1 flex-1">
                        <div
                          className="bg-green-500 rounded-t w-full min-h-[4px]"
                          style={{ height: `${altura}%` }}
                          title={`${hora.hora}:00 - ${hora.actividad} actividades`}
                        />
                        <span className="text-xs text-gray-500">{hora.hora}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Actividad promedio por hora (últimos 30 días)
                </p>
              </div>
            </div>
          </div>
        );

      case 'comunidades':
        return (
          <div className="space-y-6">
            <EstadisticasPorComunidad
              estadisticas={estadisticasComunidades}
              onSeleccionarComunidad={(id) => console.log('Seleccionar comunidad:', id)}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución Geográfica</h3>
                <div className="space-y-3">
                  {reporteActividad.ubicacionesUsuarios.map((ubicacion) => (
                    <div key={ubicacion.provincia} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{ubicacion.provincia}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${ubicacion.porcentaje}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12 text-right">
                          {ubicacion.usuarios}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispositivos Utilizados</h3>
                <div className="space-y-4">
                  {reporteActividad.dispositivosUsados.map((dispositivo, indice) => (
                    <div key={indice} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 capitalize">{dispositivo.dispositivo}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${dispositivo.porcentaje}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {dispositivo.porcentaje}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'contenido':
        return (
          <div className="space-y-6">
            <RendimientoContenido rendimiento={rendimientoContenido} />
          </div>
        );

      case 'actividad':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad por Día de la Semana</h3>
                <div className="space-y-3">
                  {reporteActividad.diasSemana.map((dia) => {
                    const maxActividad = Math.max(...reporteActividad.diasSemana.map(d => d.actividad));
                    const porcentaje = (dia.actividad / maxActividad) * 100;
                    
                    return (
                      <div key={dia.dia} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 w-16">{dia.dia}</span>
                        <div className="flex items-center space-x-3 flex-1 ml-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-indigo-500 h-3 rounded-full"
                              style={{ width: `${porcentaje}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-12 text-right">
                            {dia.actividad}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Sesión</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock size={20} className="text-blue-500" />
                      <span className="text-sm font-medium text-gray-900">Duración promedio</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {Math.round(estadisticasGenerales.tiempoPromedioSesion)}min
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Eye size={20} className="text-green-500" />
                      <span className="text-sm font-medium text-gray-900">Páginas por sesión</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {estadisticasGenerales.paginasVistasSesion.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Target size={20} className="text-purple-500" />
                      <span className="text-sm font-medium text-gray-900">Tasa de rebote</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {estadisticasGenerales.tasaRebote}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendingUp size={20} className="text-orange-500" />
                      <span className="text-sm font-medium text-gray-900">Tasa retención</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {estadisticasGenerales.tasaRetencion}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'seguridad':
        return (
          <div className="space-y-6">
            <AlertasSeguridad
              alertas={alertasSeguridad}
              onResolverAlerta={(id) => console.log('Resolver alerta:', id)}
            />
          </div>
        );

      case 'reportes':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generar Reportes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Reporte de Usuarios</h4>
                  <p className="text-sm text-gray-600 mb-4">Análisis detallado de la base de usuarios</p>
                  <Boton variante="secundario" tamaño="sm" className="w-full">
                    Generar
                  </Boton>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Reporte de Contenido</h4>
                  <p className="text-sm text-gray-600 mb-4">Estadísticas de posts, grupos y eventos</p>
                  <Boton variante="secundario" tamaño="sm" className="w-full">
                    Generar
                  </Boton>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Reporte Ejecutivo</h4>
                  <p className="text-sm text-gray-600 mb-4">Resumen ejecutivo mensual</p>
                  <Boton variante="secundario" tamaño="sm" className="w-full">
                    Generar
                  </Boton>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Exportar Datos Completos</h4>
                    <p className="text-sm text-gray-600">Descarga todos los datos en formato Excel</p>
                  </div>
                  <Boton
                    variante="primario"
                    onClick={manejarExportarReporte}
                    disabled={cargandoReporte}
                    cargando={cargandoReporte}
                    icono={<Download size={16} />}
                  >
                    Exportar
                  </Boton>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Globales</h1>
              <p className="text-gray-600">Panel de control principal de la plataforma</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Boton
                variante="ghost"
                icono={<RefreshCw size={16} />}
                onClick={() => window.location.reload()}
              >
                Actualizar
              </Boton>
              <Boton
                variante="secundario"
                icono={<Download size={16} />}
                onClick={manejarExportarReporte}
                disabled={cargandoReporte}
              >
                Exportar
              </Boton>
              <Boton
                variante="primario"
                icono={<Settings size={16} />}
              >
                Configurar
              </Boton>
            </div>
          </div>
          
          {/* Pestañas */}
          <div className="flex space-x-8 overflow-x-auto">
            {pestañas.map(pestaña => (
              <button
                key={pestaña.id}
                onClick={() => setPestañaActiva(pestaña.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  pestañaActiva === pestaña.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {pestaña.icono}
                <span>{pestaña.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderizarContenido()}
      </div>
    </div>
  );
};

export default AnalyticsGlobales;