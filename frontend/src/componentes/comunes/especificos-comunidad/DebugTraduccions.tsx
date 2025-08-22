'use client'

import { useState } from 'react'
import { useTraduccio } from '../../../contextos/TraduccioContext'

interface DebugTraduccionsProps {
  visible?: boolean
  posicio?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export default function DebugTraduccions({ 
  visible = false, 
  posicio = 'bottom-right' 
}: DebugTraduccionsProps) {
  const [obert, setObert] = useState(false)
  const [pestanyaActiva, setPestanyaActiva] = useState<'general' | 'traduccions' | 'manuals'>('general')
  
  const { 
    t, 
    idioma, 
    idiomesDisponibles, 
    estatCarrega,
    obtenirEstadistiques,
    habilitatDebug,
    toggleDebug,
    afegirTraduccions
  } = useTraduccio()

  const [clauManual, setClauManual] = useState('')
  const [traduccioManual, setTraduccioManual] = useState('')

  if (!visible && !habilitatDebug) return null

  const estadistiques = obtenirEstadistiques()
  
  const posicioClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  const afegirTraduccioManual = () => {
    if (clauManual && traduccioManual) {
      afegirTraduccions({ [clauManual]: traduccioManual })
      setClauManual('')
      setTraduccioManual('')
    }
  }

  return (
    <div className={`fixed ${posicioClasses[posicio]} z-50`}>
      {/* Botón toggle */}
      <button
        onClick={() => setObert(!obert)}
        className={`mb-2 px-3 py-2 rounded-lg font-mono text-xs border-2 transition-all ${
          habilitatDebug 
            ? 'bg-green-500 text-white border-green-600 shadow-lg' 
            : 'bg-gray-600 text-gray-200 border-gray-700'
        }`}
        title={habilitatDebug ? 'Debug Traduccions ACTIVAT' : 'Debug Traduccions'}
      >
        🌐 {habilitatDebug ? 'ON' : 'OFF'}
      </button>

      {/* Panel de debug */}
      {obert && (
        <div className="bg-gray-900 text-green-400 rounded-lg border border-green-500 shadow-2xl font-mono text-xs max-w-md max-h-96 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 px-4 py-2 border-b border-green-500 flex justify-between items-center">
            <span className="text-green-300 font-bold">🌐 Debug Traduccions</span>
            <div className="flex gap-2">
              <button
                onClick={toggleDebug}
                className={`px-2 py-1 rounded text-xs ${
                  habilitatDebug ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                }`}
              >
                {habilitatDebug ? 'OFF' : 'ON'}
              </button>
              <button
                onClick={() => setObert(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            {[
              { id: 'general', nom: 'General' },
              { id: 'traduccions', nom: 'Traduccions' },
              { id: 'manuals', nom: 'Afegir' }
            ].map(pestanya => (
              <button
                key={pestanya.id}
                onClick={() => setPestanyaActiva(pestanya.id as any)}
                className={`px-3 py-2 text-xs border-r border-gray-700 ${
                  pestanyaActiva === pestanya.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {pestanya.nom}
              </button>
            ))}
          </div>

          {/* Contingut */}
          <div className="p-3 max-h-64 overflow-y-auto">
            {pestanyaActiva === 'general' && (
              <div className="space-y-2">
                <div>
                  <span className="text-yellow-400">Idioma:</span> <span className="text-white">{idioma}</span>
                </div>
                <div>
                  <span className="text-yellow-400">Estat:</span> <span className="text-white">{estatCarrega}</span>
                </div>
                <div>
                  <span className="text-yellow-400">Idiomes:</span> <span className="text-white">{idiomesDisponibles.join(', ')}</span>
                </div>
                <div>
                  <span className="text-yellow-400">Total claus:</span> <span className="text-white">{estadistiques.totalClaus}</span>
                </div>
                <div>
                  <span className="text-yellow-400">Debug:</span> 
                  <span className={habilitatDebug ? 'text-green-400' : 'text-red-400'}>
                    {habilitatDebug ? ' ACTIVAT' : ' DESACTIVAT'}
                  </span>
                </div>
                
                <div className="mt-3">
                  <div className="text-yellow-400 mb-1">Traduccions per idioma:</div>
                  {Object.entries(estadistiques.traduccionsPerIdioma).map(([lang, count]) => (
                    <div key={lang} className="ml-2">
                      <span className="text-blue-400">{lang}:</span> <span className="text-white">{count}</span>
                    </div>
                  ))}
                </div>

                {estadistiques.clausSenseTraduccion.length > 0 && (
                  <div className="mt-3">
                    <div className="text-red-400 mb-1">Claus sense traducció:</div>
                    <div className="max-h-20 overflow-y-auto">
                      {estadistiques.clausSenseTraduccion.slice(0, 5).map(clau => (
                        <div key={clau} className="ml-2 text-red-300">{clau}</div>
                      ))}
                      {estadistiques.clausSenseTraduccion.length > 5 && (
                        <div className="ml-2 text-gray-500">...i {estadistiques.clausSenseTraduccion.length - 5} més</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {pestanyaActiva === 'traduccions' && (
              <div className="space-y-2">
                <div className="text-yellow-400 mb-2">Proves ràpides:</div>
                {[
                  'nav.inici',
                  'nav.configuracio',
                  'action.guardar',
                  'legal.privacitat_titol',
                  'clau_inexistent'
                ].map(clau => (
                  <div key={clau} className="border-b border-gray-700 pb-1">
                    <div className="text-blue-400 text-[10px]">{clau}:</div>
                    <div className="text-white ml-2">{t(clau)}</div>
                  </div>
                ))}
              </div>
            )}

            {pestanyaActiva === 'manuals' && (
              <div className="space-y-3">
                <div className="text-yellow-400 mb-2">Afegir traducció manual:</div>
                <div>
                  <input
                    type="text"
                    placeholder="Clau (ex: nav.nou_element)"
                    value={clauManual}
                    onChange={(e) => setClauManual(e.target.value)}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-xs"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Traducció"
                    value={traduccioManual}
                    onChange={(e) => setTraduccioManual(e.target.value)}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-xs"
                  />
                </div>
                <button
                  onClick={afegirTraduccioManual}
                  disabled={!clauManual || !traduccioManual}
                  className="w-full px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Afegir per {idioma}
                </button>
                <div className="text-gray-500 text-[10px] mt-2">
                  Les traduccions afegides manualment es perden en recarregar la pàgina.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}