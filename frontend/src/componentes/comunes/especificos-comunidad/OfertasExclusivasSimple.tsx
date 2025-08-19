'use client'

import { useState } from 'react'
import { useGruposAvanzados } from '../../../contextos/GruposAvanzadosContext'
import { OfertaGrupo } from '../../../../tipos/gruposAvanzados'
import { 
  Gift, 
  Star,
  Clock,
  Users,
  Calendar,
  Percent,
  ExternalLink,
  Search,
  Tag,
  Bookmark,
  Share2
} from 'lucide-react'

// Mock data for now
const OFERTAS_MOCK: OfertaGrupo[] = [
  {
    id: 'oferta-1',
    grupoId: 'grupo-funcionaris-educacio',
    autorId: 'user-admin',
    titulo: '20% de descompte en llibres educatius',
    descripcion: 'Descompte especial per a tots els membres del grup en la compra de material educatiu',
    categoria: 'educacio',
    tipo: 'descuento',
    porcentajeDescuento: 20,
    fechaInicio: new Date('2025-01-01'),
    fechaFin: new Date('2025-03-31'),
    esIlimitada: false,
    cantidadUsada: 15,
    limiteCantidad: 100,
    rolesPermitidos: ['miembro', 'moderador', 'administrador', 'propietario'],
    enlaceExterno: 'https://libreria-educativa.com/oferta-grupo',
    instrucciones: 'Utilitza el codi GRUP20 al finalitzar la compra',
    fechaCreacion: new Date('2024-12-15'),
    estado: 'activa',
    destacada: true
  },
  {
    id: 'oferta-2',
    grupoId: 'grupo-funcionaris-educacio',
    autorId: 'user-admin',
    titulo: 'Curs gratuït de noves tecnologies',
    descripcion: 'Accés gratuït al curs online sobre implementació de noves tecnologies a l\'aula',
    categoria: 'formacio',
    tipo: 'servicio',
    fechaInicio: new Date('2025-02-01'),
    fechaFin: new Date('2025-02-28'),
    esIlimitada: false,
    cantidadUsada: 8,
    limiteCantidad: 50,
    rolesPermitidos: ['miembro', 'moderador', 'administrador', 'propietario'],
    enlaceExterno: 'https://formacio-tecnologia.cat/curs-gratis',
    instrucciones: 'Registra\'t amb el codi EDUTECH2025',
    fechaCreacion: new Date('2025-01-05'),
    estado: 'activa',
    destacada: false
  }
]

interface OfertasExclusivasSimpleProps {
  grupoId: string
}

