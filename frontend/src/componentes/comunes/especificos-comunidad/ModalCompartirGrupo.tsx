'use client'

import { useState, useEffect } from 'react'
import { X, Send, Search, Users, Check } from 'lucide-react'
import { GrupoAvanzado } from '../../../../tipos/gruposAvanzados'

interface ModalCompartirGrupoProps {
  grupo: GrupoAvanzado
  isOpen: boolean
  onClose: () => void
}

// Mock de conexiones del usuario
const CONEXIONES_MOCK = [
  {
    id: 'user-2',
    nombre: 'Maria Gonzalez',
    nick: '@maria_gonzalez',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b151b04c?w=50&h=50&fit=crop&crop=face',
    organitzacio: 'Ajuntament de Barcelona',
    esMiembroDelGrupo: false
  },
  {
    id: 'user-3', 
    nombre: 'Jordi Martinez',
    nick: '@jordi_martinez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    organitzacio: 'Generalitat de Catalunya',
    esMiembroDelGrupo: true
  },
  {
    id: 'user-4',
    nombre: 'Anna Lopez', 
    nick: '@anna_lopez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    organitzacio: 'Diputació de Barcelona',
    esMiembroDelGrupo: false
  },
  {
    id: 'user-5',
    nombre: 'Pere Soler',
    nick: '@pere_soler', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
    organitzacio: 'Ajuntament de Girona',
    esMiembroDelGrupo: false
  },
  {
    id: 'user-6',
    nombre: 'Laura Ruiz',
    nick: '@laura_ruiz',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face', 
    organitzacio: 'Generalitat de Catalunya',
    esMiembroDelGrupo: false
  }
]

export default function ModalCompartirGrupo({ grupo, isOpen, onClose }: ModalCompartirGrupoProps) {
  const [busqueda, setBusqueda] = useState('')
  const [conexionsSeleccionades, setConexionsSeleccionades] = useState<string[]>([])
  const [missatge, setMissatge] = useState('')
  const [enviant, setEnviant] = useState(false)

  useEffect(() => {
    // Mensaje por defecto según tipo de grupo
    const tipoMensaje = () => {
      switch (grupo.tipo) {
        case 'publico':
          return `Hola! Et convido a unir-te al grup "${grupo.nombre}" a La Pública. Pots accedir directament!`
        case 'privado':
        case 'oculto':
          return `Hola! Et recomano el grup "${grupo.nombre}" a La Pública. Hauràs de sol·licitar accés i esperar l'aprovació de l'admin.`
        default:
          return `Hola! Et convido a unir-te al grup "${grupo.nombre}" a La Pública. Crec que t'interessarà!`
      }
    }
    setMissatge(tipoMensaje())
  }, [grupo.nombre, grupo.tipo])

  if (!isOpen) return null

  const conexionsFiltradas = CONEXIONES_MOCK.filter(conexion =>
    conexion.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    conexion.organitzacio.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleSeleccionarConexion = (conexionId: string) => {
    setConexionsSeleccionades(prev => 
      prev.includes(conexionId) 
        ? prev.filter(id => id !== conexionId)
        : [...prev, conexionId]
    )
  }

  const handleCompartir = async () => {
    if (conexionsSeleccionades.length === 0) return
    
    setEnviant(true)
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Compartint grup:', {
      grupo: grupo.id,
      conexions: conexionsSeleccionades,
      missatge
    })
    
    setEnviant(false)
    onClose()
    
    // Reset
    setConexionsSeleccionades([])
    setBusqueda('')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Compartir grup
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {grupo.tipo === 'publico' 
                ? `Convida les teves connexions a "${grupo.nombre}"`
                : `Recomana el grup "${grupo.nombre}" (requereix aprovació)`
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Buscador */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar connexions..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Lista de conexiones */}
        <div className="max-h-60 overflow-y-auto">
          {conexionsFiltradas.map(conexion => (
            <div
              key={conexion.id}
              className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                conexion.esMiembroDelGrupo ? 'opacity-50' : ''
              }`}
              onClick={() => !conexion.esMiembroDelGrupo && handleSeleccionarConexion(conexion.id)}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={conexion.avatar}
                  alt={conexion.nombre}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900">
                    {conexion.nombre}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {conexion.organitzacio}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {conexion.esMiembroDelGrupo ? (
                  <span className="text-xs text-gray-500 flex items-center space-x-1">
                    <Users size={12} />
                    <span>Ja és membre</span>
                  </span>
                ) : (
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    conexionsSeleccionades.includes(conexion.id)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {conexionsSeleccionades.includes(conexion.id) && (
                      <Check size={12} className="text-white" />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {conexionsSeleccionades.length > 0 && (
          <>
            {/* Mensaje */}
            <div className="p-6 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Missatge (opcional)
              </label>
              <textarea
                value={missatge}
                onChange={(e) => setMissatge(e.target.value)}
                placeholder="Escriu un missatge personalitzat..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 bg-gray-50">
              <div className="text-sm text-gray-600">
                {conexionsSeleccionades.length} connexió{conexionsSeleccionades.length !== 1 ? 's' : ''} seleccionada{conexionsSeleccionades.length !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setConexionsSeleccionades([])}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel·lar selecció
                </button>
                <button
                  onClick={handleCompartir}
                  disabled={enviant}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                  <span>
                    {enviant 
                      ? 'Enviant...' 
                      : grupo.tipo === 'publico' ? 'Convidar' : 'Recomanar'
                    }
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}