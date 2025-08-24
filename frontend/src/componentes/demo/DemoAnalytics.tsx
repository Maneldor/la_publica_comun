'use client'

import { useState } from 'react'
import { AnalyticsDemo } from '../../../tipos/demo'
import { 
  BarChart3, 
  Clock, 
  Eye, 
  MousePointer,
  TrendingUp,
  Users,
  Activity,
  Target,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react'

interface DemoAnalyticsProps {
  analytics: AnalyticsDemo
}

export default function DemoAnalytics({ analytics }: DemoAnalyticsProps) {
  const [expandido, setExpandido] = useState(false)
  const [seccionActiva, setSeccionActiva] = useState<'resumen' | 'eventos' | 'interes' | 'conversion'>('resumen')
  
  // ✅ CÁLCULOS DERIVADOS
  const duracionMinutos = Math.floor(analytics.duracionTotal / 60000)
  const duracionSegundos = Math.floor((analytics.duracionTotal % 60000) / 1000)
  const eventosPorMinuto = analytics.eventos.length > 0 ? 
    (analytics.eventos.length / (analytics.duracionTotal / 60000)).toFixed(1) : '0'
  
  // Calcular distribución de eventos por tipo
  const eventosPorTipo = analytics.eventos.reduce((acc, evento) => {
    acc[evento.tipo] = (acc[evento.tipo] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Funciones más usadas
  const funcionesMasUsadas = analytics.funcionesUsadas.map(func => ({
    nombre: func,
    uso: analytics.eventos.filter(e => e.seccion === func).length
  })).sort((a, b) => b.uso - a.uso).slice(0, 5)
  
  const formatearTiempo = (ms: number) => {
    const minutos = Math.floor(ms / 60000)
    const segundos = Math.floor((ms % 60000) / 1000)
    return `${minutos}:${segundos.toString().padStart(2, '0')}`
  }
  
  const exportarDatos = () => {
    const datosExport = {
      sesionId: analytics.sesionId,
      duracionTotal: analytics.duracionTotal,
      puntuacionInteres: analytics.puntuacionInteres,
      probabilidadConversion: analytics.probabilidadConversion,
      funcionesUsadas: analytics.funcionesUsadas,
      eventos: analytics.eventos,
      resumen: {
        eventosTotales: analytics.eventos.length,
        eventosPorMinuto: parseFloat(eventosPorMinuto),
        funcionesExploradas: analytics.funcionesUsadas.length,
        tiempoPromedioPorEvento: analytics.eventos.length > 0 ? analytics.duracionTotal / analytics.eventos.length : 0
      }
    }
    
    const blob = new Blob([JSON.stringify(datosExport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `demo-analytics-${analytics.sesionId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* ✅ BOTÓN TOGGLE */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="bg-gray-900 hover:bg-gray-800 text-white p-3 rounded-lg shadow-lg transition-colors flex items-center space-x-2"
      >
        <BarChart3 className="w-5 h-5" />
        {expandido ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
      
      {/* ✅ PANEL EXPANDIDO */}
      {expandido && (
        <div className="absolute bottom-16 left-0 w-96 max-h-96 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 text-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Demo Analytics</span>
              </h3>
              <button 
                onClick={exportarDatos}
                className="text-gray-300 hover:text-white"
                title="Exportar datos"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              Sesión: {analytics.sesionId.slice(-8)}
            </p>
          </div>
          
          {/* Navegación de secciones */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: 'resumen', label: 'Resumen', icono: <BarChart3 className="w-4 h-4" /> },
                { id: 'eventos', label: 'Eventos', icono: <MousePointer className="w-4 h-4" /> },
                { id: 'interes', label: 'Interés', icono: <Target className="w-4 h-4" /> },
                { id: 'conversion', label: 'Conversión', icono: <TrendingUp className="w-4 h-4" /> }
              ].map((seccion) => (
                <button
                  key={seccion.id}
                  onClick={() => setSeccionActiva(seccion.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                    seccionActiva === seccion.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {seccion.icono}
                  <span className="hidden sm:inline">{seccion.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Contenido de la sección */}
          <div className="p-4 max-h-64 overflow-y-auto">
            {seccionActiva === 'resumen' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-4 h-4 text-blue-600 mr-1" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {duracionMinutos}:{duracionSegundos.toString().padStart(2, '0')}
                    </p>
                    <p className="text-xs text-blue-600">Duración</p>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <MousePointer className="w-4 h-4 text-green-600 mr-1" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{analytics.eventos.length}</p>
                    <p className="text-xs text-green-600">Interacciones</p>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Eye className="w-4 h-4 text-purple-600 mr-1" />
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{analytics.funcionesUsadas.length}</p>
                    <p className="text-xs text-purple-600">Secciones</p>
                  </div>
                  
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Activity className="w-4 h-4 text-orange-600 mr-1" />
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{eventosPorMinuto}</p>
                    <p className="text-xs text-orange-600">Eventos/min</p>
                  </div>
                </div>
              </div>
            )}
            
            {seccionActiva === 'eventos' && (
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700 mb-3">
                  Eventos por tipo:
                </div>
                {Object.entries(eventosPorTipo).map(([tipo, cantidad]) => (
                  <div key={tipo} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{tipo}</span>
                    <span className="text-sm font-medium text-gray-900">{cantidad}</span>
                  </div>
                ))}
                
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Últimos eventos:
                  </div>
                  <div className="space-y-2">
                    {analytics.eventos.slice(-5).map((evento, index) => (
                      <div key={index} className="text-xs text-gray-600">
                        <span className="font-medium">{evento.accion}</span>
                        <span className="mx-1">•</span>
                        <span>{evento.seccion}</span>
                        <span className="float-right text-gray-400">
                          {formatearTiempo(Date.now() - new Date(evento.timestamp).getTime())}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {seccionActiva === 'interes' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Puntuación de Interés</span>
                    <span className="text-lg font-bold text-blue-600">{analytics.puntuacionInteres}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analytics.puntuacionInteres}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-3">
                    Funciones más exploradas:
                  </div>
                  <div className="space-y-2">
                    {funcionesMasUsadas.map((func, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{func.nombre}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-green-500 h-1 rounded-full"
                              style={{ width: `${(func.uso / Math.max(...funcionesMasUsadas.map(f => f.uso))) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-6 text-right">{func.uso}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {seccionActiva === 'conversion' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Probabilidad de Conversión</span>
                    <span className="text-lg font-bold text-green-600">
                      {(analytics.probabilidadConversion * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analytics.probabilidadConversion * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Factores Positivos</span>
                    </div>
                    <ul className="text-xs text-green-700 space-y-1">
                      {analytics.duracionTotal > 120000 && <li>• Sesión prolongada (+2min)</li>}
                      {analytics.funcionesUsadas.length > 3 && <li>• Exploración amplia (+3 secciones)</li>}
                      {analytics.eventos.length > 10 && <li>• Alto engagement (+10 eventos)</li>}
                      {analytics.puntuacionInteres > 60 && <li>• Interés demostrado (60+ puntos)</li>}
                    </ul>
                  </div>
                  
                  {(analytics.probabilidadConversion < 0.5) && (
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Target className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Oportunidades</span>
                      </div>
                      <ul className="text-xs text-orange-700 space-y-1">
                        {analytics.duracionTotal < 60000 && <li>• Aumentar tiempo de exploración</li>}
                        {analytics.funcionesUsadas.length < 3 && <li>• Explorar más funcionalidades</li>}
                        {!analytics.funcionesUsadas.includes('analytics') && <li>• Ver métricas y ROI</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}