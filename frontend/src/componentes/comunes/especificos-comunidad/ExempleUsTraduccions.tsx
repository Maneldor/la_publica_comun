'use client'

import { useState } from 'react'
import { useTraduccio, useT, T, useTWithVars } from '../../../contextos/TraduccioContext'

// Componente d'exemple que mostra diferents formes d'utilitzar el sistema de traducció automàtica
export default function ExempleUsTraduccions() {
  const [mostrarExemples, setMostrarExemples] = useState(false)
  const { 
    t, 
    idioma, 
    idiomesDisponibles, 
    cambiarIdioma,
    afegirTraduccions,
    estatCarrega,
    habilitatDebug 
  } = useTraduccio()
  
  // Hook simplificat només per obtenir la funció t
  const tSimple = useT()
  
  // Hook per traduccions amb variables
  const tWithVars = useTWithVars()

  const canviarIdiomaDemostracio = (nouIdioma: string) => {
    cambiarIdioma(nouIdioma as 'ca' | 'es' | 'eu' | 'gl')
  }

  const afegirTraduccioPersonalitzada = () => {
    // Exemple d'afegir traduccions dinàmicament
    const novesTraduccions = {
      'exemple.nou_text': 'Aquesta és una traducció afegida dinàmicament!',
      'exemple.benvinguda_usuari': 'Benvingut/da {{nomUsuari}}!',
      'exemple.data_actual': 'Avui és {{data}}'
    }
    afegirTraduccions(novesTraduccions)
  }

  if (estatCarrega === 'carregant') {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-blue-600">🔄 Carregant sistema de traducció...</div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🌐 Sistema de Traducció Automàtica - Exemples d'Ús
      </h2>
      
      {/* Informació bàsica */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Informació del Sistema</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Idioma actual:</span> <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{idioma}</span>
          </div>
          <div>
            <span className="font-medium">Idiomes disponibles:</span> {idiomesDisponibles.join(', ')}
          </div>
          <div>
            <span className="font-medium">Estat:</span> <span className="text-green-600">{estatCarrega}</span>
          </div>
          <div>
            <span className="font-medium">Debug:</span> <span className={habilitatDebug ? 'text-green-600' : 'text-red-600'}>{habilitatDebug ? 'Activat' : 'Desactivat'}</span>
          </div>
        </div>
      </div>

      {/* Selector d'idioma */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Canviar Idioma (Demostració)</h3>
        <div className="flex gap-2 flex-wrap">
          {idiomesDisponibles.map(lang => (
            <button
              key={lang}
              onClick={() => canviarIdiomaDemostracio(lang)}
              className={`px-3 py-1 rounded transition-colors ${
                lang === idioma 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Exemples de traduccions */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Exemples de Traduccions</h3>
          <button
            onClick={() => setMostrarExemples(!mostrarExemples)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            {mostrarExemples ? 'Amagar' : 'Mostrar'} Exemples
          </button>
        </div>

        {mostrarExemples && (
          <div className="space-y-4">
            {/* Mètode 1: Hook useTraduccio complet */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">1. Hook useTraduccio() complet</h4>
              <div className="font-mono text-sm bg-purple-100 p-2 rounded mb-2">
                {'const { t } = useTraduccio()'}
              </div>
              <div className="space-y-1">
                <div><span className="font-medium">nav.inici:</span> {t('nav.inici')}</div>
                <div><span className="font-medium">nav.configuracio:</span> {t('nav.configuracio')}</div>
                <div><span className="font-medium">action.guardar:</span> {t('action.guardar')}</div>
                <div><span className="font-medium">Amb fallback:</span> {t('clau_que_no_existeix', { fallback: 'Text per defecte' })}</div>
              </div>
            </div>

            {/* Mètode 2: Hook useT simplificat */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">2. Hook useT() simplificat</h4>
              <div className="font-mono text-sm bg-blue-100 p-2 rounded mb-2">
                {'const t = useT()'}
              </div>
              <div className="space-y-1">
                <div><span className="font-medium">nav.missatges:</span> {tSimple('nav.missatges')}</div>
                <div><span className="font-medium">nav.notificacions:</span> {tSimple('nav.notificacions')}</div>
                <div><span className="font-medium">section.comunitat:</span> {tSimple('section.comunitat')}</div>
              </div>
            </div>

            {/* Mètode 3: Component T inline */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">3. Component T inline</h4>
              <div className="font-mono text-sm bg-green-100 p-2 rounded mb-2">
                {'<T>nav.perfil</T>'}
              </div>
              <div className="space-y-1">
                <div><span className="font-medium">nav.perfil:</span> <T>nav.perfil</T></div>
                <div><span className="font-medium">nav.forums:</span> <T>nav.forums</T></div>
                <div><span className="font-medium">Amb fallback:</span> <T fallback="Fallback text">clau_inexistent</T></div>
              </div>
            </div>

            {/* Mètode 4: Traduccions amb variables */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">4. Traduccions amb Variables</h4>
              <div className="font-mono text-sm bg-orange-100 p-2 rounded mb-2">
                {'t(clau, { variables: { nom: "Marc" } })'}
              </div>
              <div className="space-y-1">
                <div>
                  <span className="font-medium">Amb variables:</span> {
                    t('form.nom', { 
                      variables: { usuari: 'Marc Amador' }, 
                      fallback: 'Hola {{usuari}}!' 
                    })
                  }
                </div>
                <div>
                  <span className="font-medium">Data actual:</span> {
                    tWithVars('exemple.data_actual', { 
                      data: new Date().toLocaleDateString('ca-ES') 
                    }, 'Avui és {{data}}')
                  }
                </div>
              </div>
            </div>

            {/* Mètode 5: Traduccions legals */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">5. Traduccions d'Avisos Legals</h4>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Títol:</span> 
                  <div className="text-sm mt-1 p-2 bg-red-100 rounded">{t('legal.privacitat_titol')}</div>
                </div>
                <div>
                  <span className="font-medium">Paràgraf 1:</span> 
                  <div className="text-sm mt-1 p-2 bg-red-100 rounded">{t('legal.privacitat_p1')}</div>
                </div>
              </div>
            </div>

            {/* Botó per afegir traduccions personalitzades */}
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-2">6. Afegir Traduccions Dinàmicament</h4>
              <button
                onClick={afegirTraduccioPersonalitzada}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors mb-2"
              >
                Afegir Traduccions Noves
              </button>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">exemple.nou_text:</span> {t('exemple.nou_text', { fallback: 'No carregat encara' })}
                </div>
                <div>
                  <span className="font-medium">exemple.benvinguda_usuari:</span> {
                    t('exemple.benvinguda_usuari', { 
                      variables: { nomUsuari: 'Maria' }, 
                      fallback: 'No carregat encara' 
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Informació d'implementació */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">💡 Com implementar en els teus components</h3>
        <div className="space-y-2 text-sm">
          <div className="font-mono bg-white p-2 rounded">
            <div className="text-green-600">// 1. Importar el hook</div>
            <div>import {'{ useT }'} from '../../../contextos/TraduccioContext'</div>
            <div className="mt-2 text-green-600">// 2. Utilitzar en el component</div>
            <div>const t = useT()</div>
            <div className="mt-2 text-green-600">// 3. Utilitzar les traduccions</div>
            <div>{'<h1>{t("nav.inici")}</h1>'}</div>
          </div>
          <div className="mt-3 p-2 bg-blue-100 rounded text-blue-800">
            <strong>Nota:</strong> Totes les claus de traducció segueixen el patró punt: 'secció.element'. 
            Si una traducció no es troba, es mostrarà la clau o el fallback si s'especifica.
          </div>
        </div>
      </div>
    </div>
  )
}