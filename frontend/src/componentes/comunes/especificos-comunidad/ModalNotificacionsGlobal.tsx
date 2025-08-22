'use client'

import { useState, useRef } from 'react'
import { X, Bell, Check, CheckCircle, UserPlus, MessageCircle, Users, Clock, Eye, Trash2, BellOff } from 'lucide-react'
import { useNotificacions } from '../../../contextos/NotificacionsContext'
import { Notificacio } from '../../../../tipos/notificacions'
import { audioNotificacions } from '../../../utils/audioNotificacions'

interface ModalNotificacionsGlobalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ModalNotificacionsGlobal({ isOpen, onClose }: ModalNotificacionsGlobalProps) {
  const [filtreActiu, setFiltreActiu] = useState<'totes' | 'no-llegides' | 'solicituds' | 'missatges' | 'grups'>('totes')
  const [mostrarPanelSons, setMostrarPanelSons] = useState(false)
  
  const { 
    notificacions, 
    solicituds, 
    resum,
    marcarComLlegida,
    marcarTotesComLlegides,
    eliminarNotificacio,
    acceptarSolicitud,
    rebutjarSolicitud
  } = useNotificacions()

  const formatearTemps = (data: Date) => {
    const ara = new Date()
    const diferencia = ara.getTime() - data.getTime()
    const minuts = Math.floor(diferencia / (1000 * 60))
    const hores = Math.floor(diferencia / (1000 * 60 * 60))
    const dies = Math.floor(diferencia / (1000 * 60 * 60 * 24))

    if (minuts < 1) return 'ara mateix'
    if (minuts < 60) return `fa ${minuts}m`
    if (hores < 24) return `fa ${hores}h`
    return `fa ${dies}d`
  }

  const obtenirIconaNotificacio = (tipus: string) => {
    switch (tipus) {
      case 'solicitud-connexio':
        return <UserPlus size={20} className="text-blue-500" />
      case 'connexio-acceptada':
        return <CheckCircle size={20} className="text-green-500" />
      case 'invitacio-grup':
        return <Users size={20} className="text-purple-500" />
      case 'mencio':
        return <MessageCircle size={20} className="text-orange-500" />
      case 'missatge-nou':
        return <MessageCircle size={20} className="text-blue-500" />
      default:
        return <Bell size={20} className="text-gray-500" />
    }
  }

  const notificacionsFiltrades = () => {
    switch (filtreActiu) {
      case 'no-llegides':
        return notificacions.filter(n => n.estat === 'no-llegida')
      case 'solicituds':
        return notificacions.filter(n => n.tipus === 'solicitud-connexio')
      case 'missatges':
        return notificacions.filter(n => n.tipus === 'missatge-nou')
      case 'grups':
        return notificacions.filter(n => n.tipus === 'invitacio-grup')
      default:
        return notificacions
    }
  }

  const navegarAEnllaç = (notificacio: Notificacio) => {
    if (notificacio.accio) {
      switch (notificacio.accio.tipus as any) {
        case 'veure-missatge':
          window.location.href = `/missatges/${notificacio.metadata?.conversaId || notificacio.emissor.id}`
          break
        case 'veure-grup':
          window.location.href = `/grupos-avanzados?grup=${notificacio.metadata?.grupId}`
          break
        case 'veure-perfil':
          window.location.href = `/perfil/${notificacio.emissor.id}`
          break
        default:
          console.log(`Navegant: ${notificacio.accio.tipus}`, notificacio.accio.dades)
      }
    }
  }

