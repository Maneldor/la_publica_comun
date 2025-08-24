'use client'

import { useState, useEffect } from 'react'
import { 
  useTraduccio, 
  useMultilingualContent, 
  useTranslationSettings,
  MultilingualContent
} from '../../../contextos/TraduccioContext'
import { ContenidoMultiidioma, IdiomaOficial } from '../../../../tipos/i18n'

// ✅ EJEMPLO PRÁCTICO DEL NUEVO SISTEMA I18N
export default function EjemploSistemaI18n() {
  const { t, tDynamic } = useTraduccio()
  const { 
    createMultilingualContent,
    translateContent,
    configuracionUsuario,
    traduciendo 
  } = useMultilingualContent()
  
  const {
    idioma,
    idiomesDisponibles,
    cambiarIdioma,
    configuracionUsuario: configUsuario,
    actualizarConfiguracionUsuario
  } = useTranslationSettings()

  // Estados para demos
  const [contenidoEjemplo, setContenidoEjemplo] = useState<ContenidoMultiidioma | null>(null)
  const [textoInput, setTextoInput] = useState('')
  const [idiomaInput, setIdiomaInput] = useState<IdiomaOficial>('es')
  const [resultadoTraduccion, setResultadoTraduccion] = useState('')

  // Crear contenido de ejemplo
  const crearContenidoEjemplo = async () => {
    if (!textoInput.trim()) return
    
    const contenido = await createMultilingualContent(
      textoInput,
      'usuario-demo',
      'post',
      idiomaInput
    )
    
    setContenidoEjemplo(contenido)
  }

  // Traducir contenido dinámico
  const probarTraduccionDinamica = async () => {
    if (!textoInput.trim()) return
    
    const resultado = await tDynamic({
      texto: textoInput,
      idiomaOriginal: idiomaInput,
      tipo: 'anuncio'  // Usar tipo válido según la interfaz
    })
    
    setResultadoTraduccion(resultado)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {t('demo.sistema_i18n_titulo', { fallback: 'Sistema de Traducción Automática - Demo' })}
      </h2>

      {/* Panel de configuración de idioma */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">
          {t('config.idioma', { fallback: 'Configuración de Idioma' })}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {idiomesDisponibles.map(lang => (
            <button
              key={lang}
              onClick={() => cambiarIdioma(lang)}
              className={`px-3 py-2 rounded ${
                idioma === lang 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        
        <p className="text-sm text-gray-600">
          Idioma actual: <span className="font-semibold">{idioma}</span>
        </p>
      </div>

      {/* Panel de configuración de usuario */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">
          {t('config.preferencias', { fallback: 'Preferencias de Traducción' })}
        </h3>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={configUsuario.traducirAutomaticamente}
              onChange={(e) => actualizarConfiguracionUsuario({
                traducirAutomaticamente: e.target.checked
              })}
              className="rounded"
            />
            <span>{t('config.traducir_automatico', { fallback: 'Traducir automáticamente' })}</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={configUsuario.mostrarIdiomaOriginal}
              onChange={(e) => actualizarConfiguracionUsuario({
                mostrarIdiomaOriginal: e.target.checked
              })}
              className="rounded"
            />
            <span>{t('config.mostrar_original', { fallback: 'Mostrar texto original' })}</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={configUsuario.priorizarContenidoEnMiIdioma}
              onChange={(e) => actualizarConfiguracionUsuario({
                priorizarContenidoEnMiIdioma: e.target.checked
              })}
              className="rounded"
            />
            <span>{t('config.priorizar_idioma', { fallback: 'Priorizar contenido en mi idioma' })}</span>
          </label>
        </div>
      </div>

      {/* Panel de prueba de traducción */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">
          {t('demo.probar_traduccion', { fallback: 'Probar Traducción Dinámica' })}
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('demo.idioma_origen', { fallback: 'Idioma de origen:' })}
            </label>
            <select
              value={idiomaInput}
              onChange={(e) => setIdiomaInput(e.target.value as IdiomaOficial)}
              className="w-full p-2 border rounded"
            >
              <option value="es">Español</option>
              <option value="ca">Català</option>
              <option value="eu">Euskera</option>
              <option value="gl">Galego</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('demo.texto_original', { fallback: 'Texto a traducir:' })}
            </label>
            <textarea
              value={textoInput}
              onChange={(e) => setTextoInput(e.target.value)}
              placeholder="Escribe aquí el texto que quieres traducir..."
              className="w-full p-2 border rounded h-20"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={probarTraduccionDinamica}
              disabled={traduciendo || !textoInput.trim()}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              {traduciendo ? 'Traduciendo...' : t('accion.traducir', { fallback: 'Traducir' })}
            </button>
            
            <button
              onClick={crearContenidoEjemplo}
              disabled={!textoInput.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {t('accion.crear_contenido', { fallback: 'Crear Contenido Multiidioma' })}
            </button>
          </div>
        </div>
        
        {resultadoTraduccion && (
          <div className="mt-4 p-3 bg-white border rounded">
            <h4 className="font-semibold mb-2">
              {t('demo.resultado_traduccion', { fallback: 'Resultado de la traducción:' })}
            </h4>
            <p className="text-gray-800">{resultadoTraduccion}</p>
          </div>
        )}
      </div>

      {/* Panel de contenido multiidioma */}
      {contenidoEjemplo && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            {t('demo.contenido_multiidioma', { fallback: 'Contenido Multiidioma' })}
          </h3>
          
          <div className="bg-white p-4 rounded border">
            <MultilingualContent
              contenido={contenidoEjemplo}
              mostrarIdiomOriginal={configUsuario.mostrarIdiomaOriginal}
              className="mb-4"
            />
            
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold text-sm text-gray-600 mb-2">
                {t('demo.metadatos', { fallback: 'Metadatos:' })}
              </h4>
              <div className="text-xs text-gray-500 space-y-1">
                <p><span className="font-semibold">ID:</span> {contenidoEjemplo.id}</p>
                <p><span className="font-semibold">Tipo:</span> {contenidoEjemplo.tipoContenido}</p>
                <p><span className="font-semibold">Idioma original:</span> {contenidoEjemplo.idiomaOriginal}</p>
                <p><span className="font-semibold">Fecha:</span> {contenidoEjemplo.fechaCreacion.toLocaleString()}</p>
                <p><span className="font-semibold">Requiere traducción:</span> {contenidoEjemplo.requiereTraduccion ? 'Sí' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información del sistema */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
        <h3 className="font-semibold mb-2">
          {t('demo.info_sistema', { fallback: 'Información del Sistema' })}
        </h3>
        <div className="text-gray-600 space-y-1">
          <p>• Idiomas soportados: {idiomesDisponibles.join(', ')}</p>
          <p>• Estado de traducción: {traduciendo ? 'Activo' : 'Inactivo'}</p>
          <p>• Configuración automática: {configuracionUsuario.traducirAutomaticamente ? 'Habilitada' : 'Deshabilitada'}</p>
        </div>
      </div>
    </div>
  )
}