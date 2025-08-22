'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  Mail, 
  Globe, 
  CheckCircle, 
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Phone,
  Gift,
  Percent,
  Heart,
  Share2,
  Award
} from 'lucide-react';
import LayoutGeneral from '../../../../src/componentes/comunes/LayoutGeneral';
import { useEmpresaDetail } from '../../../../src/hooks/useEmpresaDetail';
import { useTema, useIdioma } from '../../../../hooks/useComunidad';
import { TarjetaOferta, OfertaComercial } from '../../../../src/componentes/ofertes/TarjetaOferta';
import { TarjetaEmpresa, CompanyProfile } from '../../../../src/componentes/empresas/TarjetaEmpresa';

// Componente Skeleton para loading
function EmpresaDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock de ofertas de la empresa
const ofertasMock: OfertaComercial[] = [
  {
    id: '1',
    categoria: 'TECNOLOGIA' as any,
    imagen: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
    titulo: 'Pack Office 365 - 30% descuento',
    descripcion: 'Licencia anual de Microsoft Office 365 con todas las aplicaciones incluidas.',
    empresa: {
      id: '1',
      nombre: 'TechSolutions S.A.',
      logo: 'https://ui-avatars.com/api/?name=TechSolutions&background=3b82f6&color=fff',
      sector: 'Tecnología',
      verificada: true
    },
    tipoDescuento: 'PORCENTAJE',
    descuento: {
      valor: 30,
      valorOriginal: 120,
      valorFinal: 84,
      moneda: 'EUR'
    },
    modalidad: 'ONLINE',
    ubicaciones: ['Online'],
    codigoDescuento: 'TECH30PUB',
    enlaceExterno: 'https://techsolutions.com/office365',
    instrucciones: 'Aplica el código en el checkout',
    fechaPublicacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    fechaVencimiento: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    limitaciones: [],
    destacada: true,
    exclusiva: true,
    estado: 'ACTIVA',
    vistas: 450,
    canjes: 89,
    favoritos: 156,
    stockDisponible: 50
  },
  {
    id: '2',
    categoria: 'SERVICIOS_PROFESIONALES' as any,
    imagen: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=250&fit=crop',
    titulo: 'Consultoría IT - Primera sesión gratis',
    descripcion: 'Sesión de consultoría tecnológica de 2 horas sin coste para nuevos clientes.',
    empresa: {
      id: '1',
      nombre: 'TechSolutions S.A.',
      logo: 'https://ui-avatars.com/api/?name=TechSolutions&background=3b82f6&color=fff',
      sector: 'Tecnología',
      verificada: true
    },
    tipoDescuento: 'REGALO',
    descuento: {
      valor: 100,
      valorOriginal: 200,
      valorFinal: 0,
      moneda: 'EUR'
    },
    modalidad: 'AMBAS',
    ubicaciones: ['Barcelona', 'Madrid', 'Online'],
    instrucciones: 'Solicita tu cita gratuita mediante formulario',
    fechaPublicacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    fechaVencimiento: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    limitaciones: ['Solo nuevos clientes', 'Una sesión por empresa'],
    destacada: false,
    exclusiva: true,
    estado: 'ACTIVA',
    vistas: 234,
    canjes: 45,
    favoritos: 89
  }
];

// Mock de empresas similares
const empresasSimilaresMock: CompanyProfile[] = [
  {
    id: '2',
    name: 'Digital Innovators',
    logo: 'https://ui-avatars.com/api/?name=Digital+Innovators&background=8b5cf6&color=fff',
    imagen: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=200&fit=crop',
    sector: 'Tecnología',
    descripcionPublica: 'Soluciones digitales innovadoras para el sector público y privado.',
    ubicacionVisible: true,
    city: 'Madrid',
    province: 'Madrid',
    estadoPerfil: 'VERIFICADO',
    destacada: true,
    employeeCount: '50-100'
  },
  {
    id: '3',
    name: 'CloudTech Solutions',
    logo: 'https://ui-avatars.com/api/?name=CloudTech&background=10b981&color=fff',
    imagen: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop',
    sector: 'Cloud Computing',
    descripcionPublica: 'Especialistas en migración y gestión de infraestructuras cloud.',
    ubicacionVisible: true,
    city: 'Valencia',
    province: 'Valencia',
    estadoPerfil: 'VERIFICADO',
    destacada: false,
    employeeCount: '25-50'
  },
  {
    id: '4',
    name: 'Data Analytics Pro',
    logo: 'https://ui-avatars.com/api/?name=Data+Analytics&background=f59e0b&color=fff',
    imagen: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
    sector: 'Análisis de Datos',
    descripcionPublica: 'Transformamos datos en decisiones estratégicas para tu negocio.',
    ubicacionVisible: true,
    city: 'Barcelona',
    province: 'Barcelona',
    estadoPerfil: 'ACTIVO',
    destacada: false,
    employeeCount: '10-25'
  }
];