  const renderNotificacio = (notificacio: Notificacio) => {
    const esSolicitudConnexio = notificacio.tipus === 'solicitud-connexio'
    const solicitudRelacionada = esSolicitudConnexio ? 
      solicituds.find(s => s.id === notificacio.accio?.dades?.solicitudId) : null

    return (
      <div
        key={notificacio.id}
        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
          notificacio.estat === 'no-llegida' ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white'
        }`}
      >
        <div className="flex items-start space-x-3">
          {/* Avatar de l'emissor */}
          <div className="flex-shrink-0">
            {notificacio.emissor.avatar ? (
              <img 
                src={notificacio.emissor.avatar} 
                alt={notificacio.emissor.nom}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {notificacio.emissor.nom.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header de la notificació */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {obtenirIconaNotificacio(notificacio.tipus)}
                <span className="text-sm font-semibold text-gray-900">
                  {notificacio.titol}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-right">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatearTemps(notificacio.data)}
                </span>
                {notificacio.estat === 'no-llegida' && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                )}
              </div>
            </div>

            {/* Nom de l'emissor i contingut */}
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-900 mb-1">
                {notificacio.emissor.nom}
              </p>
              <p className="text-sm text-gray-600">
                {notificacio.missatge}
              </p>
            </div>

            {/* Accions específiques per sol·licituds de connexió */}
            {esSolicitudConnexio && solicitudRelacionada?.estat === 'pendent' && (
              <div className="flex space-x-2 mb-2">
                <button
                  onClick={() => acceptarSolicitud(solicitudRelacionada.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Check size={12} />
                  <span>Acceptar</span>
                </button>
                <button
                  onClick={() => rebutjarSolicitud(solicitudRelacionada.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X size={12} />
                  <span>Rebutjar</span>
                </button>
              </div>
            )}

            {/* Accions generals */}
            <div className="flex items-center space-x-3 text-xs">
              {notificacio.accio && (
                <button
                  onClick={() => {
                    navegarAEnllaç(notificacio)
                    marcarComLlegida(notificacio.id)
                    onClose()
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Veure
                </button>
              )}
              
              {notificacio.estat === 'no-llegida' && (
                <button
                  onClick={() => marcarComLlegida(notificacio.id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                >
                  <Eye size={10} />
                  <span>Marcar com llegida</span>
                </button>
              )}
              
              <button
                onClick={() => eliminarNotificacio(notificacio.id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-600"
              >
                <Trash2 size={10} />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal principal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 
              onDoubleClick={() => setMostrarPanelSons(!mostrarPanelSons)}
              className="text-2xl font-semibold text-gray-900 cursor-pointer select-none"
              title="Doble clic per accedir al panel de sons"
            >
              Notificacions
            </h2>
            {resum.noLlegides > 0 && (
              <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full">
                {resum.noLlegides}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const newState = !audioNotificacions.isEnabled()
                audioNotificacions.setEnabled(newState)
                if (newState) audioNotificacions.playExit()
              }}
              className={`p-2 rounded-lg transition-colors ${
                audioNotificacions.isEnabled() 
                  ? 'text-blue-600 hover:bg-blue-50' 
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
              title={audioNotificacions.isEnabled() ? 'Desactivar sons' : 'Activar sons'}
            >
              {audioNotificacions.isEnabled() ? (
                <Bell className="w-5 h-5" />
              ) : (
                <BellOff className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Filtres i accions */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setFiltreActiu('totes')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  filtreActiu === 'totes'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                Totes ({resum.total})
              </button>
              <button
                onClick={() => setFiltreActiu('no-llegides')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  filtreActiu === 'no-llegides'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                No llegides ({resum.noLlegides})
              </button>
              <button
                onClick={() => setFiltreActiu('solicituds')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  filtreActiu === 'solicituds'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                Sol·licituds ({resum.solicitudsConnexio})
              </button>
              <button
                onClick={() => setFiltreActiu('missatges')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  filtreActiu === 'missatges'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                Missatges ({resum.missatges})
              </button>
              <button
                onClick={() => setFiltreActiu('grups')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  filtreActiu === 'grups'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                Grups ({resum.grups})
              </button>
            </div>

            {resum.noLlegides > 0 && (
              <button
                onClick={marcarTotesComLlegides}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <CheckCircle size={16} />
                <span>Marcar totes com llegides</span>
              </button>
            )}
          </div>
        </div>

        {/* Llista de notificacions */}
        <div className="flex-1 overflow-y-auto">
          {notificacionsFiltrades().length > 0 ? (
            <div className="divide-y">
              {notificacionsFiltrades().map(renderNotificacio)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Bell className="w-20 h-20 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {filtreActiu === 'totes' ? 'No tens notificacions' : `No tens notificacions ${filtreActiu === 'no-llegides' ? 'no llegides' : `de tipus "${filtreActiu}"`}`}
              </h3>
              <p className="text-gray-600 max-w-md">
                {filtreActiu === 'totes' 
                  ? 'Quan rebis notificacions apareixeran aquí.'
                  : `Quan rebis notificacions ${filtreActiu === 'no-llegides' ? 'noves' : `de tipus "${filtreActiu}"`} apareixeran aquí.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Panel de pruebas de sonidos (debug) */}
        {mostrarPanelSons && (
          <div className="px-6 py-4 border-t bg-yellow-50">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">🔊 Panel de Proves de Sons</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => audioNotificacions.playNotificacio()}
                className="px-3 py-2 text-xs bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
              >
                🔔 Notificació
              </button>
              <button
                onClick={() => audioNotificacions.playMissatgeEnviat()}
                className="px-3 py-2 text-xs bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
              >
                📤 Missatge Enviat
              </button>
              <button
                onClick={() => audioNotificacions.playMissatgeRebut()}
                className="px-3 py-2 text-xs bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
              >
                📥 Missatge Rebut
              </button>
              <button
                onClick={() => audioNotificacions.playTrucadaEntrant()}
                className="px-3 py-2 text-xs bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                📞 Trucada
              </button>
              <button
                onClick={() => audioNotificacions.playMencio()}
                className="px-3 py-2 text-xs bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors"
              >
                💬 Menció
              </button>
              <button
                onClick={() => audioNotificacions.playExit()}
                className="px-3 py-2 text-xs bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors"
              >
                ✅ Èxit
              </button>
              <button
                onClick={() => audioNotificacions.playError()}
                className="px-3 py-2 text-xs bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
              >
                ❌ Error
              </button>
              <button
                onClick={() => setMostrarPanelSons(false)}
                className="px-3 py-2 text-xs bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ❌ Tancar
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              💡 Estat dels sons: <strong>{audioNotificacions.isEnabled() ? 'Activats' : 'Desactivats'}</strong>
            </p>
          </div>
        )}

        {/* Footer */}
        {notificacions.length > 0 && (
          <div className="px-6 py-4 border-t bg-gray-50 text-center">
            <button 
              onClick={() => {
                // Simular navegació a historial complet de notificacions
                console.log('Navegant al historial complet de notificacions')
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Veure historial complet
            </button>
          </div>
        )}
      </div>
    </div>
  )
}