'use client'

import { useState, useRef } from 'react'
import { 
  Building2, Camera, Upload, Eye, Send, 
  MapPin, Users, Calendar, Star, Award, 
  Globe, Mail, Phone, Check, X, LayoutGrid, 
  FileText, Briefcase, TrendingUp, Shield,
  ChevronRight, Edit2, Plus, AlertCircle,
  CheckCircle, Info, Loader2
} from 'lucide-react'

interface EmpresaData {
  nombre: string
  descripcion: string
  sector: string
  empleados: string
  ciudad: string
  provincia: string
  email: string
  telefono: string
  web: string
  logo: string
  portada: string
  añosFuncionamiento: number
  valoracion: number
  beneficiosOfrecidos: number
  verificada: boolean
  destacada: boolean
}

export default function PerfilEmpresa() {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [viewMode, setViewMode] = useState<'card' | 'single'>('single')
  const [profileStatus, setProfileStatus] = useState<'draft' | 'reviewing' | 'approved' | 'rejected'>('draft')
  const [completitud, setCompletitud] = useState(85)
  const [sending, setSending] = useState(false)
  const [showModal, setShowModal] = useState<'send' | 'discard' | null>(null)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const logoInputRef = useRef<HTMLInputElement>(null)
  const portadaInputRef = useRef<HTMLInputElement>(null)
  
  const [empresaData, setEmpresaData] = useState<EmpresaData>({
    nombre: 'TechSolutions Barcelona S.L.',
    descripcion: 'Empresa líder en desenvolupament de solucions tecnològiques innovadores per al sector públic i privat.',
    sector: 'Tecnologia',
    empleados: '1-10',
    ciudad: 'Barcelona',
    provincia: 'Catalunya',
    email: 'info@techsolutions.cat',
    telefono: '+34 933 456 789',
    web: 'https://techsolutions.cat',
    logo: 'https://ui-avatars.com/api/?name=Tech+Solutions&background=4f46e5&color=fff&size=200',
    portada: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop',
    añosFuncionamiento: 10,
    valoracion: 4.8,
    beneficiosOfrecidos: 6,
    verificada: true,
    destacada: true
  })

  const handleInputChange = (field: keyof EmpresaData, value: any) => {
    setEmpresaData(prev => ({ ...prev, [field]: value }))
    // Limpiar error al cambiar el campo
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
    // Actualizar completitud
    updateCompletitud()
  }
  
  const updateCompletitud = () => {
    const requiredFields = ['nombre', 'descripcion', 'sector', 'empleados', 'ciudad', 'provincia', 'email']
    const filled = requiredFields.filter(field => empresaData[field as keyof EmpresaData])
    const percentage = Math.round((filled.length / requiredFields.length) * 100)
    setCompletitud(percentage)
  }
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!empresaData.nombre) newErrors.nombre = 'El nom és obligatori'
    if (!empresaData.descripcion) newErrors.descripcion = 'La descripció és obligatòria'
    if (!empresaData.sector) newErrors.sector = 'El sector és obligatori'
    if (!empresaData.email) newErrors.email = 'L\'email és obligatori'
    if (empresaData.email && !empresaData.email.includes('@')) {
      newErrors.email = 'Email invàlid'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleImageUpload = (type: 'logo' | 'portada') => {
    const input = type === 'logo' ? logoInputRef : portadaInputRef
    input.current?.click()
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'portada') => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleInputChange(type, reader.result as string)
        showNotification('success', `${type === 'logo' ? 'Logo' : 'Portada'} actualitzat correctament`)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }
  
  
  const handleSendToReview = async () => {
    if (!validateForm()) {
      showNotification('error', 'Si us plau, completa tots els camps obligatoris')
      setMode('edit')
      return
    }
    
    setShowModal('send')
  }
  
  const confirmSendToReview = async () => {
    setShowModal(null)
    setSending(true)
    // Simular envío a revisión
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSending(false)
    setProfileStatus('reviewing')
    showNotification('success', 'Perfil enviat a revisió! El Gestor Comercial revisarà la teva sol·licitud')
    
    // Aquí se enviaría notificación al Gestor Comercial y Admin
    // notifyGestorComercial(empresaData)
    // notifyAdmin(empresaData)
  }
  
  const handleDiscard = () => {
    setShowModal('discard')
  }
  
  const confirmDiscard = () => {
    setShowModal(null)
    // Resetear a valores originales
    window.location.reload()
  }

  // Componente de Vista Previa en Tarjeta
  const PreviewCard = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 max-w-sm">
      <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
        <img 
          src={empresaData.portada} 
          alt="Portada" 
          className="w-full h-full object-cover opacity-80"
        />
        {empresaData.verificada && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Check className="w-3 h-3" />
            Verificada
          </div>
        )}
      </div>
      
      <div className="relative px-6 pb-6">
        <div className="absolute -top-12 left-6">
          <img 
            src={empresaData.logo} 
            alt={empresaData.nombre}
            className="w-20 h-20 rounded-xl border-4 border-white shadow-lg"
          />
        </div>
        
        <div className="pt-10">
          <h3 className="text-lg font-bold text-slate-800">{empresaData.nombre}</h3>
          <p className="text-sm text-slate-600 mt-1">{empresaData.sector}</p>
          
          <p className="text-sm text-slate-600 mt-3 line-clamp-2">
            {empresaData.descripcion}
          </p>
          
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">{empresaData.ciudad}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">{empresaData.empleados}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600">{empresaData.valoracion}</div>
                <div className="text-xs text-slate-500">Valoració</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600">{empresaData.añosFuncionamiento}</div>
                <div className="text-xs text-slate-500">Anys</div>
              </div>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Veure més
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Componente de Vista Previa Single (Completa)
  const PreviewSingle = () => (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header con portada */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-600">
        <img 
          src={empresaData.portada} 
          alt="Portada" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div className="flex items-end gap-6">
            <img 
              src={empresaData.logo} 
              alt={empresaData.nombre}
              className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl"
            />
            <div className="text-white mb-2">
              <h2 className="text-3xl font-bold">{empresaData.nombre}</h2>
              <p className="text-lg opacity-90">{empresaData.sector}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {empresaData.verificada && (
              <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                Verificada
              </div>
            )}
            {empresaData.destacada && (
              <div className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1">
                <Star className="w-4 h-4" />
                Destacada
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Métricas destacadas */}
      <div className="px-8 py-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">{empresaData.empleados}</div>
            <div className="text-sm text-slate-600 mt-1">Empleats</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">{empresaData.añosFuncionamiento}</div>
            <div className="text-sm text-slate-600 mt-1">Anys d'experiència</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">{empresaData.valoracion}</div>
            <div className="text-sm text-slate-600 mt-1">Valoració mitjana</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{empresaData.beneficiosOfrecidos}</div>
            <div className="text-sm text-slate-600 mt-1">Beneficis oferts</div>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="p-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Sobre nosaltres</h3>
              <p className="text-slate-600 leading-relaxed">{empresaData.descripcion}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Beneficis destacats</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Teletreball flexible', 'Formació contínua', 'Assegurança mèdica', 
                  'Bonus per objectius', 'Horari flexible', 'Dies lliures addicionals'].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Columna lateral */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Informació de contacte</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-700">{empresaData.ciudad}</div>
                    <div className="text-xs text-slate-500">{empresaData.provincia}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{empresaData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{empresaData.telefono}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <a href={empresaData.web} className="text-sm text-indigo-600 hover:underline">
                    {empresaData.web}
                  </a>
                </div>
              </div>
            </div>
            
            <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
              Contactar amb l'empresa
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Modal Component
  const Modal = ({ type }: { type: 'send' | 'discard' }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          {type === 'send' ? (
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          )}
          <h3 className="text-xl font-bold text-slate-800">
            {type === 'send' ? 'Enviar a revisió' : 'Descartar canvis'}
          </h3>
        </div>
        
        <p className="text-slate-600 mb-6">
          {type === 'send' 
            ? 'Estàs segur que vols enviar el perfil a revisió? El Gestor Comercial revisarà la informació abans de publicar-la.'
            : 'Estàs segur que vols descartar tots els canvis? Aquesta acció no es pot desfer.'}
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(null)}
            className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
          >
            Cancel·lar
          </button>
          <button
            onClick={type === 'send' ? confirmSendToReview : confirmDiscard}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              type === 'send'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-lg'
                : 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg'
            }`}
          >
            {type === 'send' ? 'Enviar a revisió' : 'Descartar'}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hidden file inputs */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'logo')}
      />
      <input
        ref={portadaInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'portada')}
      />
      
      {/* Modals */}
      {showModal && <Modal type={showModal} />}
      
      {/* Notifications */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
              : notification.type === 'error'
              ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
          }`}>
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {notification.type === 'info' && <Info className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
      {/* Header Premium */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">{empresaData.nombre}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs rounded-full font-bold">
                    Premium Enterprise
                  </span>
                  {profileStatus === 'draft' && (
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded-full font-medium">
                      Esborrany
                    </span>
                  )}
                  {profileStatus === 'reviewing' && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      En revisió
                    </span>
                  )}
                  {profileStatus === 'approved' && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Aprovat
                    </span>
                  )}
                  {profileStatus === 'rejected' && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium flex items-center gap-1">
                      <X className="w-3 h-3" />
                      Rebutjat
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Toggle Vista */}
              <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setMode('edit')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    mode === 'edit' 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Edit2 className="w-4 h-4 inline mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => setMode('preview')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    mode === 'preview' 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  Vista prèvia
                </button>
              </div>
              
              {/* Acciones */}
              {profileStatus === 'draft' && (
                <button 
                  onClick={handleSendToReview}
                  disabled={sending}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
                      Enviant...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 inline mr-1" />
                      Enviar a revisió
                    </>
                  )}
                </button>
              )}
              
              {profileStatus === 'reviewing' && (
                <button 
                  disabled
                  className="px-4 py-2 bg-slate-300 text-slate-500 rounded-lg font-medium cursor-not-allowed"
                >
                  <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
                  En revisió...
                </button>
              )}
              
              {profileStatus === 'rejected' && (
                <button 
                  onClick={() => setProfileStatus('draft')}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  <Edit2 className="w-4 h-4 inline mr-1" />
                  Editar i reenviar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="bg-white border-b px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Completitud del perfil</span>
            <span className="text-sm font-bold text-indigo-600">{completitud}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completitud}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {mode === 'edit' ? (
          /* Modo Edición */
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              {/* Sección de Imágenes */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Imatges de l'empresa</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Logo (120x120)
                    </label>
                    <div className="relative group">
                      <img 
                        src={empresaData.logo} 
                        alt="Logo"
                        className="w-32 h-32 rounded-xl object-cover border-2 border-slate-200"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <button 
                          onClick={() => handleImageUpload('logo')}
                          className="p-2 bg-white rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Camera className="w-5 h-5 text-slate-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fotografia de portada (800x400)
                    </label>
                    <div className="relative group">
                      <img 
                        src={empresaData.portada} 
                        alt="Portada"
                        className="w-full h-32 rounded-xl object-cover border-2 border-slate-200"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <button 
                          onClick={() => handleImageUpload('portada')}
                          className="p-2 bg-white rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Upload className="w-5 h-5 text-slate-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información Básica */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Informació bàsica</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nom de l'empresa *
                    </label>
                    <input
                      type="text"
                      value={empresaData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.nombre ? 'border-red-500 bg-red-50' : ''
                      }`}
                    />
                    {errors.nombre && (
                      <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Sector *
                    </label>
                    <select
                      value={empresaData.sector}
                      onChange={(e) => handleInputChange('sector', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option>Tecnologia</option>
                      <option>Salut</option>
                      <option>Educació</option>
                      <option>Finances</option>
                    </select>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Descripció pública *
                    </label>
                    <textarea
                      value={empresaData.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nombre d'empleats *
                    </label>
                    <select
                      value={empresaData.empleados}
                      onChange={(e) => handleInputChange('empleados', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option>1-10</option>
                      <option>11-50</option>
                      <option>51-200</option>
                      <option>200+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Província *
                    </label>
                    <select
                      value={empresaData.provincia}
                      onChange={(e) => handleInputChange('provincia', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option>Catalunya</option>
                      <option>Madrid</option>
                      <option>València</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Ciutat *
                    </label>
                    <input
                      type="text"
                      value={empresaData.ciudad}
                      onChange={(e) => handleInputChange('ciudad', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email de contacte *
                    </label>
                    <input
                      type="email"
                      value={empresaData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Telèfon
                    </label>
                    <input
                      type="tel"
                      value={empresaData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Pàgina web
                    </label>
                    <input
                      type="url"
                      value={empresaData.web}
                      onChange={(e) => handleInputChange('web', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna lateral - Métricas */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Sobre nosaltres</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
                    <div>
                      <div className="text-2xl font-bold text-indigo-600">150</div>
                      <div className="text-sm text-slate-600">Empleats</div>
                    </div>
                    <Users className="w-8 h-8 text-indigo-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">10</div>
                      <div className="text-sm text-slate-600">Anys d'experiència</div>
                    </div>
                    <Calendar className="w-8 h-8 text-emerald-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                    <div>
                      <div className="text-2xl font-bold text-amber-600">4.8</div>
                      <div className="text-sm text-slate-600">Valoració mitjana</div>
                    </div>
                    <Star className="w-8 h-8 text-amber-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">6</div>
                      <div className="text-sm text-slate-600">Beneficis oferts</div>
                    </div>
                    <Award className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
                <Shield className="w-10 h-10 mb-3" />
                <h3 className="text-lg font-bold mb-2">Compte Premium</h3>
                <p className="text-sm opacity-90 mb-4">
                  Gaudeix de totes les funcionalitats premium per destacar la teva empresa
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Perfil destacat
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Estadístiques avançades
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Suport prioritari
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* Modo Vista Previa */
          <div>
            {/* Selector de vista */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <button
                onClick={() => setViewMode('card')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'card'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <LayoutGrid className="w-4 h-4 inline mr-2" />
                Vista targeta
              </button>
              <button
                onClick={() => setViewMode('single')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'single'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Vista completa
              </button>
            </div>

            {/* Vista previa según modo */}
            <div className="flex justify-center">
              {viewMode === 'card' ? <PreviewCard /> : <PreviewSingle />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}