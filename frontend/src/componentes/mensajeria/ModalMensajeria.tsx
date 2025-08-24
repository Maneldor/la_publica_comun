'use client'

import { useEffect, useRef } from 'react'
import { useMensajeriaData, useMensajeriaUI, useMensajeriaConfig } from '@/contextos/MensajeriaContext'
import { X, Settings, Minimize2, Maximize2 } from 'lucide-react'
import ListaConversaciones from './ListaConversaciones'
import ChatWindow from './ChatWindow'
import CallInterface from './CallInterface'

interface ModalMensajeriaProps {
  abierto: boolean
  onCerrar: () => void
}

// ✅ COMPONENTE PRINCIPAL: Modal de mensajería con arquitectura modular
export default function ModalMensajeria({ abierto, onCerrar }: ModalMensajeriaProps) {
  const { conversaciones, trucadaActiva, finalitzarTrucada } = useMensajeriaData()
  const { 
    conversacioActiva, 
    mostrarDetallsConversa, 
    minimitzat,
    setMinimitzat
  } = useMensajeriaUI()
  const { configuracio } = useMensajeriaConfig()
  
  const modalRef = useRef<HTMLDivElement>(null)

  // ✅ EFECTO: Gestionar escape y click fuera
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && abierto && !trucadaActiva) {
        onCerrar()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && !trucadaActiva) {
        onCerrar()
      }
    }

    if (abierto) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden' // Prevenir scroll del body
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [abierto, onCerrar, trucadaActiva])

  // ✅ EFECTO: Notificaciones de escritorio
  useEffect(() => {
    if (configuracio.notificacionsDesktop && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }, [configuracio.notificacionsDesktop])

  if (!abierto) return null

  // ✅ INTERFAZ DE LLAMADA: Modo pantalla completa
  if (trucadaActiva) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <CallInterface
          trucada={trucadaActiva}
          onFinalitzar={finalitzarTrucada}
          onToggleMicrofo={() => {
            // TODO: Implement microphone toggle logic
            console.log('Toggle microphone')
          }}
          onToggleCamera={() => {
            // TODO: Implement camera toggle logic
            console.log('Toggle camera')
          }}
          onTogglePantalla={() => {
            // TODO: Implement screen share toggle logic
            console.log('Toggle screen share')
          }}
        />
      </div>
    )
  }

  const conversacioSeleccionada = conversaciones.find(c => c.id === conversacioActiva)

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
          minimitzat 
            ? 'w-80 h-96' 
            : 'w-full max-w-6xl h-full max-h-[90vh] mx-4'
        }`}
      >
        {/* ✅ HEADER DEL MODAL */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Missatgeria
            </h2>
            {conversacioSeleccionada && (
              <span className="text-sm text-gray-500">
                • {conversacioSeleccionada.nom}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Botón configuración */}
            <button
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Configuració"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Botón minimizar/maximizar */}
            <button
              onClick={() => setMinimitzat(!minimitzat)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={minimitzat ? "Maximitzar" : "Minimitzar"}
            >
              {minimitzat ? 
                <Maximize2 className="w-5 h-5 text-gray-600" /> : 
                <Minimize2 className="w-5 h-5 text-gray-600" />
              }
            </button>
            
            {/* Botón cerrar */}
            <button
              onClick={onCerrar}
              className="p-1 hover:bg-red-100 rounded transition-colors"
              title="Tancar"
            >
              <X className="w-5 h-5 text-gray-600 hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* ✅ CONTENIDO PRINCIPAL */}
        <div className={`flex h-full ${minimitzat ? 'flex-col' : ''}`} style={{ height: minimitzat ? '320px' : 'calc(100% - 73px)' }}>
          {/* ✅ PANEL IZQUIERDO: Lista de conversaciones */}
          <div className={`border-r border-gray-200 bg-white ${
            minimitzat ? 'w-full h-48' : conversacioSeleccionada ? 'w-80 flex-shrink-0' : 'w-full'
          }`}>
            <ListaConversaciones />
          </div>

          {/* ✅ PANEL CENTRAL: Chat activo */}
          {conversacioSeleccionada && !minimitzat && (
            <div className="flex-1 flex">
              <div className={`flex-1 ${mostrarDetallsConversa ? 'w-2/3' : 'w-full'}`}>
                <ChatWindow conversacio={conversacioSeleccionada} />
              </div>

              {/* ✅ PANEL DERECHO: Detalles de conversación */}
              {mostrarDetallsConversa && (
                <div className="w-1/3 border-l border-gray-200 bg-gray-50">
                  <DetallsConversacio conversacio={conversacioSeleccionada} />
                </div>
              )}
            </div>
          )}

          {/* ✅ ESTADO VACÍO */}
          {!conversacioSeleccionada && !minimitzat && (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full" />
                </div>
                <p className="text-lg font-medium">Selecciona una conversa</p>
                <p className="text-sm mt-1">
                  Tria una conversa de la llista per començar a xatejar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ✅ SUBCOMPONENTE: Detalles de conversación
interface DetallsConversacioProps {
  conversacio: any // Usar el tipo Conversacion correcto
}

function DetallsConversacio({ conversacio }: DetallsConversacioProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Detalls de la conversa</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ✅ INFORMACIÓN BÁSICA */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Informació</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Nom:</span>
              <span className="ml-2 text-gray-900">{conversacio.nom}</span>
            </div>
            <div>
              <span className="text-gray-500">Tipus:</span>
              <span className="ml-2 text-gray-900">
                {conversacio.tipus === 'grupo' ? 'Grup' : 'Individual'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Participants:</span>
              <span className="ml-2 text-gray-900">{conversacio.participants.length}</span>
            </div>
            <div>
              <span className="text-gray-500">Creada:</span>
              <span className="ml-2 text-gray-900">
                {new Date(conversacio.dataCreacio).toLocaleDateString('ca')}
              </span>
            </div>
          </div>
        </div>

        {/* ✅ CONFIGURACIÓN RÁPIDA */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Configuració</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={conversacio.silenciat}
                className="mr-2 rounded border-gray-300"
                readOnly 
              />
              <span className="text-sm text-gray-700">Silenciat</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={conversacio.fixat}
                className="mr-2 rounded border-gray-300"
                readOnly 
              />
              <span className="text-sm text-gray-700">Fixat</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={conversacio.arxivat}
                className="mr-2 rounded border-gray-300"
                readOnly 
              />
              <span className="text-sm text-gray-700">Arxivat</span>
            </label>
          </div>
        </div>

        {/* ✅ ESTADÍSTICAS */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Estadístiques</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Missatges no llegits:</span>
              <span className="text-gray-900">{conversacio.missatgesNoLlegits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Última activitat:</span>
              <span className="text-gray-900">
                {new Date(conversacio.dataUltimaActivitat).toLocaleDateString('ca')}
              </span>
            </div>
          </div>
        </div>

        {/* ✅ ACCIONES RÁPIDAS */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Accions</h4>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
              Veure arxius compartits
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
              Buscar en conversa
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
              Configurar notificacions
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">
              Eliminar conversa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}