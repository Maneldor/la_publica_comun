'use client'

import { AudienciaDemo, VistaDemo } from '../../../tipos/demo'
import { 
  Home, 
  Users, 
  MessageSquare, 
  Calendar,
  Building,
  TrendingUp,
  Settings,
  FileText,
  Bell,
  Search,
  ChevronLeft
} from 'lucide-react'

interface DemoNavigationProps {
  vistaActual: VistaDemo
  audiencia: AudienciaDemo
  onCambiarVista: (vista: VistaDemo) => void
  puedeRetroceder: boolean
  onRetroceder: () => void
}

export default function DemoNavigation({
  vistaActual,
  audiencia,
  onCambiarVista,
  puedeRetroceder,
  onRetroceder
}: DemoNavigationProps) {
  
  // ✅ CONFIGURACIÓN DE NAVEGACIÓN POR AUDIENCIA
  const configuracionesNavegacion = {
    administracion: {
      vistas: [
        { id: 'dashboard' as VistaDemo, titulo: 'Dashboard', icono: <Home className="w-5 h-5" />, descripcion: 'Vista general' },
        { id: 'grupos' as VistaDemo, titulo: 'Grups Professionals', icono: <Users className="w-5 h-5" />, descripcion: 'Networking sectorial' },
        { id: 'missatges' as VistaDemo, titulo: 'Missatges', icono: <MessageSquare className="w-5 h-5" />, descripcion: 'Comunicació directa' },
        { id: 'esdeveniments' as VistaDemo, titulo: 'Esdeveniments', icono: <Calendar className="w-5 h-5" />, descripcion: 'Formació i actes' },
        { id: 'directori' as VistaDemo, titulo: 'Directori', icono: <Search className="w-5 h-5" />, descripcion: 'Cerca col·legues' },
        { id: 'notificacions' as VistaDemo, titulo: 'Notificacions', icono: <Bell className="w-5 h-5" />, descripcion: 'Alertes i avisos' }
      ],
      colorPrimario: 'blue'
    },
    empresa: {
      vistas: [
        { id: 'dashboard' as VistaDemo, titulo: 'Portal Empresas', icono: <Building className="w-5 h-5" />, descripcion: 'Oportunidades B2G' },
        { id: 'licitacions' as VistaDemo, titulo: 'Licitaciones', icono: <FileText className="w-5 h-5" />, descripcion: 'Concursos públicos' },
        { id: 'contactes' as VistaDemo, titulo: 'Contactos', icono: <Users className="w-5 h-5" />, descripcion: 'Decisores clave' },
        { id: 'esdeveniments' as VistaDemo, titulo: 'Eventos', icono: <Calendar className="w-5 h-5" />, descripcion: 'Networking sectorial' },
        { id: 'analytics' as VistaDemo, titulo: 'Analytics', icono: <TrendingUp className="w-5 h-5" />, descripcion: 'Métricas comerciales' }
      ],
      colorPrimario: 'green'
    },
    stakeholder: {
      vistas: [
        { id: 'dashboard' as VistaDemo, titulo: 'Dashboard Ejecutivo', icono: <TrendingUp className="w-5 h-5" />, descripcion: 'KPIs estratégicos' },
        { id: 'analytics' as VistaDemo, titulo: 'Analytics Avanzado', icono: <TrendingUp className="w-5 h-5" />, descripcion: 'ROI y adopción' },
        { id: 'usuarios' as VistaDemo, titulo: 'Usuarios Activos', icono: <Users className="w-5 h-5" />, descripcion: 'Base de usuarios' },
        { id: 'engagement' as VistaDemo, titulo: 'Engagement', icono: <MessageSquare className="w-5 h-5" />, descripcion: 'Participación' },
        { id: 'configuracion' as VistaDemo, titulo: 'Configuración', icono: <Settings className="w-5 h-5" />, descripcion: 'Ajustes globales' }
      ],
      colorPrimario: 'purple'
    },
    sindicato: {
      vistas: [
        { id: 'dashboard' as VistaDemo, titulo: 'Portal Sindical', icono: <Home className="w-5 h-5" />, descripcion: 'Representación' },
        { id: 'afiliats' as VistaDemo, titulo: 'Afiliados', icono: <Users className="w-5 h-5" />, descripcion: 'Gestión sindical' },
        { id: 'negociacio' as VistaDemo, titulo: 'Negociación', icono: <FileText className="w-5 h-5" />, descripcion: 'Conv. colectivos' },
        { id: 'mobilitzacions' as VistaDemo, titulo: 'Movilizaciones', icono: <Calendar className="w-5 h-5" />, descripcion: 'Acciones sindicales' },
        { id: 'comunicats' as VistaDemo, titulo: 'Comunicados', icono: <MessageSquare className="w-5 h-5" />, descripcion: 'Comunicación' }
      ],
      colorPrimario: 'red'
    },
    ciudadano: {
      vistas: [
        { id: 'dashboard' as VistaDemo, titulo: 'Participación', icono: <Home className="w-5 h-5" />, descripcion: 'Participación ciudadana' },
        { id: 'consultes' as VistaDemo, titulo: 'Consultas', icono: <FileText className="w-5 h-5" />, descripcion: 'Consultas públicas' },
        { id: 'transparencia' as VistaDemo, titulo: 'Transparencia', icono: <Search className="w-5 h-5" />, descripcion: 'Información pública' },
        { id: 'esdeveniments' as VistaDemo, titulo: 'Eventos', icono: <Calendar className="w-5 h-5" />, descripcion: 'Actos ciudadanos' },
        { id: 'propostes' as VistaDemo, titulo: 'Propuestas', icono: <MessageSquare className="w-5 h-5" />, descripcion: 'Iniciativas' }
      ],
      colorPrimario: 'indigo'
    },
    desarrollador: {
      vistas: [
        { id: 'dashboard' as VistaDemo, titulo: 'Panel Técnico', icono: <Settings className="w-5 h-5" />, descripcion: 'Configuración' },
        { id: 'apis' as VistaDemo, titulo: 'APIs', icono: <FileText className="w-5 h-5" />, descripcion: 'Integrations' },
        { id: 'usuarios' as VistaDemo, titulo: 'Usuarios', icono: <Users className="w-5 h-5" />, descripcion: 'Gestión usuarios' },
        { id: 'analytics' as VistaDemo, titulo: 'Logs & Analytics', icono: <TrendingUp className="w-5 h-5" />, descripcion: 'Monitorización' },
        { id: 'configuracion' as VistaDemo, titulo: 'Config Avanzada', icono: <Settings className="w-5 h-5" />, descripcion: 'Administración' }
      ],
      colorPrimario: 'gray'
    }
  }
  
  const config = configuracionesNavegacion[audiencia]
  const colorClasses = {
    blue: 'bg-blue-500 text-white border-blue-500',
    green: 'bg-green-500 text-white border-green-500', 
    purple: 'bg-purple-500 text-white border-purple-500',
    red: 'bg-red-500 text-white border-red-500',
    indigo: 'bg-indigo-500 text-white border-indigo-500',
    gray: 'bg-gray-500 text-white border-gray-500'
  }
  
  const hoverClasses = {
    blue: 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600',
    green: 'hover:bg-green-50 hover:border-green-200 hover:text-green-600',
    purple: 'hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600', 
    red: 'hover:bg-red-50 hover:border-red-200 hover:text-red-600',
    indigo: 'hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600',
    gray: 'hover:bg-gray-50 hover:border-gray-200 hover:text-gray-600'
  }
  
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ✅ BREADCRUMB CON RETROCESO */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            {puedeRetroceder && (
              <button
                onClick={onRetroceder}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
            )}
            
            <div className="text-sm text-gray-600">
              <span className="capitalize">{audiencia}</span>
              <span className="mx-2">•</span>
              <span className="font-medium text-gray-900">
                {config.vistas.find(v => v.id === vistaActual)?.titulo || 'Vista Demo'}
              </span>
            </div>
          </div>
          
          {/* Indicador de demo activo */}
          <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Demo en vivo</span>
          </div>
        </div>
        
        {/* ✅ NAVEGACIÓN HORIZONTAL */}
        <div className="flex space-x-1 py-2 overflow-x-auto">
          {config.vistas.map((vista) => {
            const isActive = vistaActual === vista.id
            
            return (
              <button
                key={vista.id}
                onClick={() => onCambiarVista(vista.id)}
                className={`
                  flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all duration-200 whitespace-nowrap min-w-max
                  ${isActive 
                    ? colorClasses[config.colorPrimario as keyof typeof colorClasses]
                    : `bg-white border-gray-200 text-gray-600 ${hoverClasses[config.colorPrimario as keyof typeof hoverClasses]}`
                  }
                `}
              >
                <span className={isActive ? 'text-white' : ''}>
                  {vista.icono}
                </span>
                <div className="text-left">
                  <div className={`font-medium text-sm ${isActive ? 'text-white' : ''}`}>
                    {vista.titulo}
                  </div>
                  <div className={`text-xs ${isActive ? 'text-white text-opacity-80' : 'text-gray-500'} hidden lg:block`}>
                    {vista.descripcion}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}