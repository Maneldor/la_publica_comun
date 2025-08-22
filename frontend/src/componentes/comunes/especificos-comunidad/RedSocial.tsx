'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  MessageCircle, 
  Plus,
  Settings,
  Calendar,
  Users,
  Briefcase,
  BookOpen,
  Building,
  MapPin,
  MoreHorizontal,
  Heart,
  Share2
} from 'lucide-react';
import { useComunidad, useTema } from '../../../../hooks/useComunidad';
import { useAuth } from '../../../contextos/AuthContext';

interface PropiedadesRedSocial {
  className?: string;
}

export const RedSocial: React.FC<PropiedadesRedSocial> = ({ className = '' }) => {
  const { configuracion } = useComunidad();
  const { colores } = useTema();
  const { user } = useAuth();
  const [filtroActivitat, setFiltroActivitat] = useState('todo');

  // Posts de ejemplo
  const postsEjemplo = [
    {
      id: '1',
      autor: {
        nombre: 'Gestor Empresa',
        avatar: 'GE',
        cargo: 'Gestor',
        tiempo: '5 ago 2025'
      },
      contenido: 'Haciendo pruebas con archivos',
      imagen: null,
      likes: 0,
      comentarios: 0,
      compartir: 0
    },
    {
      id: '2',
      autor: {
        nombre: 'Gestor Empresa',
        avatar: 'GE',
        cargo: 'Gestor',
        tiempo: '5 ago 2025'
      },
      contenido: 'Haciendo pruebas😊',
      imagen: '/api/placeholder/400/250',
      likes: 0,
      comentarios: 0,
      compartir: 0
    }
  ];

  const empresas = [
    { nombre: 'Consultoria Empresarial', empleados: '15 empleats', ubicacion: 'Sevilla', id: '8' },
    { nombre: 'Marketing Digital Solutions', empleados: '25 empleats', ubicacion: 'Barcelona', id: '9' },
    { nombre: 'TechSolutions S.A.', empleados: '75 empleats', ubicacion: 'Madrid', id: '8' }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo y búsqueda */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: colores.primario }}
                >
                  LP
                </div>
                <div>
                  <div className="font-semibold text-gray-900">La pública</div>
                  <div className="text-xs text-gray-500">Comunitat Social</div>
                </div>
              </div>
              
              <div className="relative ml-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar membres, grups, activitats..."
                  className="w-80 pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Acciones del header */}
            <div className="flex items-center space-x-4">
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
              >
                <Plus size={16} />
                <span>Crear Post</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                </button>
                
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <MessageCircle size={20} className="text-gray-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">7</span>
                </button>

                <div className="flex items-center space-x-2 ml-4">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    MA
                  </div>
                  <span className="text-sm font-medium">MA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Layout principal de 3 columnas */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* COLUMNA IZQUIERDA - Navegación */}
          <div className="col-span-3">
            <div className="sticky top-24 space-y-6">
              
              {/* Seguint section */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="text-green-600" size={20} />
                    <h3 className="font-semibold text-gray-900">Seguint</h3>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex space-x-1 mb-4">
                    <button className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      ACTIUS
                    </button>
                    <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900">
                      RECENTS
                    </button>
                  </div>
                </div>
                
                <div className="p-3">
                  {/* Usuario Roberto */}
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      RJ
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Roberto Jiménez</div>
                      <div className="text-xs text-gray-500">@roberto_marketing</div>
                    </div>
                  </div>
                  
                  {/* Usuario Carmen */}
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      CR
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Carmen Ruiz</div>
                      <div className="text-xs text-gray-500">@carmen_designer</div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-3 pt-3 border-t border-gray-100">
                    <button className="text-xs text-gray-600 hover:underline">VEURE TOT</button>
                  </div>
                </div>
              </div>

              {/* Grups section */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="text-blue-600" size={20} />
                    <h3 className="font-semibold text-gray-900">Grups</h3>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex space-x-1 mb-4">
                    <button className="px-3 py-1 text-xs font-medium text-gray-600">
                      NOUS
                    </button>
                    <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      ACTIUS
                    </button>
                  </div>
                </div>
                
                <div className="p-3">
                  {/* Grupo Sevilla */}
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=32&h=32&fit=crop&crop=center" 
                        alt="Sevilla Gastronomi"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Sevilla Gastronomí...</div>
                      <div className="text-xs text-gray-500">1 membres</div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-3 pt-3 border-t border-gray-100">
                    <button className="text-xs text-gray-600 hover:underline">VEURE TOT</button>
                  </div>
                </div>
              </div>

              {/* Anuncis section */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs">📄</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">Anuncis</h3>
                  </div>
                </div>
              </div>

              {/* Secciones principales */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">EMPRESES I NEGOCIS</h3>
                </div>
                <div className="p-2">
                  <button className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg">
                    <Building className="text-blue-600" size={20} />
                    <span className="text-sm">Empreses i Col·laboracions</span>
                  </button>
                  <button className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg">
                    <Briefcase className="text-green-600" size={20} />
                    <span className="text-sm">Ofertes</span>
                  </button>
                  <button className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg">
                    <BookOpen className="text-purple-600" size={20} />
                    <span className="text-sm">Assessorament</span>
                  </button>
                  <button className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg">
                    <Users className="text-orange-600" size={20} />
                    <span className="text-sm">Enllaços d'Interès</span>
                  </button>
                </div>
              </div>

              {/* Acciones rápidas */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">ACCIONS RÀPIDES</h3>
                </div>
                <div className="p-2">
                  <button className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg">
                    <Search className="text-blue-600" size={20} />
                    <span className="text-sm">Cercar</span>
                  </button>
                  <button className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg">
                    <Bell className="text-yellow-600" size={20} />
                    <span className="text-sm">Notificacions</span>
                  </button>
                  <button className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg">
                    <Calendar className="text-red-600" size={20} />
                    <span className="text-sm">Calendari</span>
                  </button>
                </div>
              </div>

              {/* Configuración */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">CONFIGURACIÓ</h3>
                </div>
                <div className="p-2">
                  <button className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg">
                    <Settings className="text-gray-600" size={20} />
                    <span className="text-sm">Configuració</span>
                  </button>
                </div>
              </div>

              {/* Usuario */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    MA
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Manel Amador</div>
                    <div className="text-xs text-gray-500">plegats.cat@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA CENTRAL - Feed */}
          <div className="col-span-6">
            <div className="space-y-6">
              
              {/* Header de Activitat */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <h1 className="text-xl font-semibold text-gray-900 mb-4">Activitat</h1>
                  
                  {/* Filtros */}
                  <div className="flex space-x-1 mb-6">
                    <button 
                      onClick={() => setFiltroActivitat('todo')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        filtroActivitat === 'todo' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Mostrar todo
                    </button>
                    <span className="text-gray-400 self-center">-</span>
                    <button 
                      onClick={() => setFiltroActivitat('posts')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        filtroActivitat === 'posts' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      por nuevos posts
                    </button>
                  </div>

                  {/* Input para crear post */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      MA
                    </div>
                    <input
                      type="text"
                      placeholder="Què estàs pensant, Manel?"
                      className="flex-1 p-3 bg-gray-100 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Posts */}
              {postsEjemplo.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm border">
                  <div className="p-4">
                    {/* Header del post */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {post.autor.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{post.autor.nombre}</div>
                          <div className="text-sm text-gray-500">{post.autor.tiempo}</div>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <MoreHorizontal size={20} className="text-gray-400" />
                      </button>
                    </div>

                    {/* Contenido */}
                    <div className="mb-3">
                      <p className="text-gray-900">{post.contenido}</p>
                      {post.imagen && (
                        <div className="mt-3">
                          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">Imagen del post</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <Heart size={18} />
                        <span className="text-sm">Me gusta</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <MessageCircle size={18} />
                        <span className="text-sm">Comentar</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <Share2 size={18} />
                        <span className="text-sm">Compartir</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA - Widgets */}
          <div className="col-span-3">
            <div className="sticky top-24 space-y-6">
              
              {/* Completar perfil */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Completa el teu Perfil</h3>
                
                {/* Progreso circular */}
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-green-500"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="20, 100"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold text-green-600">20%</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <button className="text-sm font-medium text-blue-600 hover:underline">
                    Completar Perfil
                  </button>
                </div>

                {/* Lista de tareas */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-green-600">Informació general</span>
                    </div>
                    <span className="text-green-600 font-medium">5/6</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      <span className="text-gray-600">Experiència laboral</span>
                    </div>
                    <span className="text-gray-500 font-medium">0/3</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      <span className="text-gray-600">Foto de perfil</span>
                    </div>
                    <span className="text-gray-500 font-medium">0/1</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      <span className="text-gray-600">Foto de portada</span>
                    </div>
                    <span className="text-gray-500 font-medium">0/1</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      <span className="text-gray-600">Xarxes socials</span>
                    </div>
                    <span className="text-gray-500 font-medium">0/1</span>
                  </div>
                </div>
              </div>

              {/* Widget de Empresas */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Empreses</h3>
                  <button className="text-sm text-blue-600 hover:underline">Ver totes</button>
                </div>
                
                <div className="space-y-3">
                  {empresas.map((empresa) => (
                    <div key={empresa.nombre} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                        {empresa.id}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{empresa.nombre}</div>
                        <div className="text-xs text-gray-500">
                          {empresa.empleados} • {empresa.ubicacion}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RedSocial;