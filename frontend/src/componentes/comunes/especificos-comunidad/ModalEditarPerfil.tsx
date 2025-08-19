'use client'

import { useState, useRef } from 'react'
import { X, Camera, Globe, Users, Lock, Info, Building } from 'lucide-react'

// Tipos de privacidad
type NivelPrivacidad = 'publico' | 'conexiones' | 'privado'

interface CampoPrivacidad {
  valor: any
  privacidad: NivelPrivacidad
}

interface DatosPerfil {
  // Datos básicos (del registro)
  nick: string
  nombre: CampoPrivacidad
  apellidos: CampoPrivacidad
  email: string // Siempre privado
  comunidad: string
  
  // Datos opcionales
  fechaNacimiento: CampoPrivacidad
  genero: CampoPrivacidad
  biografia: CampoPrivacidad
  ubicacion: CampoPrivacidad
  
  // Información laboral
  puesto: CampoPrivacidad
  organizacion: CampoPrivacidad
  departamento: CampoPrivacidad
  anyosExperiencia: CampoPrivacidad
  grupoFuncionario: CampoPrivacidad
  especialidades: CampoPrivacidad
  
  // Fotos
  fotoPerfil?: string
  fotoPortada?: string
  
  // Configuración general
  mostrarPublicaciones: NivelPrivacidad
  mostrarConexiones: NivelPrivacidad
  mostrarGrupos: NivelPrivacidad
}

interface ModalEditarPerfilProps {
  isOpen: boolean
  onClose: () => void
  datosActuales: any
  onGuardar: (datos: DatosPerfil) => void
  guardando?: boolean
}

