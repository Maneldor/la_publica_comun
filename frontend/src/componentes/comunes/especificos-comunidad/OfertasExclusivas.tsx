'use client'

import { useState } from 'react'
import { useGruposAvanzados } from '../../../contextos/GruposAvanzadosContext'
import { OfertaGrupo } from '../../../../tipos/gruposAvanzados'

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
import { 
  Gift, 
  Plus, 
  Star,
  Clock,
  MapPin,
  ExternalLink,
  Eye,
  Users,
  Calendar,
  Percent,
  Euro,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Share2,
  Bookmark,
  Tag,
  Image as ImageIcon,
  X,
  Save,
  AlertTriangle
} from 'lucide-react'

interface OfertasExclusivasProps {
  grupoId: string
}

export default function OfertasExclusivas({ grupoId }: OfertasExclusivasProps) {
  const { grupoActivo, esAdminGrupo } = useGruposAvanzados()
  
  // Use mock data for now
  const ofertas = OFERTAS_MOCK
  
  const [vistaActiva, setVistaActiva] = useState<'todas' | 'activas' | 'favoritas' | 'mis-ofertas'>('todas')
  const [modalOferta, setModalOferta] = useState<{
    abierto: boolean
    oferta?: OfertaGrupo | null
  }>({ abierto: false, oferta: null })
  const [busqueda, setBusqueda] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  
  // Form data para crear/editar ofertas
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    tipo: 'descuento' as OfertaGrupo['tipo'],
    valor: 0,
    porcentajeDescuento: 0,
    tipoDescuento: 'porcentaje' as 'porcentaje' | 'cantidad',
    fechaInicio: '',
    fechaFin: '',
    esIlimitada: true,
    limiteCantidad: 0,
    enlaceExterno: '',
    instrucciones: '',
    imagen: '',
    destacada: false
  })
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  if (!grupoActivo) return null

  const esAdmin = esAdminGrupo(grupoId)
  const ofertasGrupo = ofertas.filter(o => o.grupoId === grupoId)

  // Filtrar ofertas
  const ofertasFiltradas = ofertasGrupo.filter(oferta => {
    // Filtro por búsqueda
    if (busqueda && !oferta.titulo.toLowerCase().includes(busqueda.toLowerCase()) &&
        !oferta.descripcion.toLowerCase().includes(busqueda.toLowerCase()) &&
        !oferta.empresa.toLowerCase().includes(busqueda.toLowerCase())) {
      return false
    }
    
    // Filtro por categoría
    if (filtroCategoria && oferta.categoria !== filtroCategoria) return false
    
    // Filtro por vista activa
    switch (vistaActiva) {
      case 'activas':
        return oferta.estado === 'activa' && 
               new Date() >= oferta.fechaInicio && 
               new Date() <= oferta.fechaFin
      case 'favoritas':
        return oferta.favoritos?.includes('user-1') || false
      case 'mis-ofertas':
        return oferta.creadaPor === 'user-1'
      default:
        return true
    }
  })

  const handleCrearOferta = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      categoria: 'descuento',
      empresa: '',
      valorDescuento: 0,
      tipoDescuento: 'porcentaje',
      codigoPromocional: '',
      fechaInicio: '',
      fechaFin: '',
      limiteCanje: 0,
      ubicacion: '',
      enlaceExterno: '',
      imagen: '',
      condiciones: '',
      destacada: false,
      requiereAprobacion: false
    })
    setModalOferta({ abierto: true, oferta: null })
  }

  const handleEditarOferta = (oferta: OfertaGrupo) => {
    setFormData({
      titulo: oferta.titulo,
      descripcion: oferta.descripcion,
      categoria: oferta.categoria,
      empresa: oferta.empresa,
      valorDescuento: oferta.valorDescuento || 0,
      tipoDescuento: oferta.tipoDescuento || 'porcentaje',
      codigoPromocional: oferta.codigoPromocional || '',
      fechaInicio: oferta.fechaInicio.toISOString().split('T')[0],
      fechaFin: oferta.fechaFin.toISOString().split('T')[0],
      limiteCanje: oferta.limiteCanje || 0,
      ubicacion: oferta.ubicacion || '',
      enlaceExterno: oferta.enlaceExterno || '',
      imagen: oferta.imagen || '',
      condiciones: oferta.condiciones || '',
      destacada: oferta.destacada || false,
      requiereAprobacion: oferta.requiereAprobacion || false
    })
    setModalOferta({ abierto: true, oferta })
  }

  const handleGuardarOferta = async () => {
    if (!formData.titulo.trim() || !formData.descripcion.trim() || !formData.empresa.trim()) {
      setError('El títol, descripció i empresa són obligatoris')
      return
    }

    if (!formData.fechaInicio || !formData.fechaFin) {
      setError('Les dates d\'inici i fi són obligatòries')
      return
    }

    if (new Date(formData.fechaFin) <= new Date(formData.fechaInicio)) {
      setError('La data de fi ha de ser posterior a la d\'inici')
      return
    }

    setCargando(true)
    setError('')

    try {
      const datosOferta = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        empresa: formData.empresa,
        valorDescuento: formData.valorDescuento,
        tipoDescuento: formData.tipoDescuento,
        codigoPromocional: formData.codigoPromocional,
        fechaInicio: new Date(formData.fechaInicio),
        fechaFin: new Date(formData.fechaFin),
        limiteCanje: formData.limiteCanje,
        ubicacion: formData.ubicacion,
        enlaceExterno: formData.enlaceExterno,
        imagen: formData.imagen,
        condiciones: formData.condiciones,
        destacada: formData.destacada,
        requiereAprobacion: formData.requiereAprobacion
      }

      if (modalOferta.oferta) {
        await editarOferta(modalOferta.oferta.id, datosOferta)
      } else {
        await crearOferta(grupoId, datosOferta)
      }

      setModalOferta({ abierto: false, oferta: null })
    } catch (err) {
      setError('Error al guardar l\'oferta. Torna-ho a intentar.')
    } finally {
      setCargando(false)
    }
  }

  const obtenerIconoCategoria = (categoria: string) => {
    switch (categoria) {
      case 'descuento': return <Percent size={16} className="text-green-500" />
      case 'gratuita': return <Gift size={16} className="text-blue-500" />
      case 'evento': return <Calendar size={16} className="text-purple-500" />
      case 'servicio': return <Star size={16} className="text-yellow-500" />
      default: return <Tag size={16} className="text-gray-500" />
    }
  }

  const obtenerEstadoOferta = (oferta: OfertaGrupo) => {
    const ahora = new Date()
    
    if (ahora < oferta.fechaInicio) {
      return { text: 'Propera', color: 'blue', icon: Clock }
    } else if (oferta.fechaFin && ahora > oferta.fechaFin) {
      return { text: 'Expirada', color: 'gray', icon: Clock }
    } else if (oferta.limiteCantidad && oferta.cantidadUsada >= oferta.limiteCantidad) {
      return { text: 'Exhaurida', color: 'red', icon: Users }
    } else {
      return { text: 'Activa', color: 'green', icon: Star }
    }
  }

  const renderTarjetaOferta = (oferta: OfertaGrupo) => {
    const estado = obtenerEstadoOferta(oferta)
    const puedeEditar = esAdmin || oferta.autorId === 'user-1'

    return (
      <div key={oferta.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all overflow-hidden">
        {/* Imagen de la oferta */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
          {oferta.imagen ? (
            <img 
              src={oferta.imagen} 
              alt={oferta.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gift size={64} className="text-white opacity-50" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center space-x-2">
            {obtenerIconoCategoria(oferta.categoria)}
            <span className="bg-white bg-opacity-90 text-gray-900 text-xs px-2 py-1 rounded-full font-medium capitalize">
              {oferta.categoria}
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
                <span className="text-2xl font-bold text-green-600">
                  {oferta.porcentajeDescuento ? `${oferta.porcentajeDescuento}%` : oferta.valor ? `${oferta.valor}€` : ''}
                </span>
                <span className="text-sm text-gray-600">desc.</span>
              </div>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1 truncate">{oferta.titulo}</h3>
              <p className="text-sm text-blue-600 font-medium mb-2">{oferta.empresa}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{oferta.descripcion}</p>
            </div>
            
            {puedeEditar && (
              <div className="relative ml-2">
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <MoreVertical size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Información adicional */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>Fins {oferta.fechaFin ? oferta.fechaFin.toLocaleDateString() : 'Sense límit'}</span>
              </div>
              
              {oferta.limiteCantidad && (
                <div className="flex items-center space-x-1">
                  <Users size={14} />
                  <span>{oferta.cantidadUsada}/{oferta.limiteCantidad}</span>
                </div>
              )}
            </div>
          </div>

          {/* Instrucciones */}
          {oferta.instrucciones && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Instruccions</p>
                  <p className="text-sm text-gray-900">{oferta.instrucciones}</p>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:underline">
                  Copiar
                </button>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center space-x-2">
            {oferta.enlaceExterno ? (
              <a
                href={oferta.enlaceExterno}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span>Veure oferta</span>
                <ExternalLink size={14} />
              </a>
            ) : (
              <button className="flex-1 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                Canjear oferta
              </button>
            )}
            
            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Bookmark size={16} />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
              <Share2 size={16} />
            </button>
            
            {puedeEditar && (
              <button 
                onClick={() => handleEditarOferta(oferta)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit size={16} />
              </button>
            )}
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

        {esAdmin && (
          <button
            onClick={handleCrearOferta}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} />
            <span>Nova Oferta</span>
          </button>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Ofertes', valor: ofertasGrupo.length, icon: Gift, color: 'orange' },
          { 
            label: 'Actives', 
            valor: ofertasGrupo.filter(o => o.estado === 'activa').length, 
            icon: Star, 
            color: 'green' 
          },
          { 
            label: 'Canjeades', 
            valor: ofertasGrupo.reduce((sum, o) => sum + o.vecesCanjeada, 0), 
            icon: Users, 
            color: 'blue' 
          },
          { 
            label: 'Destacades', 
            valor: ofertasGrupo.filter(o => o.destacada).length, 
            icon: Star, 
            color: 'yellow' 
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

      {/* Navegación y filtros */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: 'todas', label: `Totes (${ofertasGrupo.length})` },
            { key: 'activas', label: `Actives (${ofertasGrupo.filter(o => o.estado === 'activa').length})` },
            { key: 'favoritas', label: 'Favorites' },
            { key: 'mis-ofertas', label: 'Les meves' }
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

        <div className="flex items-center space-x-4">
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

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Totes les categories</option>
            <option value="descuento">Descomptes</option>
            <option value="gratuita">Gratuïtes</option>
            <option value="evento">Esdeveniments</option>
            <option value="servicio">Serveis</option>
          </select>
        </div>
      </div>

      {/* Grid de ofertas */}
      <div>
        {ofertasFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Gift size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {busqueda || filtroCategoria ? 'No s\'han trobat ofertes' : 'Encara no hi ha ofertes'}
            </h3>
            <p className="text-gray-600 mb-6">
              {busqueda || filtroCategoria 
                ? 'Prova a canviar els filtres de cerca'
                : esAdmin 
                  ? 'Crea la primera oferta exclusiva per als membres del grup'
                  : 'Els administradors del grup encara no han creat ofertes'
              }
            </p>
            {esAdmin && !(busqueda || filtroCategoria) && (
              <button
                onClick={handleCrearOferta}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Crear Primera Oferta
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ofertasFiltradas.map(renderTarjetaOferta)}
          </div>
        )}
      </div>

      {/* Modal para crear/editar oferta */}
      {modalOferta.abierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalOferta.oferta ? 'Editar Oferta' : 'Nova Oferta'}
              </h3>
              <button
                onClick={() => setModalOferta({ abierto: false, oferta: null })}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Títol de l'oferta *
                    </label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="p.ex. 20% de descompte en menjar"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripció *
                    </label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Descriu els detalls de l'oferta..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Empresa *
                      </label>
                      <input
                        type="text"
                        value={formData.empresa}
                        onChange={(e) => setFormData(prev => ({ ...prev, empresa: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="Nom de l'empresa"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria
                      </label>
                      <select
                        value={formData.categoria}
                        onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="descuento">Descompte</option>
                        <option value="gratuita">Gratuïta</option>
                        <option value="evento">Esdeveniment</option>
                        <option value="servicio">Servei</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Descuento */}
                {formData.categoria === 'descuento' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valor del descompte
                      </label>
                      <input
                        type="number"
                        value={formData.valorDescuento}
                        onChange={(e) => setFormData(prev => ({ ...prev, valorDescuento: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipus de descompte
                      </label>
                      <select
                        value={formData.tipoDescuento}
                        onChange={(e) => setFormData(prev => ({ ...prev, tipoDescuento: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="porcentaje">Percentatge (%)</option>
                        <option value="cantidad">Quantitat fixa (€)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Fechas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data d'inici *
                    </label>
                    <input
                      type="date"
                      value={formData.fechaInicio}
                      onChange={(e) => setFormData(prev => ({ ...prev, fechaInicio: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de fi *
                    </label>
                    <input
                      type="date"
                      value={formData.fechaFin}
                      onChange={(e) => setFormData(prev => ({ ...prev, fechaFin: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Opciones adicionales */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Codi promocional
                    </label>
                    <input
                      type="text"
                      value={formData.codigoPromocional}
                      onChange={(e) => setFormData(prev => ({ ...prev, codigoPromocional: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="DESCOMPTE20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enllaç extern
                    </label>
                    <input
                      type="url"
                      value={formData.enlaceExterno}
                      onChange={(e) => setFormData(prev => ({ ...prev, enlaceExterno: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="https://empresa.com/oferta"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ubicació
                      </label>
                      <input
                        type="text"
                        value={formData.ubicacion}
                        onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="Barcelona, Madrid..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Límit de canvis
                      </label>
                      <input
                        type="number"
                        value={formData.limiteCanje}
                        onChange={(e) => setFormData(prev => ({ ...prev, limiteCanje: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="0 = il·limitat"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.destacada}
                        onChange={(e) => setFormData(prev => ({ ...prev, destacada: e.target.checked }))}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">Oferta destacada</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.requiereAprobacion}
                        onChange={(e) => setFormData(prev => ({ ...prev, requiereAprobacion: e.target.checked }))}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">Requereix aprovació</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end space-x-3">
              <button
                onClick={() => setModalOferta({ abierto: false, oferta: null })}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel·lar
              </button>
              
              <button
                onClick={handleGuardarOferta}
                disabled={cargando || !formData.titulo.trim() || !formData.descripcion.trim()}
                className="flex items-center space-x-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {cargando ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save size={16} />
                )}
                <span>{modalOferta.oferta ? 'Actualitzar' : 'Crear'} Oferta</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}