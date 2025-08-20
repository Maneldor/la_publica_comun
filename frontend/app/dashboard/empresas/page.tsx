'use client';

import React, { useState, useEffect } from 'react';
import LayoutGeneral from '../../../src/componentes/comunes/LayoutGeneral';
import { 
  Building2,
  Search,
  MapPin,
  Users,
  Award,
  Filter,
  LayoutGrid,
  List,
  Eye,
  Heart,
  Phone,
  Mail,
  Globe,
  Star
} from 'lucide-react';

interface Empresa {
  id: string
  nombre: string
  descripcion: string
  sector: string
  ubicacion: string
  empleados: number
  fundada: number
  logo: string
  verificada: boolean
  destacada: boolean
  rating: number
  seguidores: number
  telefono?: string
  email?: string
  web?: string
}

// Datos mock de empresas
const empresasMock: Empresa[] = [
  {
    id: '1',
    nombre: 'TechSolutions S.A.',
    descripcion: 'Empresa líder en soluciones tecnológicas para el sector público, especializada en transformación digital y servicios cloud.',
    sector: 'Tecnologia',
    ubicacion: 'Barcelona',
    empleados: 150,
    fundada: 2010,
    logo: 'https://ui-avatars.com/api/?name=TechSolutions&background=3b82f6&color=fff',
    verificada: true,
    destacada: true,
    rating: 4.8,
    seguidores: 1250,
    telefono: '+34 93 123 4567',
    email: 'info@techsolutions.com',
    web: 'techsolutions.com'
  },
  {
    id: '2',
    nombre: 'Consultoria Innovació',
    descripcion: 'Consultoria estratégica especializada en innovación y modernización de procesos administrativos públicos.',
    sector: 'Consultoria',
    ubicacion: 'Madrid',
    empleados: 85,
    fundada: 2015,
    logo: 'https://ui-avatars.com/api/?name=Consultoria+Innovacio&background=10b981&color=fff',
    verificada: true,
    destacada: false,
    rating: 4.6,
    seguidores: 980,
    telefono: '+34 91 987 6543',
    email: 'contacto@consultoria-innovacio.es',
    web: 'consultoria-innovacio.es'
  },
  {
    id: '3',
    nombre: 'Servicios Municipales Plus',
    descripcion: 'Proveedor integral de servicios para administraciones locales: limpieza, mantenimiento y gestión de espacios públicos.',
    sector: 'Servicios',
    ubicacion: 'Valencia',
    empleados: 320,
    fundada: 2008,
    logo: 'https://ui-avatars.com/api/?name=Servicios+Municipales&background=f59e0b&color=fff',
    verificada: false,
    destacada: true,
    rating: 4.4,
    seguidores: 750,
    telefono: '+34 96 555 1234',
    email: 'info@serviciosmunicipales.com'
  },
  {
    id: '4',
    nombre: 'EduTech Innovation',
    descripcion: 'Plataforma educativa digital para formación continua de empleados públicos y ciudadanos.',
    sector: 'Educació',
    ubicacion: 'Sevilla',
    empleados: 45,
    fundada: 2018,
    logo: 'https://ui-avatars.com/api/?name=EduTech&background=8b5cf6&color=fff',
    verificada: true,
    destacada: false,
    rating: 4.7,
    seguidores: 620,
    email: 'hola@edutech.es',
    web: 'edutech-innovation.es'
  },
  {
    id: '5',
    nombre: 'Green Solutions',
    descripcion: 'Consultoria ambiental especializada en sostenibilidad y eficiencia energética para edificios públicos.',
    sector: 'Medi Ambient',
    ubicacion: 'Bilbao',
    empleados: 65,
    fundada: 2012,
    logo: 'https://ui-avatars.com/api/?name=Green+Solutions&background=22c55e&color=fff',
    verificada: true,
    destacada: true,
    rating: 4.5,
    seguidores: 890,
    telefono: '+34 94 321 9876',
    web: 'greensolutions.eus'
  },
  {
    id: '6',
    nombre: 'DataSecure Pro',
    descripcion: 'Especialistas en ciberseguridad y protección de datos para administraciones públicas.',
    sector: 'Seguretat',
    ubicacion: 'Barcelona',
    empleados: 95,
    fundada: 2016,
    logo: 'https://ui-avatars.com/api/?name=DataSecure&background=dc2626&color=fff',
    verificada: true,
    destacada: false,
    rating: 4.9,
    seguidores: 1100,
    email: 'security@datasecure.com',
    web: 'datasecure-pro.com'
  }
]

const sectores = ['Tecnologia', 'Consultoria', 'Servicios', 'Educació', 'Medi Ambient', 'Seguretat']
const ubicaciones = ['Barcelona', 'Madrid', 'Valencia', 'Sevilla', 'Bilbao', 'Zaragoza']