export default function ModalEditarPerfil({ 
  isOpen, 
  onClose, 
  datosActuales,
  onGuardar,
  guardando = false
}: ModalEditarPerfilProps) {
  
  const [activeTab, setActiveTab] = useState<'general' | 'laboral' | 'social' | 'privacidad'>('general')
  const fotoPerfilRef = useRef<HTMLInputElement>(null)
  const fotoPortadaRef = useRef<HTMLInputElement>(null)
  
  // Estado inicial con datos actuales
  const [datosPerfil, setDatosPerfil] = useState<DatosPerfil>({
    // Datos básicos
    nick: datosActuales.nick || '',
    nombre: datosActuales.nombre || { valor: '', privacidad: 'privado' },
    apellidos: datosActuales.apellidos || { valor: '', privacidad: 'privado' },
    email: datosActuales.email || '',
    comunidad: datosActuales.comunidad || '',
    
    // Datos opcionales
    fechaNacimiento: datosActuales.fechaNacimiento || { valor: '', privacidad: 'privado' },
    genero: datosActuales.genero || { valor: '', privacidad: 'privado' },
    biografia: datosActuales.biografia || { valor: '', privacidad: 'publico' },
    ubicacion: datosActuales.ubicacion || { valor: '', privacidad: 'conexiones' },
    
    // Información laboral
    puesto: datosActuales.puesto || { valor: '', privacidad: 'publico' },
    organizacion: datosActuales.organizacion || { valor: '', privacidad: 'publico' },
    departamento: datosActuales.departamento || { valor: '', privacidad: 'conexiones' },
    anyosExperiencia: datosActuales.anyosExperiencia || { valor: '', privacidad: 'conexiones' },
    grupoFuncionario: datosActuales.grupoFuncionario || { valor: '', privacidad: 'publico' },
    especialidades: datosActuales.especialidades || { valor: [], privacidad: 'publico' },
    
    // Fotos
    fotoPerfil: datosActuales.fotoPerfil || '',
    fotoPortada: datosActuales.fotoPortada || '',
    
    // Configuración general
    mostrarPublicaciones: datosActuales.mostrarPublicaciones || 'publico',
    mostrarConexiones: datosActuales.mostrarConexiones || 'conexiones',
    mostrarGrupos: datosActuales.mostrarGrupos || 'publico'
  })

  const actualizarCampo = (campo: string, valor: any, esPrivacidad = false) => {
    setDatosPerfil(prev => {
      if (esPrivacidad) {
        return {
          ...prev,
          [campo]: {
            ...(prev[campo as keyof DatosPerfil] as any),
            privacidad: valor
          }
        }
      } else if (typeof prev[campo as keyof DatosPerfil] === 'object' && prev[campo as keyof DatosPerfil] !== null && 'valor' in (prev[campo as keyof DatosPerfil] as any)) {
        return {
          ...prev,
          [campo]: {
            ...(prev[campo as keyof DatosPerfil] as any),
            valor: valor
          }
        }
      } else {
        return {
          ...prev,
          [campo]: valor
        }
      }
    })
  }

  const handleImageChange = (tipo: 'perfil' | 'portada', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (tipo === 'perfil') {
          setDatosPerfil(prev => ({ ...prev, fotoPerfil: reader.result as string }))
        } else {
          setDatosPerfil(prev => ({ ...prev, fotoPortada: reader.result as string }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const IconoPrivacidad = ({ nivel }: { nivel: NivelPrivacidad }) => {
    switch (nivel) {
      case 'publico': return <Globe size={14} className="text-green-600" />
      case 'conexiones': return <Users size={14} className="text-blue-600" />
      case 'privado': return <Lock size={14} className="text-red-600" />
    }
  }

  const SelectorPrivacidad = ({ valor, onChange }: { valor: NivelPrivacidad, onChange: (val: NivelPrivacidad) => void }) => (
    <select
      value={valor}
      onChange={(e) => onChange(e.target.value as NivelPrivacidad)}
      className="ml-2 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="publico">🌍 Público</option>
      <option value="conexiones">👥 Conexiones</option>
      <option value="privado">🔒 Privado</option>
    </select>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Editar Perfil</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-1 p-2">
            {[
              { id: 'general', label: 'Información General', icon: Info },
              { id: 'laboral', label: 'Experiencia Laboral', icon: Building },
              { id: 'social', label: 'Social', icon: Users },
              { id: 'privacidad', label: 'Privacidad', icon: Lock }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Tab General */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Fotos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto de Perfil
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                      {datosPerfil.fotoPerfil ? (
                        <img src={datosPerfil.fotoPerfil} alt="Perfil" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Camera size={32} />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fotoPerfilRef.current?.click()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Cambiar foto
                    </button>
                    <input
                      ref={fotoPerfilRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange('perfil', e)}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto de Portada
                  </label>
                  <div className="space-y-2">
                    <div className="w-full h-24 bg-gray-200 rounded-lg overflow-hidden">
                      {datosPerfil.fotoPortada ? (
                        <img src={datosPerfil.fotoPortada} alt="Portada" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Camera size={32} />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fotoPortadaRef.current?.click()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Cambiar portada
                    </button>
                    <input
                      ref={fotoPortadaRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange('portada', e)}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Campos básicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nick (público)
                  </label>
                  <input
                    type="text"
                    value={datosPerfil.nick}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (privado)
                  </label>
                  <input
                    type="email"
                    value={datosPerfil.email}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Nombre
                    <IconoPrivacidad nivel={datosPerfil.nombre.privacidad} />
                    <SelectorPrivacidad 
                      valor={datosPerfil.nombre.privacidad}
                      onChange={(val) => actualizarCampo('nombre', val, true)}
                    />
                  </label>
                  <input
                    type="text"
                    value={datosPerfil.nombre.valor}
                    onChange={(e) => actualizarCampo('nombre', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Apellidos
                    <IconoPrivacidad nivel={datosPerfil.apellidos.privacidad} />
                    <SelectorPrivacidad 
                      valor={datosPerfil.apellidos.privacidad}
                      onChange={(val) => actualizarCampo('apellidos', val, true)}
                    />
                  </label>
                  <input
                    type="text"
                    value={datosPerfil.apellidos.valor}
                    onChange={(e) => actualizarCampo('apellidos', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Fecha de Nacimiento (opcional)
                    <IconoPrivacidad nivel={datosPerfil.fechaNacimiento.privacidad} />
                    <SelectorPrivacidad 
                      valor={datosPerfil.fechaNacimiento.privacidad}
                      onChange={(val) => actualizarCampo('fechaNacimiento', val, true)}
                    />
                  </label>
                  <input
                    type="date"
                    value={datosPerfil.fechaNacimiento.valor}
                    onChange={(e) => actualizarCampo('fechaNacimiento', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Género (opcional)
                    <IconoPrivacidad nivel={datosPerfil.genero.privacidad} />
                    <SelectorPrivacidad 
                      valor={datosPerfil.genero.privacidad}
                      onChange={(val) => actualizarCampo('genero', val, true)}
                    />
                  </label>
                  <select
                    value={datosPerfil.genero.valor}
                    onChange={(e) => actualizarCampo('genero', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                    <option value="no-decir">Prefiero no decir</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Biografía (opcional)
                    <IconoPrivacidad nivel={datosPerfil.biografia.privacidad} />
                    <SelectorPrivacidad 
                      valor={datosPerfil.biografia.privacidad}
                      onChange={(val) => actualizarCampo('biografia', val, true)}
                    />
                  </label>
                  <textarea
                    value={datosPerfil.biografia.valor}
                    onChange={(e) => actualizarCampo('biografia', e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Ubicación (opcional)
                    <IconoPrivacidad nivel={datosPerfil.ubicacion.privacidad} />
                    <SelectorPrivacidad 
                      valor={datosPerfil.ubicacion.privacidad}
                      onChange={(val) => actualizarCampo('ubicacion', val, true)}
                    />
                  </label>
                  <input
                    type="text"
                    value={datosPerfil.ubicacion.valor}
                    onChange={(e) => actualizarCampo('ubicacion', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ciudad, Provincia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comunidad Autónoma
                  </label>
                  <input
                    type="text"
                    value={datosPerfil.comunidad}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Contacta con soporte para cambiar tu comunidad
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Laboral */}
          {activeTab === 'laboral' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Puesto (opcional)
                    <IconoPrivacidad nivel={datosPerfil.puesto.privacidad} />
                    <SelectorPrivacidad 
                      valor={datosPerfil.puesto.privacidad}
                      onChange={(val) => actualizarCampo('puesto', val, true)}
                    />
                  </label>
                  <input
                    type="text"
                    value={datosPerfil.puesto.valor}
                    onChange={(e) => actualizarCampo('puesto', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu puesto actual"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Organización (opcional)
                    <IconoPrivacidad nivel={datosPerfil.organizacion.privacidad} />
                    <SelectorPrivacidad 
                      valor={datosPerfil.organizacion.privacidad}
                      onChange={(val) => actualizarCampo('organizacion', val, true)}
                    />
                  </label>
                  <input
                    type="text"
                    value={datosPerfil.organizacion.valor}
                    onChange={(e) => actualizarCampo('organizacion', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre de tu organización"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Departamento (opcional)
                    <IconoPrivacidad nivel={datosPerfil.departamento.privacidad} />
                    <SelectorPrivacidad 
                      valor={datosPerfil.departamento.privacidad}
                      onChange={(val) => actualizarCampo('departamento', val, true)}
                    />
                  </label>
                  <input
                    type="text"
                    value={datosPerfil.departamento.valor}
                    onChange={(e) => actualizarCampo('departamento', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu departamento"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Años de Experiencia (opcional)
                    <IconoPrivacidad nivel={datosPerfil.anyosExperiencia.privacidad} />
                    <SelectorPrivacidad 
                      valor={datosPerfil.anyosExperiencia.privacidad}
                      onChange={(val) => actualizarCampo('anyosExperiencia', val, true)}
                    />
                  </label>
                  <input
                    type="number"
                    value={datosPerfil.anyosExperiencia.valor}
                    onChange={(e) => actualizarCampo('anyosExperiencia', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Grupo Funcionario (opcional)
                    <IconoPrivacidad nivel={datosPerfil.grupoFuncionario.privacidad} />
                    <SelectorPrivacidad 
                      valor={datosPerfil.grupoFuncionario.privacidad}
                      onChange={(val) => actualizarCampo('grupoFuncionario', val, true)}
                    />
                  </label>
                  <select
                    value={datosPerfil.grupoFuncionario.valor}
                    onChange={(e) => actualizarCampo('grupoFuncionario', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar</option>
                    <option value="A1">A1 - Técnico Superior</option>
                    <option value="A2">A2 - Técnico Medio</option>
                    <option value="C1">C1 - Administrativo</option>
                    <option value="C2">C2 - Auxiliar Administrativo</option>
                    <option value="E">E - Subalterno</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Especialidades (opcional)
                    <IconoPrivacidad nivel={datosPerfil.especialidades.privacidad} />
                    <SelectorPrivacidad 
                      valor={datosPerfil.especialidades.privacidad}
                      onChange={(val) => actualizarCampo('especialidades', val, true)}
                    />
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(datosPerfil.especialidades.valor) ? datosPerfil.especialidades.valor.join(', ') : ''}
                    onChange={(e) => actualizarCampo('especialidades', e.target.value.split(', ').filter(s => s.trim() !== ''))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Contratación Pública, Gestión de Proyectos, Innovación"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separa las especialidades con comas
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Social */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  En esta sección puedes gestionar tus redes sociales y enlaces externos.
                  Esta funcionalidad estará disponible próximamente.
                </p>
              </div>
            </div>
          )}

          {/* Tab Privacidad */}
          {activeTab === 'privacidad' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Configuración de Privacidad General
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Mostrar mis publicaciones</p>
                      <p className="text-sm text-gray-600">Quién puede ver tus publicaciones en tu perfil</p>
                    </div>
                    <select
                      value={datosPerfil.mostrarPublicaciones}
                      onChange={(e) => actualizarCampo('mostrarPublicaciones', e.target.value)}
                      className="ml-4 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="publico">🌍 Todos</option>
                      <option value="conexiones">👥 Solo conexiones</option>
                      <option value="privado">🔒 Solo yo</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Mostrar mis conexiones</p>
                      <p className="text-sm text-gray-600">Quién puede ver tu lista de conexiones</p>
                    </div>
                    <select
                      value={datosPerfil.mostrarConexiones}
                      onChange={(e) => actualizarCampo('mostrarConexiones', e.target.value)}
                      className="ml-4 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="publico">🌍 Todos</option>
                      <option value="conexiones">👥 Solo conexiones</option>
                      <option value="privado">🔒 Solo yo</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Mostrar mis grupos</p>
                      <p className="text-sm text-gray-600">Solo se mostrarán grupos públicos</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Siempre públicos
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> Los grupos privados/profesionales nunca se muestran en perfiles públicos.
                  Solo tú puedes ver tus grupos privados en tu propio perfil.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer con botones */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              console.log('🎯 Botó Guardar premut! Dades del modal:', datosPerfil)
              onGuardar(datosPerfil)
            }}
            disabled={guardando}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              guardando 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {guardando ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Guardant...</span>
              </>
            ) : (
              <span>Guardar canvis</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}