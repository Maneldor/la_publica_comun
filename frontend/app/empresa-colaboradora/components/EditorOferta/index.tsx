'use client'

import { useState, useMemo, useCallback } from 'react'
import { 
  ArrowLeft, Save, Send, Eye, X, Plus, Upload, Image as ImageIcon,
  FileText, Calendar, MapPin, Users, DollarSign, Tag, Clock,
  Globe, Shield, Info, AlertTriangle, CheckCircle, Target,
  ChevronRight, Settings, Sparkles, Zap, Package, Award,
  Link, MessageSquare, ThumbsUp, TrendingUp, BarChart3,
  Building2, Briefcase, GraduationCap, PartyPopper, HelpCircle,
  Bell, Star
} from 'lucide-react'
import { FormDataOferta, ValidacionFormulario, TipoOferta, TipoDescuento } from '../../../../tipos/empresa'

interface EditorOfertaProps {
  oferta?: Partial<FormDataOferta>
  onBack: () => void
  onSave: (oferta: FormDataOferta) => void
}

export default function EditorOferta({ oferta, onBack, onSave }: EditorOfertaProps) {
  const [activeTab, setActiveTab] = useState('basica')
  const [previewMode, setPreviewMode] = useState<'targeta' | 'pagina'>('targeta')
  const [showPreview, setShowPreview] = useState(false)
  const [showAudienciaHelp, setShowAudienciaHelp] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  
  // Estado del formulario
  const [formData, setFormData] = useState<FormDataOferta>({
    titulo: oferta?.titulo || '',
    tipo: (oferta?.tipo as TipoOferta) || 'servicio',
    descripcionBreve: oferta?.descripcionBreve || '',
    descripcionDetallada: oferta?.descripcionDetallada || '',
    imagenPrincipal: oferta?.imagenPrincipal || '',
    galeria: oferta?.galeria || [],
    
    // Detalles comerciales
    precio: oferta?.precio || '',
    moneda: oferta?.moneda || 'EUR',
    descuento: oferta?.descuento || '',
    tipoDescuento: (oferta?.tipoDescuento as TipoDescuento) || 'porcentaje',
    validezDesde: oferta?.validezDesde || '',
    validezHasta: oferta?.validezHasta || '',
    
    // Audiencia y ubicación
    audiencia: oferta?.audiencia || [],
    comunidades: oferta?.comunidades || [],
    provincias: oferta?.provincias || [],
    sectores: oferta?.sectores || [],
    
    // Términos y condiciones
    terminos: oferta?.terminos || '',
    requisitos: oferta?.requisitos || '',
    beneficios: oferta?.beneficios || [],
    
    // Configuración
    destacada: oferta?.destacada || false,
    permitirComentarios: oferta?.permitirComentarios || true,
    notificarCambios: oferta?.notificarCambios || true,
    etiquetas: oferta?.etiquetas || []
  })
  
  // Validación de campos
  const [errores, setErrores] = useState<ValidacionFormulario>({})
  
  // Cálculo dinámico de completitud por sección
  const completitudSecciones = useMemo(() => {
    const basica = formData.titulo && formData.descripcionBreve && formData.tipo ? 100 : 0
    const imagenes = formData.imagenPrincipal ? 100 : 0
    const comercial = formData.precio && formData.moneda ? 100 : 0
    const audiencia = formData.audiencia.length > 0 && formData.comunidades.length > 0 ? 100 : 0
    const terminos = formData.terminos && formData.requisitos ? 100 : 0
    const configuracion = 100 // Siempre completada por defecto
    
    return { basica, imagenes, comercial, audiencia, terminos, configuracion }
  }, [formData])
  
  const completitudTotal = useMemo(() => {
    const valores = Object.values(completitudSecciones)
    return Math.round(valores.reduce((a, b) => a + b, 0) / valores.length)
  }, [completitudSecciones])
  
  const tabs = [
    { id: 'basica', name: 'Informació Bàsica', icon: FileText, completado: completitudSecciones.basica === 100 },
    { id: 'imagenes', name: 'Imatges', icon: ImageIcon, completado: completitudSecciones.imagenes === 100 },
    { id: 'comercial', name: 'Detalls Comercials', icon: DollarSign, completado: completitudSecciones.comercial === 100 },
    { id: 'audiencia', name: 'Audiència i Ubicació', icon: Users, completado: completitudSecciones.audiencia === 100 },
    { id: 'terminos', name: 'Termes i Condicions', icon: Shield, completado: completitudSecciones.terminos === 100 },
    { id: 'configuracion', name: 'Configuració', icon: Settings, completado: completitudSecciones.configuracion === 100 }
  ]
  
  const tiposOferta = [
    { value: 'producto', label: 'Producte', icon: Package, color: 'purple' },
    { value: 'servicio', label: 'Servei', icon: Settings, color: 'blue' },
    { value: 'formacion', label: 'Formació', icon: GraduationCap, color: 'green' },
    { value: 'evento', label: 'Esdeveniment', icon: PartyPopper, color: 'orange' }
  ]
  
  const audienciaOptions = [
    { value: 'empleados-publicos', label: 'Empleats Públics', descripcion: 'Treballadors de l\'administració pública' },
    { value: 'administraciones', label: 'Administracions Públiques', descripcion: 'Entitats i organismes públics' },
    { value: 'empresas-colaboradoras', label: 'Empreses Col·laboradores', descripcion: 'Empreses proveïdores del sector públic' },
    { value: 'sindicatos', label: 'Sindicats', descripcion: 'Organitzacions sindicals' },
    { value: 'todos', label: 'Tots els usuaris', descripcion: 'Visible per a tothom' }
  ]
  
  const comunidadesOptions = [
    'Catalunya', 'Madrid', 'Andalusia', 'Valencia', 'Euskadi', 
    'Galicia', 'Castilla y León', 'Castilla-La Mancha', 'Murcia',
    'Aragón', 'Extremadura', 'Baleares', 'Asturias', 'Navarra',
    'Cantabria', 'La Rioja', 'Ceuta', 'Melilla'
  ]
  
  const sectoresOptions = [
    'Tecnologia', 'Salut', 'Educació', 'Construcció', 'Transport',
    'Energia', 'Turisme', 'Agricultura', 'Finances', 'Consultoría',
    'Manufactura', 'Telecomunicacions', 'Medioambient', 'Cultura'
  ]
  
  const monedaOptions = [
    { value: 'EUR', label: '€ Euro', symbol: '€' },
    { value: 'USD', label: '$ Dólar', symbol: '$' },
    { value: 'GBP', label: '£ Libra', symbol: '£' }
  ]
  
  const validarFormulario = useCallback(() => {
    const nuevosErrores: ValidacionFormulario = {}
    
    // Información básica
    if (!formData.titulo.trim()) nuevosErrores.titulo = 'El títol és obligatori'
    if (!formData.descripcionBreve.trim()) nuevosErrores.descripcionBreve = 'La descripció breu és obligatòria'
    
    // Audiencia
    if (formData.audiencia.length === 0) nuevosErrores.audiencia = 'Selecciona almenys una audiència'
    if (formData.comunidades.length === 0) nuevosErrores.comunidades = 'Selecciona almenys una comunitat'
    
    // Comercial
    if (formData.precio && isNaN(Number(formData.precio))) {
      nuevosErrores.precio = 'El preu ha de ser un número vàlid'
    }
    if (formData.descuento && isNaN(Number(formData.descuento))) {
      nuevosErrores.descuento = 'El descompte ha de ser un número vàlid'
    }
    
    // Fechas
    if (formData.validezDesde && formData.validezHasta) {
      if (new Date(formData.validezDesde) >= new Date(formData.validezHasta)) {
        nuevosErrores.validezHasta = 'La data final ha de ser posterior a la inicial'
      }
    }
    
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }, [formData])
  
  const handleImageUpload = useCallback((files: FileList | null) => {
    if (!files) return
    
    setUploadingImages(true)
    const newImages: string[] = []
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string)
            if (newImages.length === files.length) {
              setFormData((prev: FormDataOferta) => ({
                ...prev,
                galeria: [...prev.galeria, ...newImages],
                imagenPrincipal: prev.imagenPrincipal || newImages[0]
              }))
              setUploadingImages(false)
            }
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }, [])
  
  const handleRemoveImage = useCallback((index: number) => {
    setFormData((prev: FormDataOferta) => {
      const newGaleria = prev.galeria.filter((_: string, i: number) => i !== index)
      return {
        ...prev,
        galeria: newGaleria,
        imagenPrincipal: prev.imagenPrincipal === prev.galeria[index] 
          ? (newGaleria[0] || '') 
          : prev.imagenPrincipal
      }
    })
  }, [])
  
  const handleSetMainImage = useCallback((imageUrl: string) => {
    setFormData((prev: FormDataOferta) => ({ ...prev, imagenPrincipal: imageUrl }))
  }, [])
  
  const toggleArrayItem = useCallback((array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter((i: string) => i !== item)
      : [...array, item]
  }, [])
  
  const addBeneficio = useCallback(() => {
    setFormData((prev: FormDataOferta) => ({ ...prev, beneficios: [...prev.beneficios, ''] }))
  }, [])
  
  const updateBeneficio = useCallback((index: number, value: string) => {
    setFormData((prev: FormDataOferta) => ({
      ...prev,
      beneficios: prev.beneficios.map((b: string, i: number) => i === index ? value : b)
    }))
  }, [])
  
  const removeBeneficio = useCallback((index: number) => {
    setFormData((prev: FormDataOferta) => ({
      ...prev,
      beneficios: prev.beneficios.filter((_: string, i: number) => i !== index)
    }))
  }, [])
  
  const addEtiqueta = useCallback((etiqueta: string) => {
    if (etiqueta.trim() && !formData.etiquetas.includes(etiqueta.trim())) {
      setFormData((prev: FormDataOferta) => ({ ...prev, etiquetas: [...prev.etiquetas, etiqueta.trim()] }))
    }
  }, [formData.etiquetas])
  
  const removeEtiqueta = useCallback((etiqueta: string) => {
    setFormData((prev: FormDataOferta) => ({
      ...prev,
      etiquetas: prev.etiquetas.filter((e: string) => e !== etiqueta)
    }))
  }, [])
  
  const handleGuardar = useCallback((_publicar = false) => {
    if (!validarFormulario()) {
      alert('Si us plau, completa tots els camps obligatoris')
      return
    }
    
    onSave(formData)
  }, [formData, validarFormulario, onSave])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                  <FileText className="w-4 h-4" />
                  <ChevronRight className="w-3 h-3" />
                  <span>Editor d'Oferta</span>
                </div>
                <h1 className="text-xl font-bold text-slate-800">
                  {oferta ? 'Editar Oferta' : 'Nova Oferta'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Barra de completitud */}
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Completitud:</span>
                <div className="w-32 bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      completitudTotal < 30 ? 'bg-red-500' :
                      completitudTotal < 60 ? 'bg-orange-500' :
                      completitudTotal < 90 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${completitudTotal}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-700">{completitudTotal}%</span>
              </div>
              
              {/* Toggle de preview */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    showPreview 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Eye className="w-4 h-4 inline-block mr-1" />
                  Preview
                </button>
              </div>
              
              {/* Acciones principales */}
              <button
                onClick={() => handleGuardar(false)}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Esborrany
              </button>
              
              <button
                onClick={() => handleGuardar(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Sol·licitar Revisió
                <Sparkles className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex">
        {/* Sidebar con tabs */}
        <aside className={`bg-white/60 backdrop-blur-md border-r border-slate-200/60 min-h-screen transition-all ${
          showPreview ? 'w-48' : 'w-64'
        }`}>
          <nav className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${showPreview ? 'hidden' : ''}`} />
                      <span className={`font-medium ${showPreview ? 'text-xs' : 'text-sm'}`}>
                        {showPreview ? tab.name.split(' ')[0] : tab.name}
                      </span>
                    </div>
                    {tab.completado && (
                      <CheckCircle className={`w-4 h-4 text-green-400 ${showPreview ? 'w-3 h-3' : ''}`} />
                    )}
                  </button>
                )
              })}
            </div>
            
            {/* Información de ayuda */}
            {!showPreview && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200/60">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <Info className="w-4 h-4" />
                  <span className="font-semibold text-sm">Consells</span>
                </div>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Completa tots els camps per millorar la visibilitat de la teva oferta. 
                  Les ofertes amb imatges tenen un 40% més de clicks.
                </p>
              </div>
            )}
          </nav>
        </aside>
        
        {/* Contenido principal */}
        <main className={`p-6 overflow-y-auto ${showPreview ? 'w-1/2' : 'flex-1'}`}>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-6">
            {/* Información Básica */}
            {activeTab === 'basica' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Informació Bàsica
                </h3>
                
                {/* Tipo de oferta */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-3">
                    Tipus d'oferta *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {tiposOferta.map((tipo) => {
                      const Icon = tipo.icon
                      return (
                        <button
                          key={tipo.value}
                          onClick={() => setFormData({...formData, tipo: tipo.value as TipoOferta})}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            formData.tipo === tipo.value
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${
                            formData.tipo === tipo.value ? 'text-indigo-600' : 'text-slate-400'
                          }`} />
                          <span className={`text-sm font-medium ${
                            formData.tipo === tipo.value ? 'text-indigo-700' : 'text-slate-600'
                          }`}>
                            {tipo.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                
                {/* Título */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Títol de l'oferta *
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    placeholder="Ex: Desenvolupador Senior React"
                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errores.titulo ? 'border-red-300' : 'border-slate-200'
                    }`}
                    maxLength={100}
                  />
                  <div className="flex justify-between mt-1">
                    {errores.titulo && (
                      <span className="text-xs text-red-600">{errores.titulo}</span>
                    )}
                    <span className="text-xs text-slate-500 ml-auto">
                      {formData.titulo.length}/100
                    </span>
                  </div>
                </div>
                
                {/* Descripción breve */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Descripció breu *
                  </label>
                  <textarea
                    value={formData.descripcionBreve}
                    onChange={(e) => setFormData({...formData, descripcionBreve: e.target.value})}
                    placeholder="Descripció concisa de l'oferta (màxim 200 caràcters)"
                    rows={3}
                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                      errores.descripcionBreve ? 'border-red-300' : 'border-slate-200'
                    }`}
                    maxLength={200}
                  />
                  <div className="flex justify-between mt-1">
                    {errores.descripcionBreve && (
                      <span className="text-xs text-red-600">{errores.descripcionBreve}</span>
                    )}
                    <span className="text-xs text-slate-500 ml-auto">
                      {formData.descripcionBreve.length}/200
                    </span>
                  </div>
                </div>
                
                {/* Descripción detallada */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Descripció detallada
                    <span className="text-xs text-slate-500 ml-2">(Opcional)</span>
                  </label>
                  <textarea
                    value={formData.descripcionDetallada}
                    onChange={(e) => setFormData({...formData, descripcionDetallada: e.target.value})}
                    placeholder="Descripció completa amb tots els detalls de l'oferta"
                    rows={6}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    maxLength={2000}
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-slate-500">
                      {formData.descripcionDetallada.length}/2000
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Sección de Imágenes */}
            {activeTab === 'imagenes' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-600" />
                  Gestió d'Imatges
                </h3>
                
                {/* Upload de imágenes */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-3">
                    Imatges de l'oferta
                  </label>
                  
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                      dragOver 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-slate-300 hover:border-indigo-400'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragOver(true)
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDragOver(false)
                      handleImageUpload(e.dataTransfer.files)
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <div>
                        <span className="text-slate-600 font-medium">Arrossega imatges aquí</span>
                        <span className="text-slate-500"> o fes clic per seleccionar</span>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG, GIF fins a 10MB cada una</p>
                    </div>
                    {uploadingImages && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="text-indigo-600 font-medium">Pujant imatges...</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Galería de imágenes */}
                {formData.galeria.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Imatges seleccionades</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.galeria.map((image: string, index: number) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 transition-all cursor-pointer hover:border-indigo-300"
                            onClick={() => handleSetMainImage(image)}
                          />
                          {formData.imagenPrincipal === image && (
                            <div className="absolute top-1 left-1 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                              Principal
                            </div>
                          )}
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Fes clic en una imatge per establir-la com a principal
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Sección Comercial */}
            {activeTab === 'comercial' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                  Detalls Comercials
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Precio */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
                      Preu
                    </label>
                    <div className="flex">
                      <select
                        value={formData.moneda}
                        onChange={(e) => setFormData({...formData, moneda: e.target.value as any})}
                        className="px-3 py-3 bg-white border border-slate-200 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        {monedaOptions.map((moneda) => (
                          <option key={moneda.value} value={moneda.value}>
                            {moneda.symbol}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={formData.precio}
                        onChange={(e) => setFormData({...formData, precio: e.target.value})}
                        placeholder="0.00"
                        className={`flex-1 px-4 py-3 bg-white border-t border-r border-b rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errores.precio ? 'border-red-300' : 'border-slate-200'
                        }`}
                        step="0.01"
                        min="0"
                      />
                    </div>
                    {errores.precio && (
                      <span className="text-xs text-red-600 mt-1">{errores.precio}</span>
                    )}
                  </div>
                  
                  {/* Descuento */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
                      Descompte
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        value={formData.descuento}
                        onChange={(e) => setFormData({...formData, descuento: e.target.value})}
                        placeholder="0"
                        className={`flex-1 px-4 py-3 bg-white border rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errores.descuento ? 'border-red-300' : 'border-slate-200'
                        }`}
                        min="0"
                      />
                      <select
                        value={formData.tipoDescuento}
                        onChange={(e) => setFormData({...formData, tipoDescuento: e.target.value as TipoDescuento})}
                        className="px-3 py-3 bg-white border-t border-r border-b border-slate-200 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="porcentaje">%</option>
                        <option value="cantidad">{monedaOptions.find(m => m.value === formData.moneda)?.symbol}</option>
                      </select>
                    </div>
                    {errores.descuento && (
                      <span className="text-xs text-red-600 mt-1">{errores.descuento}</span>
                    )}
                  </div>
                </div>
                
                {/* Validez */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
                      Vàlid des de
                    </label>
                    <input
                      type="date"
                      value={formData.validezDesde}
                      onChange={(e) => setFormData({...formData, validezDesde: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
                      Vàlid fins
                    </label>
                    <input
                      type="date"
                      value={formData.validezHasta}
                      onChange={(e) => setFormData({...formData, validezHasta: e.target.value})}
                      className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errores.validezHasta ? 'border-red-300' : 'border-slate-200'
                      }`}
                    />
                    {errores.validezHasta && (
                      <span className="text-xs text-red-600 mt-1">{errores.validezHasta}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Sección de Audiencia */}
            {activeTab === 'audiencia' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Audiència i Ubicació
                </h3>
                
                {/* Audiencia objetivo */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-3">
                    Audiència objectiu *
                    <button
                      onClick={() => setShowAudienciaHelp(!showAudienciaHelp)}
                      className="ml-2 p-1 text-slate-400 hover:text-slate-600"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </label>
                  
                  {showAudienciaHelp && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                      <p className="text-blue-700 mb-2">Selecciona qui pot veure aquesta oferta:</p>
                      <ul className="text-blue-600 space-y-1 list-disc pl-4">
                        <li><strong>Empleats Públics:</strong> Treballadors de l'administració</li>
                        <li><strong>Administracions:</strong> Entitats i organismes públics</li>
                        <li><strong>Empreses Col·laboradores:</strong> Proveïdors del sector públic</li>
                        <li><strong>Sindicats:</strong> Organitzacions sindicals</li>
                        <li><strong>Tots els usuaris:</strong> Visible per a tothom</li>
                      </ul>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {audienciaOptions.map((opcion) => (
                      <label key={opcion.value} className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.audiencia.includes(opcion.value)}
                          onChange={(e) => {
                            const newAudiencia = e.target.checked
                              ? [...formData.audiencia, opcion.value]
                              : formData.audiencia.filter((a: string) => a !== opcion.value)
                            setFormData({...formData, audiencia: newAudiencia})
                          }}
                          className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <div>
                          <div className="font-medium text-slate-700">{opcion.label}</div>
                          <div className="text-sm text-slate-500">{opcion.descripcion}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errores.audiencia && (
                    <span className="text-xs text-red-600 mt-2">{errores.audiencia}</span>
                  )}
                </div>
                
                {/* Comunidades */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-3">
                    Comunitats Autònomes *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-4">
                    {comunidadesOptions.map((comunidad) => (
                      <label key={comunidad} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={formData.comunidades.includes(comunidad)}
                          onChange={(e) => {
                            const newComunidades = e.target.checked
                              ? [...formData.comunidades, comunidad]
                              : formData.comunidades.filter((c: string) => c !== comunidad)
                            setFormData({...formData, comunidades: newComunidades})
                          }}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-700">{comunidad}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {formData.comunidades.length} comunitats seleccionades
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const todasSeleccionadas = formData.comunidades.length === comunidadesOptions.length
                        setFormData({
                          ...formData, 
                          comunidades: todasSeleccionadas ? [] : [...comunidadesOptions]
                        })
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {formData.comunidades.length === comunidadesOptions.length ? 'Deseleccionar tot' : 'Seleccionar tot'}
                    </button>
                  </div>
                  {errores.comunidades && (
                    <span className="text-xs text-red-600 mt-1">{errores.comunidades}</span>
                  )}
                </div>
                
                {/* Sectores */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-3">
                    Sectors d'interès
                    <span className="text-xs text-slate-500 ml-2">(Opcional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sectoresOptions.map((sector) => (
                      <button
                        key={sector}
                        type="button"
                        onClick={() => {
                          const newSectores = formData.sectores.includes(sector)
                            ? formData.sectores.filter((s: string) => s !== sector)
                            : [...formData.sectores, sector]
                          setFormData({...formData, sectores: newSectores})
                        }}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                          formData.sectores.includes(sector)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Selecciona els sectors més rellevants per a la teva oferta
                  </p>
                </div>
              </div>
            )}
            
            {/* Sección de Términos */}
            {activeTab === 'terminos' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  Termes i Condicions
                </h3>
                
                {/* Términos */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Termes i condicions
                  </label>
                  <textarea
                    value={formData.terminos}
                    onChange={(e) => setFormData({...formData, terminos: e.target.value})}
                    placeholder="Especifica els termes i condicions de l'oferta..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    maxLength={1000}
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-slate-500">
                      {formData.terminos.length}/1000
                    </span>
                  </div>
                </div>
                
                {/* Requisitos */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Requisits
                  </label>
                  <textarea
                    value={formData.requisitos}
                    onChange={(e) => setFormData({...formData, requisitos: e.target.value})}
                    placeholder="Defineix els requisits necessaris per accedir a l'oferta..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    maxLength={1000}
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-slate-500">
                      {formData.requisitos.length}/1000
                    </span>
                  </div>
                </div>
                
                {/* Beneficios */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-slate-700">
                      Beneficis de l'oferta
                    </label>
                    <button
                      type="button"
                      onClick={addBeneficio}
                      className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Afegir benefici
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.beneficios.map((beneficio, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-2">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={beneficio}
                          onChange={(e) => updateBeneficio(index, e.target.value)}
                          placeholder={`Benefici ${index + 1}`}
                          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          maxLength={200}
                        />
                        <button
                          type="button"
                          onClick={() => removeBeneficio(index)}
                          className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {formData.beneficios.length === 0 && (
                    <div className="text-center py-6 text-slate-500">
                      <Award className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm">Encara no has afegit cap benefici</p>
                      <p className="text-xs">Fes clic a "Afegir benefici" per començar</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Sección de Configuración */}
            {activeTab === 'configuracion' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  Configuració Avançada
                </h3>
                
                {/* Etiquetas */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-3">
                    Etiquetes
                  </label>
                  
                  {/* Input para agregar etiquetas */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Escriu una etiqueta i prem Enter"
                      className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const target = e.target as HTMLInputElement
                          addEtiqueta(target.value)
                          target.value = ''
                        }
                      }}
                      maxLength={30}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addEtiqueta(input.value)
                        input.value = ''
                      }}
                      className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Afegir
                    </button>
                  </div>
                  
                  {/* Lista de etiquetas */}
                  <div className="flex flex-wrap gap-2">
                    {formData.etiquetas.map((etiqueta, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {etiqueta}
                        <button
                          type="button"
                          onClick={() => removeEtiqueta(etiqueta)}
                          className="ml-1 text-indigo-600 hover:text-indigo-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  {formData.etiquetas.length === 0 && (
                    <p className="text-sm text-slate-500 italic">No hi ha etiquetes encara</p>
                  )}
                </div>
                
                {/* Configuraciones generales */}
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-700 border-b pb-2">Configuració General</h4>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={formData.destacada}
                        onChange={(e) => setFormData({...formData, destacada: e.target.checked})}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <Star className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className="font-medium text-slate-700">Oferta destacada</div>
                        <div className="text-sm text-slate-500">L'oferta apareixerà en posicions prioritàries</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={formData.permitirComentarios}
                        onChange={(e) => setFormData({...formData, permitirComentarios: e.target.checked})}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium text-slate-700">Permetre comentaris</div>
                        <div className="text-sm text-slate-500">Els usuaris podran deixar comentaris a l'oferta</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={formData.notificarCambios}
                        onChange={(e) => setFormData({...formData, notificarCambios: e.target.checked})}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <Bell className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-medium text-slate-700">Notificar canvis</div>
                        <div className="text-sm text-slate-500">Rebràs notificacions sobre l'estat de l'oferta</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        
        {/* Panel de Preview */}
        {showPreview && (
          <aside className="w-1/2 bg-slate-100 p-6 overflow-y-auto border-l border-slate-200">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Vista Previa</h3>
                <div className="flex bg-white rounded-lg p-1 shadow-sm">
                  <button
                    onClick={() => setPreviewMode('targeta')}
                    className={`px-3 py-1 text-xs rounded transition-all ${
                      previewMode === 'targeta' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Targeta
                  </button>
                  <button
                    onClick={() => setPreviewMode('pagina')}
                    className={`px-3 py-1 text-xs rounded transition-all ${
                      previewMode === 'pagina' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Pàgina
                  </button>
                </div>
              </div>
              
              {/* Vista de Tarjeta */}
              {previewMode === 'targeta' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Imagen principal */}
                  {formData.imagenPrincipal ? (
                    <img
                      src={formData.imagenPrincipal}
                      alt={formData.titulo || 'Oferta'}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-slate-200 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                  
                  <div className="p-4">
                    {/* Título */}
                    <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2">
                      {formData.titulo || 'Títol de l\'oferta'}
                    </h3>
                    
                    {/* Descripción breve */}
                    <p className="text-slate-600 text-sm mb-3 line-clamp-3">
                      {formData.descripcionBreve || 'Descripció breu de l\'oferta...'}
                    </p>
                    
                    {/* Precio */}
                    {formData.precio && (
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {monedaOptions.find(m => m.value === formData.moneda)?.symbol}{formData.precio}
                          {formData.descuento && (
                            <span className="text-sm text-red-500 ml-2">
                              (-{formData.descuento}{formData.tipoDescuento === 'porcentaje' ? '%' : monedaOptions.find(m => m.value === formData.moneda)?.symbol})
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    
                    {/* Etiquetas */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {formData.etiquetas.slice(0, 3).map((etiqueta, index) => (
                        <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                          {etiqueta}
                        </span>
                      ))}
                      {formData.etiquetas.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          +{formData.etiquetas.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {/* Audiencia y comunidades */}
                    <div className="text-xs text-slate-500 space-y-1">
                      {formData.audiencia.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{formData.audiencia.length} tipus d'audiència</span>
                        </div>
                      )}
                      {formData.comunidades.length > 0 && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{formData.comunidades.length} comunitats</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Vista de Página */}
              {previewMode === 'pagina' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                  {/* Header */}
                  <div className="border-b pb-4">
                    <div className="flex items-start gap-4">
                      {formData.imagenPrincipal ? (
                        <img
                          src={formData.imagenPrincipal}
                          alt={formData.titulo || 'Oferta'}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h1 className="font-bold text-xl text-slate-800 mb-2">
                          {formData.titulo || 'Títol de l\'oferta'}
                        </h1>
                        <p className="text-slate-600 text-sm">
                          {formData.descripcionBreve || 'Descripció breu de l\'oferta...'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Descripción detallada */}
                  {formData.descripcionDetallada && (
                    <div>
                      <h3 className="font-semibold text-slate-700 mb-2">Descripció Detallada</h3>
                      <p className="text-slate-600 text-sm whitespace-pre-line">
                        {formData.descripcionDetallada}
                      </p>
                    </div>
                  )}
                  
                  {/* Precio */}
                  {formData.precio && (
                    <div>
                      <h3 className="font-semibold text-slate-700 mb-2">Preu</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">
                          {monedaOptions.find(m => m.value === formData.moneda)?.symbol}{formData.precio}
                        </span>
                        {formData.descuento && (
                          <span className="text-red-500">
                            (Estalvi: {formData.descuento}{formData.tipoDescuento === 'porcentaje' ? '%' : monedaOptions.find(m => m.value === formData.moneda)?.symbol})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Beneficios */}
                  {formData.beneficios.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-700 mb-2">Beneficis</h3>
                      <ul className="space-y-1">
                        {formData.beneficios.map((beneficio, index) => (
                          beneficio && (
                            <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{beneficio}</span>
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Galería */}
                  {formData.galeria.length > 1 && (
                    <div>
                      <h3 className="font-semibold text-slate-700 mb-2">Galeria d'Imatges</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {formData.galeria.slice(1, 7).map((image: string, index: number) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Galeria ${index + 1}`}
                            className="w-full h-16 object-cover rounded border"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Estado de completitud */}
              <div className="mt-6 p-4 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Completitud</span>
                  <span className="text-sm font-bold text-slate-700">{completitudTotal}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      completitudTotal < 30 ? 'bg-red-500' :
                      completitudTotal < 60 ? 'bg-orange-500' :
                      completitudTotal < 90 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${completitudTotal}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  {completitudTotal < 100 ? 
                    'Completa tots els camps per millorar la visibilitat' :
                    'Oferta llesta per publicar!'
                  }
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}