export default function EmpresasColaboradorasPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSector, setSelectedSector] = useState('all')
  const [selectedUbicacion, setSelectedUbicacion] = useState('all')
  const [soloVerificadas, setSoloVerificadas] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filteredEmpresas, setFilteredEmpresas] = useState(empresasMock)

  useEffect(() => {
    let filtered = empresasMock

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(empresa =>
        empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.sector.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por sector
    if (selectedSector !== 'all') {
      filtered = filtered.filter(empresa => empresa.sector === selectedSector)
    }

    // Filtrar por ubicación
    if (selectedUbicacion !== 'all') {
      filtered = filtered.filter(empresa => empresa.ubicacion === selectedUbicacion)
    }

    // Filtrar solo verificadas
    if (soloVerificadas) {
      filtered = filtered.filter(empresa => empresa.verificada)
    }

    setFilteredEmpresas(filtered)
  }, [searchTerm, selectedSector, selectedUbicacion, soloVerificadas])

  return (
    <LayoutGeneral paginaActual="dashboard">
      <div className="w-full">
        <div className="px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Empreses Col·laboradores</h1>
                <p className="text-gray-600">Descobreix empreses que col·laboren amb el sector públic</p>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{empresasMock.length}</p>
                    <p className="text-sm text-gray-500">Empreses</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {empresasMock.filter(e => e.verificada).length}
                    </p>
                    <p className="text-sm text-gray-500">Verificades</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {empresasMock.reduce((acc, empresa) => acc + empresa.seguidores, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Seguidors</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MapPin size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Set(empresasMock.map(e => e.ubicacion)).size}
                    </p>
                    <p className="text-sm text-gray-500">Ciutats</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cercar empreses..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                  >
                    <option value="all">Tots els sectors</option>
                    {sectores.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                  
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={selectedUbicacion}
                    onChange={(e) => setSelectedUbicacion(e.target.value)}
                  >
                    <option value="all">Totes les ubicacions</option>
                    {ubicaciones.map(ubicacion => (
                      <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
                    ))}
                  </select>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={soloVerificadas}
                      onChange={(e) => setSoloVerificadas(e.target.checked)}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm">Només verificades</span>
                  </label>

                  {/* Toggle vista */}
                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="Vista en graella"
                    >
                      <LayoutGrid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="Vista en llista"
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{filteredEmpresas.length} empreses trobades</span>
                {(searchTerm || selectedSector !== 'all' || selectedUbicacion !== 'all' || soloVerificadas) && (
                  <button 
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedSector('all')
                      setSelectedUbicacion('all')
                      setSoloVerificadas(false)
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Netejar filtres
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Lista de empresas */}
          {filteredEmpresas.length > 0 ? (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
                : 'space-y-4'
            }`}>
              {filteredEmpresas.map((empresa) => (
                <EmpresaCard key={empresa.id} empresa={empresa} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center">
              <Building2 size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No s'han trobat empreses
              </h3>
              <p className="text-gray-600">
                Prova ajustant els filtres de cerca
              </p>
            </div>
          )}
        </div>
      </div>
    </LayoutGeneral>
  );
}

// Componente EmpresaCard
interface EmpresaCardProps {
  empresa: Empresa
  viewMode: 'grid' | 'list'
}

function EmpresaCard({ empresa, viewMode }: EmpresaCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <img 
              src={empresa.logo}
              alt={empresa.nombre}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{empresa.nombre}</h3>
                {empresa.verificada && (
                  <Award size={16} className="text-green-500" title="Empresa verificada" />
                )}
                {empresa.destacada && (
                  <Star size={16} className="text-yellow-500" title="Empresa destacada" />
                )}
              </div>
              <p className="text-gray-600 mb-3 line-clamp-2">{empresa.descripcion}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">
                  {empresa.sector}
                </span>
                <span className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {empresa.ubicacion}
                </span>
                <span className="flex items-center">
                  <Users size={14} className="mr-1" />
                  {empresa.empleados} empleats
                </span>
                <div className="flex items-center">
                  <Star size={14} className="text-yellow-400 mr-1" />
                  <span>{empresa.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <img 
            src={empresa.logo}
            alt={empresa.nombre}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex gap-1">
            {empresa.verificada && (
              <Award size={16} className="text-green-500" title="Empresa verificada" />
            )}
            {empresa.destacada && (
              <Star size={16} className="text-yellow-500" title="Empresa destacada" />
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {empresa.nombre}
        </h3>
        
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">
          {empresa.descripcion}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs text-gray-500">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">
              {empresa.sector}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <MapPin size={12} className="mr-1" />
            <span>{empresa.ubicacion}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Users size={12} className="mr-1" />
              <span>{empresa.empleados} empleats</span>
            </div>
            <div className="flex items-center">
              <Star size={12} className="text-yellow-400 mr-1" />
              <span>{empresa.rating}</span>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-2">
            {empresa.telefono && (
              <Phone size={12} className="text-gray-400" title={empresa.telefono} />
            )}
            {empresa.email && (
              <Mail size={12} className="text-gray-400" title={empresa.email} />
            )}
            {empresa.web && (
              <Globe size={12} className="text-gray-400" title={empresa.web} />
            )}
          </div>
          <div className="flex items-center text-gray-500">
            <Heart size={12} className="mr-1" />
            <span>{empresa.seguidores}</span>
          </div>
        </div>
      </div>
    </div>
  )
}