'use client'

import { AudienciaDemo, VistaDemo } from '../../../tipos/demo'
import { useDemoData } from '@/contextos/DemoDataProvider'
import { useDemo } from '@/contextos/DemoContext'
import { 
  Users, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  Building,
  FileText,
  Bell,
  Search,
  Crown,
  Settings,
  BarChart3,
  Clock,
  Eye
} from 'lucide-react'

interface DemoContentProps {
  vista: VistaDemo
  audiencia: AudienciaDemo
  comunidadId: string
}

export default function DemoContent({
  vista,
  audiencia,
  comunidadId
}: DemoContentProps) {
  const { datosDemo } = useDemoData()
  
  // Extraer datos con fallbacks seguros
  const usuarios = datosDemo?.usuarios || []
  const grupos = datosDemo?.grupos || []
  const ofertas = datosDemo?.ofertas || []
  const eventos = datosDemo?.eventos || []
  const { trackearEvento } = useDemo()
  
  // ✅ TRACK DE INTERACCIONES
  const handleInteraction = (accion: string, elemento: string) => {
    trackearEvento({
      tipo: 'interaccion' as any,
      usuarioDemo: 'demo_user',
      seccion: vista,
      accion,
      metadata: { elemento, audiencia }
    })
  }
  
  // ✅ COMPONENTE: Dashboard por audiencia
  const renderDashboard = () => {
    const dashboards = {
      administracion: (
        <div className="space-y-6">
          {/* Header con métricas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">1.247</p>
                  <p className="text-sm text-gray-600">Col·legues connectats</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">23</p>
                  <p className="text-sm text-gray-600">Missatges nous</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                  <p className="text-sm text-gray-600">Esdeveniments avui</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Bell className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                  <p className="text-sm text-gray-600">Notificacions</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feed de actividad */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Activitat Recent</h3>
            </div>
            <div className="p-6 space-y-4">
              {usuarios.slice(0, 5).map((usuario: any, index: number) => (
                <div key={index} className="flex items-center space-x-4">
                  <img 
                    src={usuario.avatar} 
                    alt={usuario.nom}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{usuario.nom}</span> ha compartit una actualització al grup{' '}
                      <span className="text-blue-600">Funcionaris IT</span>
                    </p>
                    <p className="text-xs text-gray-500">Fa {index + 1} hores</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      
      empresa: (
        <div className="space-y-6">
          {/* Métricas comerciales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">34</p>
                  <p className="text-sm text-gray-600">Oportunidades activas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">127</p>
                  <p className="text-sm text-gray-600">Contactos clave</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-sm text-gray-600">Licitaciones nuevas</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Oportunidades recientes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Oportunidades Recientes</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-medium text-gray-900">Modernización Infraestructura IT</h4>
                  <p className="text-sm text-gray-600 mt-1">Generalitat de Catalunya - Dept. Economia</p>
                  <p className="text-xs text-green-600 mt-2">Publicado hace 2 días • €2.3M</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-medium text-gray-900">Consultoría Transformación Digital</h4>
                  <p className="text-sm text-gray-600 mt-1">Ajuntament de Barcelona</p>
                  <p className="text-xs text-blue-600 mt-2">Publicado hace 5 días • €890K</p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <h4 className="font-medium text-gray-900">Software Gestión Ciudadana</h4>
                  <p className="text-sm text-gray-600 mt-1">Diputació de Barcelona</p>
                  <p className="text-xs text-purple-600 mt-2">Borrador • €1.5M</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      
      stakeholder: (
        <div className="space-y-6">
          {/* KPIs Ejecutivos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8" />
                <div>
                  <p className="text-3xl font-bold">2.847</p>
                  <p className="text-blue-100">Usuarios Activos</p>
                </div>
              </div>
              <div className="mt-4 text-blue-100 text-sm">
                <span className="text-white font-medium">+23%</span> vs mes anterior
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-8 h-8" />
                <div>
                  <p className="text-3xl font-bold">87%</p>
                  <p className="text-green-100">Adopción</p>
                </div>
              </div>
              <div className="mt-4 text-green-100 text-sm">
                <span className="text-white font-medium">+12%</span> vs trimestre anterior
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8" />
                <div>
                  <p className="text-3xl font-bold">43m</p>
                  <p className="text-purple-100">Tiempo Promedio</p>
                </div>
              </div>
              <div className="mt-4 text-purple-100 text-sm">
                <span className="text-white font-medium">+8m</span> vs mes anterior
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <p className="text-3xl font-bold">€127K</p>
                  <p className="text-orange-100">ROI Mensual</p>
                </div>
              </div>
              <div className="mt-4 text-orange-100 text-sm">
                <span className="text-white font-medium">+34%</span> efficiency gain
              </div>
            </div>
          </div>
          
          {/* Gráficos y analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crecimiento de Usuarios</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-16 h-16 mx-auto mb-2" />
                  <p>Gráfico de crecimiento interactivo</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement por Comunidad</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Catalunya</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '87%'}}></div>
                    </div>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Euskadi</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '73%'}}></div>
                    </div>
                    <span className="text-sm font-medium">73%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Madrid</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    
    return dashboards[audiencia as keyof typeof dashboards] || dashboards.administracion
  }
  
  // ✅ COMPONENTE: Lista genérica reutilizable
  const renderLista = (titulo: string, items: any[], renderItem: (item: any, index: number) => React.ReactNode) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {items.slice(0, 8).map((item, index) => (
          <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
  
  // ✅ RENDERIZADO POR VISTA
  switch (vista) {
    case 'dashboard':
      return renderDashboard()
      
    case 'grupos':
    case 'afiliats':
      return renderLista(
        audiencia === 'sindicato' ? 'Afiliados Activos' : 'Grups Professionals',
        grupos,
        (grupo, index) => (
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{grupo.nom}</h4>
              <p className="text-sm text-gray-600">{grupo.membres?.length || Math.floor(Math.random() * 200 + 50)} membres</p>
            </div>
            <button 
              onClick={() => handleInteraction('clic_grupo', grupo.nom)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Veure
            </button>
          </div>
        )
      )
      
    case 'missatges':
      return renderLista(
        'Conversations Recents',
        usuarios,
        (usuario, index) => (
          <div className="flex items-center space-x-4">
            <img 
              src={usuario.avatar} 
              alt={usuario.nom}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900">{usuario.nom}</h4>
                {index < 3 && <div className="w-2 h-2 bg-green-400 rounded-full" />}
              </div>
              <p className="text-sm text-gray-600">Últim missatge fa {index + 1}h</p>
            </div>
            <button 
              onClick={() => handleInteraction('obrir_conversa', usuario.nom)}
              className="text-blue-600 hover:text-blue-700"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        )
      )
      
    case 'esdeveniments':
      return renderLista(
        audiencia === 'sindicato' ? 'Movilizaciones Programadas' : 'Esdeveniments Propers',
        eventos,
        (evento, index) => (
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{evento.titol}</h4>
              <p className="text-sm text-gray-600">{evento.data} • {evento.ubicacio}</p>
              <p className="text-xs text-purple-600">{evento.assistents} assistents</p>
            </div>
            <button 
              onClick={() => handleInteraction('veure_esdeveniment', evento.titol)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Apuntar-se
            </button>
          </div>
        )
      )
      
    case 'licitacions':
    case 'consultes':
      return renderLista(
        audiencia === 'empresa' ? 'Licitaciones Activas' : 'Consultas Públicas',
        ofertas,
        (oferta, index) => (
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{oferta.titol}</h4>
                <p className="text-sm text-gray-600 mt-1">{oferta.descripcio}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Publicat: {oferta.dataPublicacio}</span>
                  <span>Límit: {oferta.dataLimit}</span>
                  {audiencia === 'empresa' && <span className="text-green-600 font-medium">€{oferta.pressupost}</span>}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleInteraction('veure_licitacio', oferta.titol)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )
      )
      
    default:
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Vista en Construcción</h3>
            <p className="text-gray-600 mb-6">
              Esta vista de la demo está siendo desarrollada para la audiencia <strong>{audiencia}</strong>.
            </p>
            <button 
              onClick={() => handleInteraction('clic_construccion', vista)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Notificar cuando esté lista
            </button>
          </div>
        </div>
      )
  }
}