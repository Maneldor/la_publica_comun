'use client'

import { useMensajeriaData, useMensajeriaUI } from '@/contextos/MensajeriaContext'
import { Conversacion, FiltresMensajeria } from '../../../tipos/mensajes'
import { ChevronDown, Search, MessageCircle, Users, Archive, Pin } from 'lucide-react'
import { useState, useMemo } from 'react'

// ✅ COMPONENTE OPTIMIZADO: Lista de conversaciones con filtrado inteligente
export default function ListaConversaciones() {
  const { conversaciones, cargando } = useMensajeriaData()
  const { conversacioActiva, seleccionarConversacio, filtres, setFiltres } = useMensajeriaUI()
  const [mostrarFiltresAvanzados, setMostrarFiltresAvanzados] = useState(false)

  // ✅ TÉCNICA: Filtrado memoizado para evitar recálculos
  const conversacionsFiltradas = useMemo(() => {
    return conversaciones.filter(conv => {
      // Filtro de búsqueda
      if (filtres.cerca) {
        const textoBusqueda = filtres.cerca.toLowerCase()
        const coincideTitulo = conv.nom?.toLowerCase().includes(textoBusqueda)
        const coincideUltimoMensaje = conv.ultimMissatge?.text.toLowerCase().includes(textoBusqueda)
        if (!coincideTitulo && !coincideUltimoMensaje) return false
      }

      // Filtro por tipo
      if (filtres.tipus !== 'tots' && conv.tipus !== filtres.tipus as any) return false

      // Filtro por estado
      if (filtres.estat === 'arxivats' && !conv.arxivat) return false
      if (filtres.estat === 'actius' && conv.arxivat) return false

      // Filtro por no leídos
      if (filtres.mostrarNomesNoLlegits && conv.missatgesNoLlegits === 0) return false

      // Filtro por período
      if (filtres.periode !== 'tots') {
        const ara = new Date()
        const ultimaActivitat = new Date(conv.dataUltimaActivitat)
        const diferenciaDias = (ara.getTime() - ultimaActivitat.getTime()) / (1000 * 3600 * 24)

        switch (filtres.periode) {
          case 'avui':
            if (diferenciaDias > 1) return false
            break
          case 'setmana':
            if (diferenciaDias > 7) return false
            break
          case 'mes':
            if (diferenciaDias > 30) return false
            break
        }
      }

      return true
    }).sort((a, b) => {
      // Primero las fijadas
      if (a.fixat && !b.fixat) return -1
      if (!a.fixat && b.fixat) return 1
      
      // Luego por última actividad
      return new Date(b.dataUltimaActivitat).getTime() - new Date(a.dataUltimaActivitat).getTime()
    })
  }, [conversaciones, filtres])

  const handleCanviarFiltre = (canvis: Partial<FiltresMensajeria>) => {
    setFiltres({ ...filtres, ...canvis })
  }

  const formatearTemps = (data: Date) => {
    const ara = new Date()
    const diferencia = ara.getTime() - new Date(data).getTime()
    const dies = Math.floor(diferencia / (1000 * 3600 * 24))

    if (dies === 0) {
      const hores = Math.floor(diferencia / (1000 * 3600))
      if (hores === 0) {
        const minuts = Math.floor(diferencia / (1000 * 60))
        return minuts < 1 ? 'ara' : `${minuts}m`
      }
      return `${hores}h`
    }

    if (dies < 7) return `${dies}d`
    
    return new Date(data).toLocaleDateString('ca', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  if (cargando) {
    return (
      <div className="flex-1 p-4 space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 rounded-lg animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
            <div className="w-8 h-3 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* ✅ BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={filtres.cerca}
            onChange={(e) => handleCanviarFiltre({ cerca: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => handleCanviarFiltre({ tipus: filtres.tipus === 'tots' ? 'individuals' : 'tots' })}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                filtres.tipus === 'individuals' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MessageCircle className="w-3 h-3 inline mr-1" />
              Individuals
            </button>
            <button
              onClick={() => handleCanviarFiltre({ tipus: filtres.tipus === 'tots' ? 'grups' : 'tots' })}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                filtres.tipus === 'grups' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="w-3 h-3 inline mr-1" />
              Grups
            </button>
          </div>

          <button
            onClick={() => setMostrarFiltresAvanzados(!mostrarFiltresAvanzados)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
              mostrarFiltresAvanzados ? 'rotate-180' : ''
            }`} />
          </button>
        </div>

        {/* ✅ FILTROS AVANZADOS */}
        {mostrarFiltresAvanzados && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={filtres.mostrarNomesNoLlegits}
                  onChange={(e) => handleCanviarFiltre({ mostrarNomesNoLlegits: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span>No llegits</span>
              </label>

              <select
                value={filtres.periode}
                onChange={(e) => handleCanviarFiltre({ periode: e.target.value as any })}
                className="text-xs border border-gray-200 rounded px-2 py-1"
              >
                <option value="tots">Tot el temps</option>
                <option value="avui">Avui</option>
                <option value="setmana">Aquesta setmana</option>
                <option value="mes">Aquest mes</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ✅ LISTA DE CONVERSACIONES */}
      <div className="flex-1 overflow-y-auto">
        {conversacionsFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageCircle className="w-12 h-12 mb-2 text-gray-300" />
            <p className="text-sm">No hi ha conversacions</p>
            {filtres.cerca && (
              <p className="text-xs mt-1">
                Prova a canviar els filtres de cerca
              </p>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {conversacionsFiltradas.map((conversacio: any) => (
              <ConversacioItem
                key={conversacio.id}
                conversacio={conversacio}
                esActiva={conversacio.id === conversacioActiva}
                onSeleccionar={() => seleccionarConversacio(conversacio.id)}
                formatearTemps={formatearTemps}
              />
            ))}
          </div>
        )}
      </div>

      {/* ✅ ESTADÍSTICAS RÁPIDAS */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>
            {conversacionsFiltradas.length} de {conversaciones.length} conversacions
          </span>
          <span>
            {conversaciones.reduce((total, conv) => total + conv.missatgesNoLlegits, 0)} no llegits
          </span>
        </div>
      </div>
    </div>
  )
}

// ✅ SUBCOMPONENTE: Item de conversación optimizado
interface ConversacioItemProps {
  conversacio: Conversacion
  esActiva: boolean
  onSeleccionar: () => void
  formatearTemps: (data: Date) => string
}

function ConversacioItem({ conversacio, esActiva, onSeleccionar, formatearTemps }: ConversacioItemProps) {
  const avatar = conversacio.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversacio.nom || 'Usuario')}&background=random`

  return (
    <div
      onClick={onSeleccionar}
      className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
        esActiva 
          ? 'bg-blue-50 border-l-4 border-l-blue-500' 
          : 'hover:bg-gray-50'
      }`}
    >
      {/* ✅ AVATAR CON ESTADO */}
      <div className="relative flex-shrink-0">
        <img
          src={avatar}
          alt={conversacio.nom}
          className="w-12 h-12 rounded-full object-cover"
        />
        {conversacio.fixat && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
            <Pin className="w-2 h-2 text-white" />
          </div>
        )}
        {conversacio.arxivat && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
            <Archive className="w-2 h-2 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* ✅ NOMBRE Y ESTADO */}
        <div className="flex items-center justify-between">
          <h3 className={`font-medium text-sm truncate ${
            conversacio.missatgesNoLlegits > 0 ? 'text-gray-900' : 'text-gray-700'
          }`}>
            {conversacio.nom || 'Conversa sense nom'}
            {conversacio.tipus === 'grupo' && (
              <Users className="w-3 h-3 inline ml-1 text-gray-400" />
            )}
          </h3>
          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
            {formatearTemps(conversacio.dataUltimaActivitat)}
          </span>
        </div>

        {/* ✅ ÚLTIMO MENSAJE */}
        <div className="flex items-center justify-between mt-1">
          <p className={`text-xs truncate ${
            conversacio.missatgesNoLlegits > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'
          }`}>
            {conversacio.ultimMissatge ? (
              <>
                {conversacio.tipus === 'grupo' && (
                  <span className="text-gray-400">
                    {conversacio.ultimMissatge.autorNom}:{' '}
                  </span>
                )}
                {conversacio.ultimMissatge.tipus === 'text' 
                  ? conversacio.ultimMissatge.text 
                  : `📎 ${conversacio.ultimMissatge.tipus}`
                }
              </>
            ) : (
              'Cap missatge encara'
            )}
          </p>

          {/* ✅ BADGES */}
          <div className="flex items-center space-x-1">
            {conversacio.silenciat && (
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            )}
            {conversacio.missatgesNoLlegits > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                {conversacio.missatgesNoLlegits > 99 ? '99+' : conversacio.missatgesNoLlegits}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}