'use client'

import { useState } from 'react'
import { AudienciaDemo } from '../../../tipos/demo'
import { 
  Settings, 
  RotateCcw, 
  Download, 
  Users, 
  Clock, 
  BarChart3,
  Zap,
  Menu,
  X,
  Building,
  Crown,
  Shield,
  User
} from 'lucide-react'

interface DemoHeaderProps {
  audiencia: AudienciaDemo
  datosPersonalizados?: {
    nombreOrganizacion?: string
    logoOrganizacion?: string
    coloresPersonalizados?: {
      primario: string
      secundario: string
    }
  }
  modoKiosko: boolean
  onReiniciar: () => void
  onExportar: () => void
}

export default function DemoHeader({
  audiencia,
  datosPersonalizados,
  modoKiosko,
  onReiniciar,
  onExportar
}: DemoHeaderProps) {
  const [mostrarMenu, setMostrarMenu] = useState(false)
  
  // ✅ CONFIGURACIÓN POR AUDIENCIA
  const configuraciones = {
    administracion: {
      titulo: 'La Pública - Demo Funcionaris',
      descripcion: 'Xarxa professional del sector públic',
      icono: <Building className="w-6 h-6" />,
      color: 'bg-blue-500',
      usuario: {
        nombre: 'Maria García',
        cargo: 'Tècnica Superior - Generalitat',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=150&h=150&fit=crop&crop=face'
      }
    },
    empresa: {
      titulo: 'La Pública - Portal Empresas',
      descripcion: 'Conecta con el sector público',
      icono: <Building className="w-6 h-6" />,
      color: 'bg-green-500',
      usuario: {
        nombre: 'Josep Martínez',
        cargo: 'Director Comercial - TechCorp',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    },
    stakeholder: {
      titulo: 'La Pública - Dashboard Ejecutivo',
      descripcion: 'Panel de control estratégico',
      icono: <Crown className="w-6 h-6" />,
      color: 'bg-purple-500',
      usuario: {
        nombre: 'Anna Puig',
        cargo: 'Directora General - EAPC',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      }
    },
    sindicato: {
      titulo: 'La Pública - Portal Sindical',
      descripcion: 'Representación y participación',
      icono: <Shield className="w-6 h-6" />,
      color: 'bg-red-500',
      usuario: {
        nombre: 'Carles Font',
        cargo: 'Delegado Sindical - CCOO',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      }
    },
    ciudadano: {
      titulo: 'La Pública - Acceso Ciudadano',
      descripcion: 'Participación ciudadana',
      icono: <User className="w-6 h-6" />,
      color: 'bg-indigo-500',
      usuario: {
        nombre: 'Laura Sánchez',
        cargo: 'Ciudadana',
        avatar: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=150&h=150&fit=crop&crop=face'
      }
    },
    desarrollador: {
      titulo: 'La Pública - Panel Técnico',
      descripcion: 'Configuración y desarrollo',
      icono: <Settings className="w-6 h-6" />,
      color: 'bg-gray-500',
      usuario: {
        nombre: 'Marc Ribas',
        cargo: 'Desarrollador Senior',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'
      }
    }
  }
  
  const config = configuraciones[audiencia]
  
  return (
    <>
      {/* ✅ HEADER PRINCIPAL */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* ✅ LOGO Y TÍTULO */}
            <div className="flex items-center space-x-4">
              {/* Logo personalizado o por defecto */}
              {datosPersonalizados?.logoOrganizacion ? (
                <img 
                  src={datosPersonalizados.logoOrganizacion}
                  alt={datosPersonalizados.nombreOrganizacion}
                  className="h-8 w-auto"
                />
              ) : (
                <div className={`${config.color} p-2 rounded-lg text-white`}>
                  {config.icono}
                </div>
              )}
              
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {datosPersonalizados?.nombreOrganizacion || config.titulo}
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {config.descripcion}
                </p>
              </div>
            </div>
            
            {/* ✅ INDICADOR DE DEMO */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 shadow-lg">
                <Zap className="w-4 h-4" />
                <span>DEMO INTERACTIVA</span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
              
              {/* Selector de audiencia */}
              <select 
                value={audiencia}
                onChange={(e) => {
                  // En la implementación real, cambiar audiencia dinámicamente
                  console.log('Cambiar audiencia a:', e.target.value)
                }}
                className="text-sm border border-gray-200 rounded-md px-3 py-1 bg-white"
              >
                <option value="administracion">👩‍💼 Administración</option>
                <option value="empresa">🏢 Empresa</option>
                <option value="stakeholder">👔 Directivo</option>
                <option value="sindicato">🤝 Sindicato</option>
                <option value="ciudadano">👤 Ciudadano</option>
                <option value="desarrollador">💻 Técnico</option>
              </select>
            </div>
            
            {/* ✅ USUARIO Y ACCIONES */}
            <div className="flex items-center space-x-4">
              
              {/* Acciones rápidas (solo si no es modo kiosko) */}
              {!modoKiosko && (
                <div className="hidden lg:flex items-center space-x-2">
                  <button
                    onClick={onReiniciar}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Reiniciar demo"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={onExportar}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Descargar reporte"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              {/* Usuario demo */}
              <div className="flex items-center space-x-3">
                <img
                  src={config.usuario.avatar}
                  alt={config.usuario.nombre}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {config.usuario.nombre}
                  </p>
                  <p className="text-xs text-gray-500">
                    {config.usuario.cargo}
                  </p>
                </div>
              </div>
              
              {/* Menú móvil */}
              <button
                onClick={() => setMostrarMenu(!mostrarMenu)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                {mostrarMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* ✅ STATS BAR (solo para stakeholders) */}
        {audiencia === 'stakeholder' && (
          <div className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>2.847 usuarios activos</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>43min tiempo promedio</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <BarChart3 className="w-4 h-4" />
                    <span>+23% crecimiento mensual</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Última actualización: hace 5 min
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* ✅ MENÚ MÓVIL */}
      {mostrarMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMostrarMenu(false)}>
          <div className="bg-white w-80 h-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Opciones Demo</h3>
                <button onClick={() => setMostrarMenu(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Selector de audiencia móvil */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cambiar perspectiva:
                </label>
                <select 
                  value={audiencia}
                  className="w-full border border-gray-200 rounded-md px-3 py-2"
                >
                  <option value="administracion">👩‍💼 Funcionario</option>
                  <option value="empresa">🏢 Empresa</option>
                  <option value="stakeholder">👔 Directivo</option>
                  <option value="sindicato">🤝 Sindicato</option>
                  <option value="ciudadano">👤 Ciudadano</option>
                  <option value="desarrollador">💻 Técnico</option>
                </select>
              </div>
              
              {/* Acciones */}
              {!modoKiosko && (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onReiniciar()
                      setMostrarMenu(false)
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reiniciar Demo</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onExportar()
                      setMostrarMenu(false)
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Descargar Reporte</span>
                  </button>
                </div>
              )}
              
              {/* Info de la sesión */}
              <div className="pt-4 border-t border-gray-200">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    Demo Personalizada
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Perspectiva: {audiencia}<br/>
                    {datosPersonalizados?.nombreOrganizacion && 
                      `Organización: ${datosPersonalizados.nombreOrganizacion}`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}