'use client'

import { useState } from 'react'
import { 
  Building2, Globe, MapPin, Users, Calendar, Shield, Award,
  Edit3, Save, X, Camera, Mail, Phone, Clock, CheckCircle,
  Link, FileText, Star, TrendingUp, Target, Briefcase,
  ChevronRight, Upload, AlertTriangle, Info, History,
  Settings, Hash, User, Package, CreditCard, DollarSign,
  BarChart3, PieChart, Activity, Zap, Plus, Crown
} from 'lucide-react'
import EnterpriseProfileFeatures from './EnterpriseProfileFeatures'

export default function PerfilEmpresa() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [showImageUpload, setShowImageUpload] = useState(false)
  
  const [empresaData, setEmpresaData] = useState({
    nombre: 'TechSolutions Barcelona S.L.',
    nif: 'B12345678',
    logo: '/api/placeholder/120/120',
    sector: 'Tecnología',
    tamano: '50-250 empleados',
    fundacion: '2015',
    descripcion: 'Empresa líder en soluciones tecnológicas innovadoras para el sector público y privado. Especializada en transformación digital, desarrollo de software a medida y consultoría IT.',
    
    contacto: {
      email: 'info@techsolutions.cat',
      telefono: '+34 93 123 45 67',
      web: 'www.techsolutions.cat',
      linkedin: 'linkedin.com/company/techsolutions-bcn',
      twitter: '@techsolutions_bcn'
    },
    
    ubicacion: {
      direccion: 'Carrer de la Tecnologia, 123',
      ciudad: 'Barcelona',
      codigoPostal: '08025',
      provincia: 'Barcelona',
      comunidad: 'Catalunya',
      pais: 'España'
    },
    
    certificaciones: [
      { nombre: 'ISO 9001:2015', fecha: '2020', vigente: true },
      { nombre: 'ISO 27001', fecha: '2021', vigente: true },
      { nombre: 'Empresa B Corp', fecha: '2022', vigente: true },
      { nombre: 'Sello PYME Innovadora', fecha: '2023', vigente: true }
    ],
    
    responsableDatos: {
      nombre: 'Joan Martínez',
      cargo: 'Director de RRHH',
      email: 'j.martinez@techsolutions.cat',
      telefono: '+34 93 123 45 68'
    },
    
    facturacion: {
      metodo: 'Transferencia bancaria',
      periodo: 'Mensual',
      iban: 'ES** **** **** **** **** ****',
      titular: 'TechSolutions Barcelona S.L.'
    },
    
    estadisticas: {
      empleadosActuales: 127,
      crecimientoAnual: 23,
      presenciaInternacional: 3,
      proyectosActivos: 45,
      clientesSatisfechos: 98
    }
  })
  
  const [editedData, setEditedData] = useState(empresaData)
  
  const handleSave = () => {
    setEmpresaData(editedData)
    setIsEditing(false)
  }
  
  const handleCancel = () => {
    setEditedData(empresaData)
    setIsEditing(false)
  }
  
  const tabs = [
    { id: 'general', name: 'Informació General', icon: Building2 },
    { id: 'contacte', name: 'Contacte i Xarxes', icon: Mail },
    { id: 'certificacions', name: 'Certificacions', icon: Award },
    { id: 'facturacio', name: 'Facturació', icon: CreditCard },
    { id: 'estadistiques', name: 'Estadístiques', icon: BarChart3 },
    { id: 'enterprise', name: 'Enterprise', icon: Crown },
    { id: 'historial', name: 'Historial', icon: History }
  ]

  return (
    <div className="space-y-6">
      {/* Header amb info bàsica */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-4 right-4 flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white/90 backdrop-blur-sm text-slate-700 rounded-lg hover:bg-white transition-all flex items-center gap-2 shadow-lg"
              >
                <Edit3 className="w-4 h-4" />
                <span className="font-medium">Editar Perfil</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span className="font-medium">Guardar</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2 shadow-lg"
                >
                  <X className="w-4 h-4" />
                  <span className="font-medium">Cancel·lar</span>
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="relative px-6 pb-6">
          <div className="flex items-start gap-6 -mt-16">
            {/* Logo de l'empresa */}
            <div className="relative group">
              <div className="w-32 h-32 bg-white rounded-2xl shadow-xl border-4 border-white overflow-hidden">
                <img 
                  src={empresaData.logo} 
                  alt={empresaData.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <button
                  onClick={() => setShowImageUpload(true)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center"
                >
                  <Camera className="w-8 h-8 text-white" />
                </button>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            
            {/* Info principal */}
            <div className="flex-1 pt-20">
              <div className="flex items-start justify-between">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.nombre}
                      onChange={(e) => setEditedData({...editedData, nombre: e.target.value})}
                      className="text-2xl font-bold text-slate-800 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-slate-800">{empresaData.nombre}</h1>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Hash className="w-4 h-4" />
                      <span className="text-sm">NIF: {empresaData.nif}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">{empresaData.sector}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{empresaData.tamano}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Des de {empresaData.fundacion}</span>
                    </div>
                  </div>
                </div>
                
                {/* Plan badge */}
                <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full flex items-center gap-2 shadow-lg">
                  <Award className="w-5 h-5" />
                  <span className="font-bold">Premium Enterprise</span>
                </div>
              </div>
              
              {/* Descripció */}
              <div className="mt-4">
                {isEditing ? (
                  <textarea
                    value={editedData.descripcion}
                    onChange={(e) => setEditedData({...editedData, descripcion: e.target.value})}
                    rows={3}
                    className="w-full text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed">{empresaData.descripcion}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs de navegació */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 p-2">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Contingut segons tab actiu */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-6">
        {/* Informació General */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Informació de l'Empresa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1">Nom Comercial</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.nombre}
                        onChange={(e) => setEditedData({...editedData, nombre: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-slate-800 font-medium">{empresaData.nombre}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1">NIF/CIF</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.nif}
                        onChange={(e) => setEditedData({...editedData, nif: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-slate-800 font-medium">{empresaData.nif}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1">Sector</label>
                    {isEditing ? (
                      <select
                        value={editedData.sector}
                        onChange={(e) => setEditedData({...editedData, sector: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Tecnología">Tecnología</option>
                        <option value="Salud">Salud</option>
                        <option value="Educación">Educación</option>
                        <option value="Servicios">Servicios</option>
                        <option value="Industria">Industria</option>
                      </select>
                    ) : (
                      <p className="text-slate-800 font-medium">{empresaData.sector}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1">Tamany de l'Empresa</label>
                    {isEditing ? (
                      <select
                        value={editedData.tamano}
                        onChange={(e) => setEditedData({...editedData, tamano: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="1-10 empleados">1-10 empleados</option>
                        <option value="11-50 empleados">11-50 empleados</option>
                        <option value="50-250 empleados">50-250 empleados</option>
                        <option value="250+ empleados">250+ empleados</option>
                      </select>
                    ) : (
                      <p className="text-slate-800 font-medium">{empresaData.tamano}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1">Any de Fundació</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.fundacion}
                        onChange={(e) => setEditedData({...editedData, fundacion: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-slate-800 font-medium">{empresaData.fundacion}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ubicació */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                Ubicació
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Adreça</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.ubicacion.direccion}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        ubicacion: {...editedData.ubicacion, direccion: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-slate-800">{empresaData.ubicacion.direccion}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Ciutat</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.ubicacion.ciudad}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        ubicacion: {...editedData.ubicacion, ciudad: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-slate-800">{empresaData.ubicacion.ciudad}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Codi Postal</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.ubicacion.codigoPostal}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        ubicacion: {...editedData.ubicacion, codigoPostal: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-slate-800">{empresaData.ubicacion.codigoPostal}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Comunitat Autònoma</label>
                  <p className="text-slate-800">{empresaData.ubicacion.comunidad}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Contacte i Xarxes */}
        {activeTab === 'contacte' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-600" />
                Informació de Contacte
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1">Correu Electrònic</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedData.contacto.email}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          contacto: {...editedData.contacto, email: e.target.value}
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-slate-800 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {empresaData.contacto.email}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1">Telèfon</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedData.contacto.telefono}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          contacto: {...editedData.contacto, telefono: e.target.value}
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-slate-800 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {empresaData.contacto.telefono}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1">Lloc Web</label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={editedData.contacto.web}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          contacto: {...editedData.contacto, web: e.target.value}
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-slate-800 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <a href={`https://${empresaData.contacto.web}`} className="text-indigo-600 hover:underline">
                          {empresaData.contacto.web}
                        </a>
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1">LinkedIn</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.contacto.linkedin}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          contacto: {...editedData.contacto, linkedin: e.target.value}
                        })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-slate-800 flex items-center gap-2">
                        <Link className="w-4 h-4 text-slate-400" />
                        <a href={`https://${empresaData.contacto.linkedin}`} className="text-indigo-600 hover:underline">
                          {empresaData.contacto.linkedin}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Responsable de Dades */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Responsable de Dades
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Nom Complet</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.responsableDatos.nombre}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        responsableDatos: {...editedData.responsableDatos, nombre: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-slate-800">{empresaData.responsableDatos.nombre}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Càrrec</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.responsableDatos.cargo}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        responsableDatos: {...editedData.responsableDatos, cargo: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-slate-800">{empresaData.responsableDatos.cargo}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Email Directe</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedData.responsableDatos.email}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        responsableDatos: {...editedData.responsableDatos, email: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-slate-800">{empresaData.responsableDatos.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Telèfon Directe</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData.responsableDatos.telefono}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        responsableDatos: {...editedData.responsableDatos, telefono: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-slate-800">{empresaData.responsableDatos.telefono}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Certificacions */}
        {activeTab === 'certificacions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                Certificacions i Acreditacions
              </h3>
              {isEditing && (
                <button className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Afegir Certificació
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {empresaData.certificaciones.map((cert, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 ${cert.vigente ? 'bg-green-100' : 'bg-orange-100'} rounded-lg flex items-center justify-center`}>
                        {cert.vigente ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{cert.nombre}</h4>
                        <p className="text-sm text-slate-600">Obtinguda: {cert.fecha}</p>
                        <p className={`text-xs mt-1 ${cert.vigente ? 'text-green-600' : 'text-orange-600'}`}>
                          {cert.vigente ? '✓ Vigent' : '⚠ Renovació pendent'}
                        </p>
                      </div>
                    </div>
                    {isEditing && (
                      <button className="text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200/60">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Info className="w-5 h-5" />
                <span className="font-semibold">Beneficis de les Certificacions</span>
              </div>
              <p className="text-sm text-blue-600">
                Les certificacions milloren la vostra credibilitat i posicionament. 
                Les empreses amb més de 3 certificacions reben un 40% més de visualitzacions.
              </p>
            </div>
          </div>
        )}
        
        {/* Facturació */}
        {activeTab === 'facturacio' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              Informació de Facturació
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Mètode de Pagament</label>
                  {isEditing ? (
                    <select
                      value={editedData.facturacion.metodo}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        facturacion: {...editedData.facturacion, metodo: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Transferencia bancaria">Transferència bancària</option>
                      <option value="Domiciliación">Domiciliació bancària</option>
                      <option value="Tarjeta">Targeta de crèdit</option>
                    </select>
                  ) : (
                    <p className="text-slate-800 font-medium">{empresaData.facturacion.metodo}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Període de Facturació</label>
                  {isEditing ? (
                    <select
                      value={editedData.facturacion.periodo}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        facturacion: {...editedData.facturacion, periodo: e.target.value}
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Mensual">Mensual</option>
                      <option value="Trimestral">Trimestral</option>
                      <option value="Anual">Anual</option>
                    </select>
                  ) : (
                    <p className="text-slate-800 font-medium">{empresaData.facturacion.periodo}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">IBAN</label>
                  <p className="text-slate-800 font-mono">{empresaData.facturacion.iban}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Titular del Compte</label>
                  <p className="text-slate-800">{empresaData.facturacion.titular}</p>
                </div>
              </div>
            </div>
            
            {/* Resum del Pla Actual */}
            <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/60">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-600" />
                  Pla Premium Enterprise
                </h4>
                <span className="text-2xl font-bold text-slate-800">299€/mes</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Ofertes incloses</p>
                  <p className="font-semibold text-slate-800">100 ofertes/mes</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Grups ocults</p>
                  <p className="font-semibold text-slate-800">Il·limitats</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Analytics avançats</p>
                  <p className="font-semibold text-slate-800">✓ Inclosos</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Suport prioritari</p>
                  <p className="font-semibold text-slate-800">24/7</p>
                </div>
              </div>
              
              <button className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all">
                Actualitzar Pla
              </button>
            </div>
          </div>
        )}
        
        {/* Estadístiques */}
        {activeTab === 'estadistiques' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Estadístiques de l'Empresa
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200/60">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{empresaData.estadisticas.empleadosActuales}</div>
                <div className="text-xs text-slate-600">Empleats</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/60">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">+{empresaData.estadisticas.crecimientoAnual}%</div>
                <div className="text-xs text-slate-600">Creixement</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200/60">
                <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{empresaData.estadisticas.presenciaInternacional}</div>
                <div className="text-xs text-slate-600">Països</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200/60">
                <Briefcase className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{empresaData.estadisticas.proyectosActivos}</div>
                <div className="text-xs text-slate-600">Projectes</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200/60">
                <Star className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{empresaData.estadisticas.clientesSatisfechos}%</div>
                <div className="text-xs text-slate-600">Satisfacció</div>
              </div>
            </div>
            
            {/* Gràfic de rendiment */}
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200/60">
              <h4 className="font-semibold text-slate-800 mb-4">Evolució del Rendiment</h4>
              <div className="h-64 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <Activity className="w-16 h-16 mx-auto mb-2" />
                  <p>Gràfic de rendiment</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Enterprise Features */}
        {activeTab === 'enterprise' && (
          <EnterpriseProfileFeatures 
            empresaId="empresa-001"
            planEmpresa="premium"
          />
        )}
        
        {/* Historial */}
        {activeTab === 'historial' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              Historial d'Activitat
            </h3>
            
            <div className="space-y-3">
              {[
                { date: '15 Nov 2024', action: 'Oferta publicada', detail: 'Desenvolupador Full Stack Senior', type: 'offer' },
                { date: '14 Nov 2024', action: 'Perfil actualitzat', detail: 'Certificació ISO 27001 afegida', type: 'profile' },
                { date: '10 Nov 2024', action: 'Pla renovat', detail: 'Premium Enterprise - Anual', type: 'billing' },
                { date: '8 Nov 2024', action: 'Grup creat', detail: 'Tech Talents Barcelona', type: 'group' },
                { date: '5 Nov 2024', action: 'Oferta finalitzada', detail: 'Project Manager IT', type: 'offer' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200/60 hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.type === 'offer' ? 'bg-blue-100' :
                    item.type === 'profile' ? 'bg-green-100' :
                    item.type === 'billing' ? 'bg-amber-100' :
                    'bg-purple-100'
                  }`}>
                    {item.type === 'offer' && <FileText className="w-5 h-5 text-blue-600" />}
                    {item.type === 'profile' && <User className="w-5 h-5 text-green-600" />}
                    {item.type === 'billing' && <CreditCard className="w-5 h-5 text-amber-600" />}
                    {item.type === 'group' && <Users className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">{item.action}</div>
                    <div className="text-sm text-slate-600">{item.detail}</div>
                  </div>
                  <div className="text-sm text-slate-500">{item.date}</div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
            
            <button className="w-full py-2 text-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
              Veure tot l'historial
            </button>
          </div>
        )}
      </div>
    </div>
  )
}