export default function EmpresaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tema = useTema();
  const { idioma } = useIdioma();
  
  const empresaId = params.id as string;
  const { empresa, loading, error, notFound, isFollowing, followEmpresa, unfollowEmpresa } = useEmpresaDetail(empresaId);
  
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'ofertas' | 'contacto'>('info');

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowEmpresa();
      } else {
        await followEmpresa();
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  // Parse redes sociales si vienen como string
  const redesSociales = empresa?.redesSociales ? 
    (typeof empresa.redesSociales === 'string' ? JSON.parse(empresa.redesSociales) : empresa.redesSociales)
    : null;

  // Parse tags
  const tags = empresa?.tags ? 
    (typeof empresa.tags === 'string' ? JSON.parse(empresa.tags) : empresa.tags)
    : [];

  return (
    <LayoutGeneral paginaActual="empresas">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-gray-500 hover:text-gray-700"
            >
              Dashboard
            </button>
            <span className="text-gray-500">›</span>
            <button 
              onClick={() => router.push('/dashboard/empresas')}
              className="text-gray-500 hover:text-gray-700"
            >
              {idioma === 'ca' ? 'Empreses Col·laboradores' : 'Empresas Colaboradoras'}
            </button>
            <span className="text-gray-500">›</span>
            <span style={{ color: tema.primario }} className="font-medium truncate max-w-xs">
              {empresa?.name || '...'}
            </span>
          </div>
        </nav>

        {/* Botón volver */}
        <button
          onClick={() => router.push('/dashboard/empresas')}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          {idioma === 'ca' ? 'Tornar al llistat' : 'Volver al listado'}
        </button>

        {/* Estados de la página */}
        {loading ? (
          <EmpresaDetailSkeleton />
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {idioma === 'ca' ? 'Error al carregar l\'empresa' : 'Error al cargar la empresa'}
            </h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : notFound ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Building2 className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {idioma === 'ca' ? 'Empresa no trobada' : 'Empresa no encontrada'}
            </h3>
            <p className="text-gray-600 mb-4">
              {idioma === 'ca' 
                ? 'No s\'ha pogut trobar l\'empresa sol·licitada'
                : 'No se pudo encontrar la empresa solicitada'
              }
            </p>
          </div>
        ) : empresa ? (
          <>
            {/* Hero Section con Banner */}
            <div 
              className="relative h-48 rounded-lg mb-6 bg-gradient-to-r overflow-hidden"
              style={{ 
                background: (empresa as any).banner 
                  ? `url(${(empresa as any).banner}) center/cover` 
                  : `linear-gradient(135deg, ${tema.primario}20, ${tema.secundario}10)`
              }}
            >
              {/* Overlay oscuro para mejorar legibilidad */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              
              {/* Logo y nombre */}
              <div className="absolute bottom-4 left-4 flex items-end space-x-4">
                {empresa.logo ? (
                  <img 
                    src={empresa.logo} 
                    alt={`Logo ${empresa.name}`}
                    className="w-20 h-20 rounded-lg border-4 border-white shadow-lg"
                  />
                ) : (
                  <div 
                    className="w-20 h-20 rounded-lg border-4 border-white shadow-lg flex items-center justify-center bg-white"
                  >
                    <Building2 size={32} style={{ color: tema.primario }} />
                  </div>
                )}
                
                <div className="text-white pb-2">
                  <h1 className="text-2xl font-bold drop-shadow-lg">{empresa.name}</h1>
                  <p className="text-lg drop-shadow">{empresa.sector}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-4 right-4 flex space-x-2">
                {empresa.estadoPerfil === 'VERIFICADO' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle size={14} className="mr-1" />
                    {idioma === 'ca' ? 'Verificada' : 'Verificada'}
                  </span>
                )}
                {empresa.destacada && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Star size={14} className="mr-1" />
                    {idioma === 'ca' ? 'Destacada' : 'Destacada'}
                  </span>
                )}
              </div>
            </div>

            {/* Contenido principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contenido izquierda (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Descripción */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    {idioma === 'ca' ? 'Sobre nosaltres' : 'Sobre nosotros'}
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 whitespace-pre-line">
                      {showFullDescription || !empresa.descripcionCompleta || empresa.descripcionCompleta.length <= 300
                        ? (empresa.descripcionCompleta || empresa.descripcionPublica)
                        : `${empresa.descripcionCompleta.substring(0, 300)}...`
                      }
                    </p>
                    
                    {empresa.descripcionCompleta && empresa.descripcionCompleta.length > 300 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="mt-2 inline-flex items-center text-sm font-medium"
                        style={{ color: tema.primario }}
                      >
                        {showFullDescription ? (
                          <>
                            {idioma === 'ca' ? 'Mostrar menys' : 'Mostrar menos'}
                            <ChevronUp size={16} className="ml-1" />
                          </>
                        ) : (
                          <>
                            {idioma === 'ca' ? 'Llegir més' : 'Leer más'}
                            <ChevronDown size={16} className="ml-1" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Sectores/Tags */}
                {tags.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      {idioma === 'ca' ? 'Sectors d\'activitat' : 'Sectores de actividad'}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag: string, index: number) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                          style={{ 
                            backgroundColor: `${tema.primario}15`,
                            color: tema.primario
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Información de contacto */}
                {(empresa.contactoPublico || empresa.websiteUrl || redesSociales) && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      {idioma === 'ca' ? 'Contacte' : 'Contacto'}
                    </h2>
                    <div className="space-y-3">
                      {empresa.contactoPublico && (
                        <div className="flex items-center">
                          <Mail size={18} className="mr-3 text-gray-400" />
                          <a 
                            href={`mailto:${empresa.contactoPublico}`}
                            className="text-blue-600 hover:underline"
                          >
                            {empresa.contactoPublico}
                          </a>
                        </div>
                      )}
                      
                      {empresa.websiteUrl && (
                        <div className="flex items-center">
                          <Globe size={18} className="mr-3 text-gray-400" />
                          <a 
                            href={empresa.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center"
                          >
                            {empresa.websiteUrl.replace(/^https?:\/\//, '')}
                            <ExternalLink size={14} className="ml-1" />
                          </a>
                        </div>
                      )}

                      {redesSociales && (
                        <div className="pt-2 border-t">
                          <p className="text-sm text-gray-600 mb-2">
                            {idioma === 'ca' ? 'Xarxes socials:' : 'Redes sociales:'}
                          </p>
                          <div className="flex space-x-3">
                            {redesSociales.linkedin && (
                              <a 
                                href={redesSociales.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-blue-600"
                              >
                                LinkedIn
                              </a>
                            )}
                            {redesSociales.twitter && (
                              <a 
                                href={redesSociales.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-blue-400"
                              >
                                Twitter
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Ubicación */}
                {empresa.ubicacionVisible && (empresa.city || empresa.province || empresa.address) && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      {idioma === 'ca' ? 'Ubicació' : 'Ubicación'}
                    </h2>
                    <div className="flex items-start">
                      <MapPin size={18} className="mr-3 text-gray-400 mt-0.5" />
                      <div>
                        {empresa.address && (
                          <p className="text-gray-600">{empresa.address}</p>
                        )}
                        <p className="text-gray-600">
                          {[empresa.city, empresa.province].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar derecha (1/3) */}
              <div className="space-y-4">
                {/* Acciones principales */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className="w-full mb-3 px-4 py-3 rounded-md font-medium transition-all"
                    style={{ 
                      backgroundColor: isFollowing ? '#f3f4f6' : tema.primario,
                      color: isFollowing ? tema.texto : 'white',
                      border: isFollowing ? '1px solid #e5e7eb' : 'none',
                      opacity: followLoading ? 0.5 : 1
                    }}
                  >
                    {followLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </span>
                    ) : (
                      isFollowing ? (idioma === 'ca' ? 'Seguint' : 'Siguiendo') : (idioma === 'ca' ? 'Seguir empresa' : 'Seguir empresa')
                    )}
                  </button>
                  
                  <button
                    className="w-full px-4 py-3 rounded-md font-medium border transition-colors"
                    style={{ 
                      borderColor: tema.primario,
                      color: tema.primario
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${tema.primario}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {idioma === 'ca' ? 'Contactar empresa' : 'Contactar empresa'}
                  </button>
                </div>

                {/* Información rápida */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold mb-4">
                    {idioma === 'ca' ? 'Informació ràpida' : 'Información rápida'}
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">{idioma === 'ca' ? 'Sector' : 'Sector'}</p>
                      <p className="font-medium">{empresa.sector}</p>
                    </div>
                    
                    {empresa.employeeCount && (
                      <div>
                        <p className="text-gray-500">{idioma === 'ca' ? 'Empleats' : 'Empleados'}</p>
                        <p className="font-medium">{empresa.employeeCount}</p>
                      </div>
                    )}
                    
                    {empresa.ubicacionVisible && (empresa.city || empresa.province) && (
                      <div>
                        <p className="text-gray-500">{idioma === 'ca' ? 'Ubicació' : 'Ubicación'}</p>
                        <p className="font-medium">
                          {[empresa.city, empresa.province].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    )}
                    
                    {empresa.fechaCreacionPerfil && (
                      <div>
                        <p className="text-gray-500">{idioma === 'ca' ? 'Membre des de' : 'Miembro desde'}</p>
                        <p className="font-medium">
                          {new Date(empresa.fechaCreacionPerfil).toLocaleDateString(
                            idioma === 'ca' ? 'ca-ES' : 'es-ES',
                            { year: 'numeric', month: 'long' }
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Estadísticas */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold mb-4">
                    {idioma === 'ca' ? 'Estadístiques' : 'Estadísticas'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Gift className="w-8 h-8" style={{ color: tema.primario }} />
                      </div>
                      <p className="text-2xl font-bold">{ofertasMock.length}</p>
                      <p className="text-xs text-gray-500">
                        {idioma === 'ca' ? 'Ofertes actives' : 'Ofertas activas'}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Heart className="w-8 h-8 text-red-500" />
                      </div>
                      <p className="text-2xl font-bold">1.2k</p>
                      <p className="text-xs text-gray-500">
                        {idioma === 'ca' ? 'Seguidors' : 'Seguidores'}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Star className="w-8 h-8 text-yellow-500" />
                      </div>
                      <p className="text-2xl font-bold">4.8</p>
                      <p className="text-xs text-gray-500">
                        {idioma === 'ca' ? 'Valoració' : 'Valoración'}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Award className="w-8 h-8 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold">250+</p>
                      <p className="text-xs text-gray-500">
                        {idioma === 'ca' ? 'Bescanvis' : 'Canjes'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sección de Ofertas de la Empresa */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {idioma === 'ca' ? 'Ofertes de ' : 'Ofertas de '}{empresa.name}
                </h2>
                <button 
                  className="text-sm font-medium"
                  style={{ color: tema.primario }}
                  onClick={() => router.push('/ofertes')}
                >
                  {idioma === 'ca' ? 'Veure totes' : 'Ver todas'} →
                </button>
              </div>
              
              {ofertasMock.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {ofertasMock.map((oferta) => (
                    <div key={oferta.id} className="w-full max-w-sm mx-auto">
                      <TarjetaOferta 
                        oferta={oferta}
                        onViewMore={(id) => router.push(`/ofertes/${id}`)}
                        onRedeem={(id) => console.log('Canjear:', id)}
                        onToggleFavorite={async (id) => console.log('Toggle favorito:', id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <Gift size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {idioma === 'ca' ? 'Encara no hi ha ofertes' : 'Aún no hay ofertas'}
                  </h3>
                  <p className="text-gray-600">
                    {idioma === 'ca' 
                      ? 'Aquesta empresa encara no ha publicat ofertes'
                      : 'Esta empresa aún no ha publicado ofertas'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Sección de Empresas Similares */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {idioma === 'ca' ? 'Empreses similars' : 'Empresas similares'}
                </h2>
                <button 
                  className="text-sm font-medium"
                  style={{ color: tema.primario }}
                  onClick={() => router.push('/dashboard/empresas')}
                >
                  {idioma === 'ca' ? 'Veure més' : 'Ver más'} →
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {empresasSimilaresMock.map((empresaSimilar) => (
                  <div key={empresaSimilar.id} className="w-full max-w-sm mx-auto">
                    <TarjetaEmpresa 
                      empresa={empresaSimilar}
                      onViewMore={(id) => router.push(`/dashboard/empresas/${id}`)}
                      onFollow={async (id) => console.log('Seguir empresa:', id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </LayoutGeneral>
  );
}