export default function OfertasExclusivasSimple({ grupoId }: OfertasExclusivasSimpleProps) {
  const { grupoActivo } = useGruposAvanzados()
  
  const [busqueda, setBusqueda] = useState('')
  const [vistaActiva, setVistaActiva] = useState<'todas' | 'activas' | 'favoritas'>('todas')

  if (!grupoActivo) return null

  const ofertas = OFERTAS_MOCK.filter(o => o.grupoId === grupoId)
  
  // Filtrar ofertas
  const ofertasFiltradas = ofertas.filter(oferta => {
    if (busqueda && !oferta.titulo.toLowerCase().includes(busqueda.toLowerCase()) &&
        !oferta.descripcion.toLowerCase().includes(busqueda.toLowerCase())) {
      return false
    }
    
    switch (vistaActiva) {
      case 'activas':
        return oferta.estado === 'activa'
      case 'favoritas':
        return oferta.destacada
      default:
        return true
    }
  })

  const obtenerIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'descuento': return <Percent size={16} className="text-green-500" />
      case 'servicio': return <Star size={16} className="text-blue-500" />
      case 'evento': return <Calendar size={16} className="text-purple-500" />
      default: return <Gift size={16} className="text-orange-500" />
    }
  }

  const obtenerEstadoOferta = (oferta: OfertaGrupo) => {
    const ahora = new Date()
    
    if (ahora < oferta.fechaInicio) {
      return { text: 'Propera', color: 'blue' }
    } else if (oferta.fechaFin && ahora > oferta.fechaFin) {
      return { text: 'Expirada', color: 'gray' }
    } else if (oferta.limiteCantidad && oferta.cantidadUsada >= oferta.limiteCantidad) {
      return { text: 'Exhaurida', color: 'red' }
    } else {
      return { text: 'Activa', color: 'green' }
    }
  }

  const renderOferta = (oferta: OfertaGrupo) => {
    const estado = obtenerEstadoOferta(oferta)

    return (
      <div key={oferta.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all overflow-hidden">
        {/* Header con imagen/gradient */}
        <div className="relative h-32 bg-gradient-to-br from-orange-500 to-red-500">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center space-x-2">
            {obtenerIconoTipo(oferta.tipo)}
            <span className="bg-white bg-opacity-90 text-gray-900 text-xs px-2 py-1 rounded-full font-medium capitalize">
              {oferta.tipo}
            </span>
          </div>
          
          <div className="absolute top-3 right-3 flex items-center space-x-2">
            {oferta.destacada && (
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Destacada
              </span>
            )}
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              estado.color === 'green' ? 'bg-green-100 text-green-800' :
              estado.color === 'blue' ? 'bg-blue-100 text-blue-800' :
              estado.color === 'red' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {estado.text}
            </span>
          </div>
          
          {/* Valor del descuento */}
          {(oferta.porcentajeDescuento || oferta.valor) && (
            <div className="absolute bottom-3 left-3 bg-white bg-opacity-95 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-1">
                <span className="text-xl font-bold text-green-600">
                  {oferta.porcentajeDescuento ? `${oferta.porcentajeDescuento}%` : 
                   oferta.valor ? `${oferta.valor}€` : ''}
                </span>
                <span className="text-xs text-gray-600">desc.</span>
              </div>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 mb-1">{oferta.titulo}</h3>
            <p className="text-sm text-gray-600">{oferta.descripcion}</p>
          </div>

          {/* Información adicional */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>Fins {oferta.fechaFin ? oferta.fechaFin.toLocaleDateString() : 'sense límit'}</span>
            </div>
            
            {oferta.limiteCantidad && (
              <div className="flex items-center space-x-1">
                <Users size={14} />
                <span>{oferta.cantidadUsada}/{oferta.limiteCantidad}</span>
              </div>
            )}
          </div>

          {/* Instrucciones */}
          {oferta.instrucciones && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Com aplicar l'oferta:</p>
              <p className="text-sm text-gray-900">{oferta.instrucciones}</p>
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center space-x-2">
            {oferta.enlaceExterno ? (
              <a
                href={oferta.enlaceExterno}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                <span>Veure oferta</span>
                <ExternalLink size={14} />
              </a>
            ) : (
              <button className="flex-1 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
                Activar oferta
              </button>
            )}
            
            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Bookmark size={16} />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Gift size={24} className="text-orange-500" />
            <span>Ofertes Exclusives</span>
          </h2>
          <p className="text-gray-600 mt-1">
            Ofertes especials només per a membres de {grupoActivo.nombre}
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            label: 'Ofertes Actives', 
            valor: ofertas.filter(o => o.estado === 'activa').length, 
            icon: Star, 
            color: 'green' 
          },
          { 
            label: 'Total Canjeades', 
            valor: ofertas.reduce((sum, o) => sum + o.cantidadUsada, 0), 
            icon: Users, 
            color: 'blue' 
          },
          { 
            label: 'Destacades', 
            valor: ofertas.filter(o => o.destacada).length, 
            icon: Gift, 
            color: 'orange' 
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.valor}</p>
              </div>
              <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon size={20} className={`text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navegación */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: 'todas', label: `Totes (${ofertas.length})` },
            { key: 'activas', label: `Actives (${ofertas.filter(o => o.estado === 'activa').length})` },
            { key: 'favoritas', label: 'Destacades' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setVistaActiva(tab.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                vistaActiva === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cercar ofertes..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Grid de ofertas */}
      <div>
        {ofertasFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Gift size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {busqueda ? 'No s\'han trobat ofertes' : 'Encara no hi ha ofertes'}
            </h3>
            <p className="text-gray-600">
              {busqueda 
                ? 'Prova a canviar els criteris de cerca'
                : 'Els administradors del grup encara no han creat ofertes'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ofertasFiltradas.map(renderOferta)}
          </div>
        )}
      </div>
    </div>
  )
}