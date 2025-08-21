'use client'

import { useState } from 'react'
import { useGruposAvanzados } from '../../../contextos/GruposAvanzadosContext'
import { TarjetaOferta, type OfertaComercial } from '../../ofertes'
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
    rolesPermitidos: ['miembro', 'moderador', 'administrador'] as any,
    enlaceExterno: 'https://libreria-educativa.com/oferta-grupo',
    instrucciones: 'Utilitza el codi GRUP20 al finalitzar la compra',
    fechaCreacion: new Date('2024-12-15'),
    destacada: true,
    activa: true,
    visualizaciones: 245,
    interesados: [],
    reclamados: []
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
    rolesPermitidos: ['miembro', 'moderador', 'administrador'] as any,
    enlaceExterno: 'https://formacio-tecnologia.cat/curs-gratis',
    instrucciones: 'Registra\'t amb el codi EDUTECH2025',
    fechaCreacion: new Date('2025-01-05'),
    destacada: false,
    activa: true,
    visualizaciones: 189,
    interesados: [],
    reclamados: []
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

  // Función para convertir OfertaGrupo a OfertaComercial
  const convertirAOfertaComercial = (ofertaGrupo: OfertaGrupo): OfertaComercial => {
    const ahora = new Date()
    const expirada = ofertaGrupo.fechaFin && ahora > ofertaGrupo.fechaFin
    
    return {
      id: ofertaGrupo.id,
      titulo: ofertaGrupo.titulo,
      descripcion: ofertaGrupo.descripcion,
      categoria: 'EDUCACION_FORMACION' as any,
      empresa: {
        id: 'grupo-' + grupoId,
        nombre: grupoActivo?.nombre || 'Grup',
        logo: grupoActivo?.avatar,
        sector: 'Educació',
        verificada: true
      },
      tipoDescuento: 'PORCENTAJE',
      descuento: {
        valor: ofertaGrupo.porcentajeDescuento || 0,
        valorOriginal: ofertaGrupo.valor || 0,
        valorFinal: ofertaGrupo.valor ? ofertaGrupo.valor * 0.8 : 0,
        moneda: '€'
      },
      modalidad: 'ONLINE',
      ubicaciones: ['Online'],
      codigoDescuento: ofertaGrupo.instrucciones?.includes('codi') ? 
        ofertaGrupo.instrucciones.match(/codi\s+(\w+)/i)?.[1] : undefined,
      enlaceExterno: ofertaGrupo.enlaceExterno,
      instrucciones: ofertaGrupo.instrucciones,
      fechaPublicacion: ofertaGrupo.fechaCreacion,
      fechaVencimiento: ofertaGrupo.fechaFin,
      limitaciones: [],
      destacada: ofertaGrupo.destacada,
      exclusiva: true,
      estado: expirada ? 'CADUCADA' : (ofertaGrupo.activa ? 'ACTIVA' : 'PAUSADA'),
      vistas: ofertaGrupo.visualizaciones,
      canjes: ofertaGrupo.cantidadUsada,
      favoritos: 0,
      stockDisponible: ofertaGrupo.limiteCantidad ? ofertaGrupo.limiteCantidad - ofertaGrupo.cantidadUsada : undefined
    }
  }

  // Importar algunas ofertas de la página principal relevantes para el grupo
  const ofertasGenerales: OfertaComercial[] = [
    {
      id: '5',
      categoria: 'EDUCACION_FORMACION' as any,
      imagen: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
      titulo: 'Curs avançat d\'Excel - 50% descompte',
      descripcion: 'Millora les teves habilitats amb Excel avançat. Ideal per a gestió de dades administratives.',
      empresa: {
        id: '5',
        nombre: 'FormaPro Academy',
        logo: 'https://ui-avatars.com/api/?name=FormaPro&background=8b5cf6&color=fff',
        sector: 'Educación',
        verificada: true
      },
      tipoDescuento: 'PORCENTAJE',
      descuento: {
        valor: 50,
        valorOriginal: 180,
        valorFinal: 90,
        moneda: 'EUR'
      },
      modalidad: 'ONLINE',
      codigoDescuento: 'EXCEL50PUBL',
      enlaceExterno: 'https://formapro.es/empleados-publicos',
      instrucciones: 'Usa el codi EXCEL50PUBL a la web',
      fechaPublicacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      limitaciones: [],
      destacada: true,
      exclusiva: true,
      estado: 'ACTIVA',
      vistas: 156,
      canjes: 34,
      favoritos: 67,
      stockDisponible: 25
    },
    {
      id: '4',
      categoria: 'SALUD_BIENESTAR' as any,
      imagen: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=250&fit=crop',
      titulo: 'Revisió dental completa + neteja GRATIS',
      descripcion: 'Cuida la teva salut bucal amb la nostra revisió completa i neteja dental professional sense cost addicional.',
      empresa: {
        id: '4',
        nombre: 'Clinica Dental Sonrisa',
        logo: 'https://ui-avatars.com/api/?name=Dental+Sonrisa&background=10b981&color=fff',
        sector: 'Salud',
        verificada: false
      },
      tipoDescuento: 'REGALO',
      descuento: {
        valor: 100,
        valorOriginal: 85,
        valorFinal: 0,
        moneda: 'EUR'
      },
      modalidad: 'PRESENCIAL',
      ubicaciones: ['Barcelona', 'Sabadell'],
      instrucciones: 'Sol·licita cita telefònica mencionant l\'oferta per a empleats públics',
      fechaPublicacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      limitaciones: ['Una vegada per persona', 'Cita prèvia obligatòria'],
      destacada: false,
      exclusiva: true,
      estado: 'ACTIVA',
      vistas: 234,
      canjes: 67,
      favoritos: 134
    },
    {
      id: '3',
      categoria: 'TECNOLOGIA' as any,
      imagen: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=250&fit=crop',
      titulo: 'MacBook Air M2 - 15% descompte',
      descripcion: 'Potencia la teva productivitat amb l\'última generació de MacBook Air. Ideal per a treball i ús personal.',
      empresa: {
        id: '3',
        nombre: 'AppleStore Authorized',
        logo: 'https://ui-avatars.com/api/?name=Apple+Store&background=6b7280&color=fff',
        sector: 'Tecnología',
        verificada: true
      },
      tipoDescuento: 'PORCENTAJE',
      descuento: {
        valor: 15,
        valorOriginal: 1299,
        valorFinal: 1104,
        moneda: 'EUR'
      },
      modalidad: 'AMBAS',
      ubicaciones: ['Barcelona', 'Madrid', 'València'],
      codigoDescuento: 'PUBLI15MAC',
      instrucciones: 'Compra online amb codi o visita botiga física amb acreditació',
      fechaPublicacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      limitaciones: [],
      destacada: false,
      exclusiva: true,
      estado: 'ACTIVA',
      vistas: 89,
      canjes: 12,
      favoritos: 56,
      stockDisponible: 5
    }
  ]

  // Combinar ofertas del grupo con ofertas generales relevantes
  // Para demostración, mostrar algunas ofertas específicas del grupo y otras generales
  const ofertasDelGrupo = OFERTAS_MOCK.filter(o => o.grupoId === grupoId)
  const ofertasAdaptadas = ofertasDelGrupo.length > 0 
    ? ofertasDelGrupo 
    : OFERTAS_MOCK.slice(0, 1) // Si no hay ofertas específicas, mostrar al menos una como ejemplo
    
  const todasLasOfertas = [
    ...ofertasAdaptadas.map(convertirAOfertaComercial),
    ...ofertasGenerales
  ]
  
  // Filtrar ofertas y eliminar las expiradas automáticamente
  const ofertasFiltradas = todasLasOfertas
    .filter(oferta => {
      // Eliminar automáticamente ofertas expiradas
      if (oferta.fechaVencimiento && new Date() > new Date(oferta.fechaVencimiento)) {
        return false
      }
      
      if (busqueda && !oferta.titulo.toLowerCase().includes(busqueda.toLowerCase()) &&
          !oferta.descripcion.toLowerCase().includes(busqueda.toLowerCase())) {
        return false
      }
      
      switch (vistaActiva) {
        case 'activas':
          return oferta.estado === 'ACTIVA'
        case 'favoritas':
          return oferta.destacada
        default:
          return true
      }
    })

  // Handlers para las acciones de la tarjeta
  const handleViewMore = (ofertaId: string) => {
    const oferta = ofertasFiltradas.find(o => o.id === ofertaId)
    if (oferta?.enlaceExterno) {
      window.open(oferta.enlaceExterno, '_blank')
    }
  }

  const handleRedeem = (ofertaId: string) => {
    // Lógica para canjear la oferta
    console.log('Canjeando oferta:', ofertaId)
  }

  const handleToggleFavorite = async (ofertaId: string) => {
    // Lógica para toggle favorito
    console.log('Toggle favorito:', ofertaId)
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
            valor: ofertasFiltradas.filter(o => o.estado === 'ACTIVA').length, 
            icon: Star, 
            color: 'green' 
          },
          { 
            label: 'Total Canjeades', 
            valor: ofertasFiltradas.reduce((sum, o) => sum + o.canjes, 0), 
            icon: Users, 
            color: 'blue' 
          },
          { 
            label: 'Destacades', 
            valor: ofertasFiltradas.filter(o => o.destacada).length, 
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
            { key: 'todas', label: `Totes (${ofertasFiltradas.length})` },
            { key: 'activas', label: `Actives (${ofertasFiltradas.filter(o => o.estado === 'ACTIVA').length})` },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ofertasFiltradas.map((oferta) => (
              <div key={oferta.id} className="w-full max-w-sm mx-auto">
                <TarjetaOferta 
                  oferta={oferta}
                  onViewMore={handleViewMore}
                  onRedeem={handleRedeem}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}