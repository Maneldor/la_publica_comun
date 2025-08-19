'use client'

import { useState, useEffect } from 'react'
import { useGruposAvanzados } from '../../../contextos/GruposAvanzadosContext'
import { GrupoAvanzado, RolGrupo, ConfiguracionGrupoAvanzada } from '../../../../tipos/gruposAvanzados'
import { 
  X, 
  Upload, 
  Globe, 
  Lock, 
  Eye, 
  Users, 
  Settings, 
  Crown, 
  Shield, 
  UserPlus, 
  Trash2,
  Plus,
  Save,
  AlertTriangle,
  Check,
  Image as ImageIcon,
  Palette,
  Bell,
  MessageSquare,
  FileText,
  Gift,
  Folder,
  Star
} from 'lucide-react'

interface ModalGrupoAvanzadoProps {
  isOpen: boolean
  onClose: () => void
  grupo?: GrupoAvanzado | null
  grupoPadreId?: string
}

export default function ModalGrupoAvanzado({ 
  isOpen, 
  onClose, 
  grupo, 
  grupoPadreId 
}: ModalGrupoAvanzadoProps) {
  const { crearGrupo, crearSubgrupo, editarGrupo, grupos } = useGruposAvanzados()
  
  const [step, setStep] = useState(1)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    // Información básica
    nombre: '',
    descripcion: '',
    descripcionLarga: '',
    categoria: 'profesional' as 'afinidad' | 'profesional' | 'geografico',
    subcategoria: '',
    etiquetas: [] as string[],
    avatar: '',
    portada: '',
    
    // Configuración de privacidad
    tipo: 'publico' as 'publico' | 'privado' | 'oculto',
    requiereAprobacion: false,
    soloInvitacion: false,
    permitirInvitaciones: true,
    
    // Configuración de contenido
    moderacionPosts: false,
    permitirMultimedia: true,
    permitirDocumentos: true,
    limiteTamañoArchivo: 10,
    formatosPermitidos: ['jpg', 'png', 'pdf', 'doc', 'docx'],
    
    // Configuración de comunicación
    chatHabilitado: true,
    mensajeriaPrivada: true,
    notificacionesGrupo: true,
    
    // Configuración de subgrupos
    permitirSubgrupos: true,
    nivelMaximoSubgrupos: 4,
    
    // Features especiales
    ofertasExclusivas: false,
    sistemaReputacion: false,
    gamificacion: false,
    
    // Personalización
    temaPersonalizado: '',
    coloresPersonalizados: {
      primario: '#2563eb',
      secundario: '#3b82f6',
      fondo: '#f8fafc'
    },
    
    // Reglas del grupo
    reglas: [{ titulo: '', descripcion: '' }]
  })
  
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('')
  const esEdicion = !!grupo
  const esSubgrupo = !!grupoPadreId

  // Cargar datos del grupo si es edición
  useEffect(() => {
    if (grupo && isOpen) {
      setFormData({
        nombre: grupo.nombre,
        descripcion: grupo.descripcion,
        descripcionLarga: grupo.descripcionLarga || '',
        categoria: grupo.categoria,
        subcategoria: grupo.subcategoria || '',
        etiquetas: grupo.etiquetas,
        avatar: grupo.avatar || '',
        portada: grupo.portada || '',
        tipo: grupo.tipo,
        requiereAprobacion: grupo.configuracion.requiereAprobacion,
        soloInvitacion: grupo.configuracion.soloInvitacion,
        permitirInvitaciones: grupo.configuracion.permitirInvitaciones,
        moderacionPosts: grupo.configuracion.moderacionPosts,
        permitirMultimedia: grupo.configuracion.permitirMultimedia,
        permitirDocumentos: grupo.configuracion.permitirDocumentos,
        limiteTamañoArchivo: grupo.configuracion.limiteTamañoArchivo,
        formatosPermitidos: grupo.configuracion.formatosPermitidos,
        chatHabilitado: grupo.configuracion.chatHabilitado,
        mensajeriaPrivada: grupo.configuracion.mensajeriaPrivada,
        notificacionesGrupo: grupo.configuracion.notificacionesGrupo,
        permitirSubgrupos: grupo.configuracion.permitirSubgrupos,
        nivelMaximoSubgrupos: grupo.configuracion.nivelMaximoSubgrupos,
        ofertasExclusivas: grupo.configuracion.ofertasExclusivas,
        sistemaReputacion: grupo.configuracion.sistemaReputacion,
        gamificacion: grupo.configuracion.gamificacion,
        temaPersonalizado: grupo.configuracion.temaPersonalizado || '',
        coloresPersonalizados: grupo.configuracion.coloresPersonalizados || {
          primario: '#2563eb',
          secundario: '#3b82f6',
          fondo: '#f8fafc'
        },
        reglas: grupo.reglas.length > 0 ? grupo.reglas.map(r => ({ titulo: r.titulo, descripcion: r.descripcion })) : [{ titulo: '', descripcion: '' }]
      })
    } else if (isOpen && !grupo) {
      // Reset form for new group
      setFormData({
        nombre: '',
        descripcion: '',
        descripcionLarga: '',
        categoria: 'profesional',
        subcategoria: '',
        etiquetas: [],
        avatar: '',
        portada: '',
        tipo: 'publico',
        requiereAprobacion: false,
        soloInvitacion: false,
        permitirInvitaciones: true,
        moderacionPosts: false,
        permitirMultimedia: true,
        permitirDocumentos: true,
        limiteTamañoArchivo: 10,
        formatosPermitidos: ['jpg', 'png', 'pdf', 'doc', 'docx'],
        chatHabilitado: true,
        mensajeriaPrivada: true,
        notificacionesGrupo: true,
        permitirSubgrupos: true,
        nivelMaximoSubgrupos: 4,
        ofertasExclusivas: false,
        sistemaReputacion: false,
        gamificacion: false,
        temaPersonalizado: '',
        coloresPersonalizados: {
          primario: '#2563eb',
          secundario: '#3b82f6',
          fondo: '#f8fafc'
        },
        reglas: [{ titulo: '', descripcion: '' }]
      })
    }
  }, [grupo, isOpen])

  const handleSubmit = async () => {
    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      setError('El nom i la descripció són obligatoris')
      return
    }

    setCargando(true)
    setError('')

    try {
      const configuracion: ConfiguracionGrupoAvanzada = {
        requiereAprobacion: formData.requiereAprobacion,
        permitirInvitaciones: formData.permitirInvitaciones,
        soloInvitacion: formData.soloInvitacion,
        moderacionPosts: formData.moderacionPosts,
        permitirMultimedia: formData.permitirMultimedia,
        permitirDocumentos: formData.permitirDocumentos,
        limiteTamañoArchivo: formData.limiteTamañoArchivo,
        formatosPermitidos: formData.formatosPermitidos,
        chatHabilitado: formData.chatHabilitado,
        mensajeriaPrivada: formData.mensajeriaPrivada,
        notificacionesGrupo: formData.notificacionesGrupo,
        permitirSubgrupos: formData.permitirSubgrupos,
        nivelMaximoSubgrupos: formData.nivelMaximoSubgrupos,
        ofertasExclusivas: formData.ofertasExclusivas,
        sistemaReputacion: formData.sistemaReputacion,
        gamificacion: formData.gamificacion,
        temaPersonalizado: formData.temaPersonalizado,
        coloresPersonalizados: formData.coloresPersonalizados
      }

      const datosGrupo = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        descripcionLarga: formData.descripcionLarga,
        categoria: formData.categoria,
        subcategoria: formData.subcategoria,
        tipo: formData.tipo,
        avatar: formData.avatar,
        portada: formData.portada,
        etiquetas: formData.etiquetas,
        configuracion,
        reglas: formData.reglas
          .filter(r => r.titulo.trim())
          .map((r, index) => ({
            id: `regla-${Date.now()}-${index}`,
            titulo: r.titulo,
            descripcion: r.descripcion,
            orden: index + 1,
            activa: true,
            fechaCreacion: new Date()
          }))
      }

      if (esEdicion && grupo) {
        await editarGrupo(grupo.id, datosGrupo)
      } else if (esSubgrupo && grupoPadreId) {
        await crearSubgrupo(grupoPadreId, datosGrupo)
      } else {
        await crearGrupo(datosGrupo)
      }

      onClose()
    } catch (err) {
      setError('Error al guardar el grup. Torna-ho a intentar.')
    } finally {
      setCargando(false)
    }
  }

  const afegirEtiqueta = () => {
    if (nuevaEtiqueta.trim() && !formData.etiquetas.includes(nuevaEtiqueta.trim())) {
      setFormData(prev => ({
        ...prev,
        etiquetas: [...prev.etiquetas, nuevaEtiqueta.trim()]
      }))
      setNuevaEtiqueta('')
    }
  }

  const eliminarEtiqueta = (index: number) => {
    setFormData(prev => ({
      ...prev,
      etiquetas: prev.etiquetas.filter((_, i) => i !== index)
    }))
  }

  const afegirRegla = () => {
    setFormData(prev => ({
      ...prev,
      reglas: [...prev.reglas, { titulo: '', descripcion: '' }]
    }))
  }

  const actualitzarRegla = (index: number, field: 'titulo' | 'descripcion', value: string) => {
    setFormData(prev => ({
      ...prev,
      reglas: prev.reglas.map((r, i) => i === index ? { ...r, [field]: value } : r)
    }))
  }

  const eliminarRegla = (index: number) => {
    if (formData.reglas.length > 1) {
      setFormData(prev => ({
        ...prev,
        reglas: prev.reglas.filter((_, i) => i !== index)
      }))
    }
  }

  if (!isOpen) return null

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informació bàsica del grup
        </h3>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom del grup *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nom del grup"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripció curta *
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripció breu del grup"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripció detallada
            </label>
            <textarea
              value={formData.descripcionLarga}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcionLarga: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripció completa del grup, objectius, normes..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="profesional">Professional</option>
                <option value="afinidad">Afinitat</option>
                <option value="geografico">Geogràfic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategoria
              </label>
              <input
                type="text"
                value={formData.subcategoria}
                onChange={(e) => setFormData(prev => ({ ...prev, subcategoria: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="p.ex. Educació, Salut..."
              />
            </div>
          </div>

          {/* Etiquetas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetes
            </label>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                value={nuevaEtiqueta}
                onChange={(e) => setNuevaEtiqueta(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), afegirEtiqueta())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Afegir etiqueta"
              />
              <button
                onClick={afegirEtiqueta}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.etiquetas.map((etiqueta, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {etiqueta}
                  <button
                    onClick={() => eliminarEtiqueta(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Privacitat i accessibilitat
        </h3>

        {/* Tipus de grup */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipus de grup
          </label>
          
          {[
            { 
              value: 'publico', 
              icon: Globe, 
              title: 'Públic', 
              description: 'Qualsevol pot veure el grup, els seus membres i les publicacions' 
            },
            { 
              value: 'privado', 
              icon: Lock, 
              title: 'Privat', 
              description: 'Només els membres poden veure les publicacions. Cal sol·licitar accés.' 
            },
            { 
              value: 'oculto', 
              icon: Eye, 
              title: 'Ocult', 
              description: 'Només els membres poden trobar i veure el grup' 
            }
          ].map((option) => (
            <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="tipo"
                value={option.value}
                checked={formData.tipo === option.value}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as any }))}
                className="mt-1"
              />
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <option.icon size={16} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{option.title}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Configuració d'accés */}
        <div className="mt-8 space-y-4">
          <h4 className="font-medium text-gray-900">Configuració d'accés</h4>
          
          {[
            {
              key: 'requiereAprobacion',
              label: 'Requereix aprovació',
              description: 'Els nous membres han de ser aprovats pels administradors'
            },
            {
              key: 'soloInvitacion',
              label: 'Només per invitació',
              description: 'Només es pot accedir al grup mitjançant invitació'
            },
            {
              key: 'permitirInvitaciones',
              label: 'Els membres poden convidar',
              description: 'Els membres poden invitar altres usuaris al grup'
            }
          ].map((option) => (
            <label key={option.key} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData[option.key as keyof typeof formData] as boolean}
                onChange={(e) => setFormData(prev => ({ ...prev, [option.key]: e.target.checked }))}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Funcionalitats del grup
        </h3>

        <div className="grid grid-cols-1 gap-6">
          {/* Moderació i contingut */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Moderació i contingut</h4>
            <div className="space-y-4">
              {[
                {
                  key: 'moderacionPosts',
                  label: 'Moderació de publicacions',
                  description: 'Les publicacions han de ser aprovades abans de ser visibles'
                },
                {
                  key: 'permitirMultimedia',
                  label: 'Permetre imatges i vídeos',
                  description: 'Els membres poden compartir fotos i vídeos'
                },
                {
                  key: 'permitirDocumentos',
                  label: 'Permetre documents',
                  description: 'Els membres poden compartir arxius i documents'
                }
              ].map((option) => (
                <label key={option.key} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[option.key as keyof typeof formData] as boolean}
                    onChange={(e) => setFormData(prev => ({ ...prev, [option.key]: e.target.checked }))}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Límit de tamany d'arxiu (MB)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.limiteTamañoArchivo}
                  onChange={(e) => setFormData(prev => ({ ...prev, limiteTamañoArchivo: parseInt(e.target.value) }))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Comunicació */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Comunicació</h4>
            <div className="space-y-4">
              {[
                {
                  key: 'chatHabilitado',
                  label: 'Chat del grup',
                  description: 'Habilita un xat en temps real per al grup'
                },
                {
                  key: 'mensajeriaPrivada',
                  label: 'Missatgeria privada entre membres',
                  description: 'Els membres poden enviar-se missatges privats entre ells'
                },
                {
                  key: 'notificacionesGrupo',
                  label: 'Notificacions del grup',
                  description: 'Envia notificacions sobre l\'activitat del grup'
                }
              ].map((option) => (
                <label key={option.key} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[option.key as keyof typeof formData] as boolean}
                    onChange={(e) => setFormData(prev => ({ ...prev, [option.key]: e.target.checked }))}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Features especials */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Funcions especials</h4>
            <div className="space-y-4">
              {[
                {
                  key: 'ofertasExclusivas',
                  label: 'Ofertes exclusives',
                  description: 'Permet crear ofertes i descomptes exclusius per als membres'
                },
                {
                  key: 'permitirSubgrupos',
                  label: 'Permetre subgrups',
                  description: 'Els administradors poden crear subgrups dins d\'aquest grup'
                },
                {
                  key: 'sistemaReputacion',
                  label: 'Sistema de reputació',
                  description: 'Sistema de punts i badges per l\'activitat dels membres'
                },
                {
                  key: 'gamificacion',
                  label: 'Gamificació',
                  description: 'Elements de joc com nivells, reptes i recompenses'
                }
              ].map((option) => (
                <label key={option.key} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[option.key as keyof typeof formData] as boolean}
                    onChange={(e) => setFormData(prev => ({ ...prev, [option.key]: e.target.checked }))}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Regles del grup
        </h3>

        <div className="space-y-4">
          {formData.reglas.map((regla, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900">Regla {index + 1}</h4>
                {formData.reglas.length > 1 && (
                  <button
                    onClick={() => eliminarRegla(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Títol de la regla
                  </label>
                  <input
                    type="text"
                    value={regla.titulo}
                    onChange={(e) => actualitzarRegla(index, 'titulo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="p.ex. Respecte mutu"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripció
                  </label>
                  <textarea
                    value={regla.descripcion}
                    onChange={(e) => actualitzarRegla(index, 'descripcion', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripció detallada de la regla..."
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={afegirRegla}
            className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
          >
            <Plus size={16} />
            <span>Afegir regla</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {esEdicion ? 'Editar grup' : esSubgrupo ? 'Crear subgrup' : 'Crear nou grup'}
            </h2>
            <p className="text-sm text-gray-600">
              {esSubgrupo && `Subgrup de: ${grupos.find(g => g.id === grupoPadreId)?.nombre}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress steps */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'Informació', icon: FileText },
              { step: 2, label: 'Privacitat', icon: Lock },
              { step: 3, label: 'Funcions', icon: Settings },
              { step: 4, label: 'Regles', icon: Shield }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step >= item.step 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {step > item.step ? <Check size={16} /> : <item.icon size={16} />}
                </div>
                <span className={`ml-2 text-sm ${
                  step >= item.step ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
                {index < 3 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    step > item.step ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel·lar
            </button>
            
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Següent
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={cargando || !formData.nombre.trim() || !formData.descripcion.trim()}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {cargando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Guardant...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{esEdicion ? 'Actualitzar' : 'Crear'} grup</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}