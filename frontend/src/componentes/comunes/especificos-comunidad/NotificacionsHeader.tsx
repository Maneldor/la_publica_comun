'use client'

import { useState, useRef, useEffect } from 'react'
import { useNotificacions } from '../../../contextos/NotificacionsContext'
import { 
  Bell, 
  Check, 
  X, 
  User, 
  Users, 
  MessageCircle, 
  Clock,
  CheckCircle,
  UserPlus,
  Eye
} from 'lucide-react'
import { Notificacio } from '../../../../tipos/notificacions'

export default function NotificacionsHeader() {
  const [obert, setObert] = useState(false)
  const [pestanyaActiva, setPestanyaActiva] = useState<'totes' | 'solicituds' | 'missatges'>('totes')
  const dropdownRef = useRef<HTMLDivElement>(null)
  
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

  // Tancar dropdown quan es clica fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setObert(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatearTemps = (data: Date) => {
    const ara = new Date()
    const diferencia = ara.getTime() - data.getTime()
    const minuts = Math.floor(diferencia / (1000 * 60))
    const hores = Math.floor(diferencia / (1000 * 60 * 60))
    const dies = Math.floor(diferencia / (1000 * 60 * 60 * 24))

    if (minuts < 60) return `fa ${minuts}m`
    if (hores < 24) return `fa ${hores}h`
    return `fa ${dies}d`
  }

  const obtenirIconaNotificacio = (tipus: string) => {
    switch (tipus) {
      case 'solicitud-connexio':
        return <UserPlus size={16} className="text-blue-500" />
      case 'connexio-acceptada':
        return <CheckCircle size={16} className="text-green-500" />
      case 'invitacio-grup':
        return <Users size={16} className="text-purple-500" />
      case 'mencio':
        return <MessageCircle size={16} className="text-orange-500" />
      case 'missatge-nou':
        return <MessageCircle size={16} className="text-blue-500" />
      default:
        return <Bell size={16} className="text-gray-500" />
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
          notificacio.estat === 'no-llegida' ? 'bg-blue-50' : 'bg-white'
        }`}
      >
        <div className="flex items-start space-x-3">
          {/* Avatar de l'emissor */}
          <div className="flex-shrink-0">
            {notificacio.emissor.avatar ? (
              <img 
                src={notificacio.emissor.avatar} 
                alt={notificacio.emissor.nom}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header de la notificació */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                {obtenirIconaNotificacio(notificacio.tipus)}
                <span className="text-sm font-medium text-gray-900 truncate">
                  {notificacio.titol}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">
                  {formatearTemps(notificacio.data)}
                </span>
                {notificacio.estat === 'no-llegida' && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>

            {/* Contingut */}
            <p className="text-sm text-gray-600 mb-2">
              {notificacio.missatge}
            </p>

            {/* Accions específiques per sol·licituds de connexió */}
            {esSolicitudConnexio && solicitudRelacionada?.estat === 'pendent' && (
              <div className="flex space-x-2">
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

            {/* Altres accions */}
            {!esSolicitudConnexio && (
              <div className="flex items-center space-x-2 mt-2">
                {notificacio.estat === 'no-llegida' && (
                  <button
                    onClick={() => marcarComLlegida(notificacio.id)}
                    className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    <Eye size={12} />
                    <span>Marcar com llegida</span>
                  </button>
                )}
                <button
                  onClick={() => eliminarNotificacio(notificacio.id)}
                  className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-600"
                >
                  <X size={12} />
                  <span>Eliminar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const notificacionsFiltrades = () => {
    switch (pestanyaActiva) {
      case 'solicituds':
        return notificacions.filter(n => n.tipus === 'solicitud-connexio')
      case 'missatges':
        return notificacions.filter(n => n.tipus === 'missatge-nou')
      default:
        return notificacions
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botó de notificacions */}
      <button
        onClick={() => setObert(!obert)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell size={20} />
        {resum.noLlegides > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {resum.noLlegides > 99 ? '99+' : resum.noLlegides}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {obert && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header del dropdown */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notificacions</h3>
              {resum.noLlegides > 0 && (
                <button
                  onClick={marcarTotesComLlegides}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Marcar totes com llegides
                </button>
              )}
            </div>

            {/* Pestanyes */}
            <div className="flex space-x-4 mt-3">
              <button
                onClick={() => setPestanyaActiva('totes')}
                className={`text-sm pb-2 border-b-2 transition-colors ${
                  pestanyaActiva === 'totes'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                Totes ({resum.total})
              </button>
              <button
                onClick={() => setPestanyaActiva('solicituds')}
                className={`text-sm pb-2 border-b-2 transition-colors ${
                  pestanyaActiva === 'solicituds'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                Sol·licituds ({resum.solicitudsConnexio})
              </button>
              <button
                onClick={() => setPestanyaActiva('missatges')}
                className={`text-sm pb-2 border-b-2 transition-colors ${
                  pestanyaActiva === 'missatges'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                Missatges ({resum.missatges})
              </button>
            </div>
          </div>

          {/* Contingut */}
          <div className="max-h-96 overflow-y-auto">
            {notificacionsFiltrades().length > 0 ? (
              notificacionsFiltrades().map(renderNotificacio)
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell size={32} className="mx-auto text-gray-300 mb-2" />
                <p>No hi ha notificacions</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notificacions.length > 5 && (
            <div className="px-4 py-3 border-t border-gray-100 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Veure totes les notificacions
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}