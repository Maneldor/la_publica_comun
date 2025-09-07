'use client'

import { useState } from 'react'
import { 
  X, Download, FileText, FileSpreadsheet, Image, 
  Settings, Check, Crown, Star, Clock, Calendar,
  Palette, Type, Layout
} from 'lucide-react'
import { ExportFormat, ConfiguracionExportacion, PlanEmpresa } from '../../../../tipos/analytics'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (config: ConfiguracionExportacion) => void
  planEmpresa: PlanEmpresa
}

export default function ExportModal({ isOpen, onClose, onExport, planEmpresa }: ExportModalProps) {
  const [configuracion, setConfiguracion] = useState<ConfiguracionExportacion>({
    formato: 'pdf',
    incluirGraficos: true,
    incluirTablas: true,
    incluirComparativas: planEmpresa !== 'basic',
    incluirPredicciones: planEmpresa === 'premium',
    personalizacion: {
      logo: '',
      colores: ['#4f46e5', '#06b6d4', '#10b981'],
      encabezado: 'Informe d\'Analytics'
    }
  })

  const formatosDisponibles: Array<{
    formato: ExportFormat
    nombre: string
    descripcion: string
    icon: any
    disponibleEnPlan: PlanEmpresa[]
    tamano: string
  }> = [
    {
      formato: 'pdf',
      nombre: 'PDF Professional',
      descripcion: 'Informe complet amb gràfics i anàlisi detallat',
      icon: FileText,
      disponibleEnPlan: ['basic', 'premium'],
      tamano: '~2-5 MB'
    },
    {
      formato: 'excel',
      nombre: 'Excel Avançat',
      descripcion: 'Full de càlcul amb dades processables i pivots',
      icon: FileSpreadsheet,
      disponibleEnPlan: ['premium'],
      tamano: '~500 KB - 2 MB'
    },
    {
      formato: 'csv',
      nombre: 'CSV Dades',
      descripcion: 'Dades en brut per processament extern',
      icon: FileSpreadsheet,
      disponibleEnPlan: ['basic', 'premium'],
      tamano: '~50-200 KB'
    },
    {
      formato: 'png',
      nombre: 'Imatges PNG',
      descripcion: 'Gràfics individuals en alta resolució',
      icon: Image,
      disponibleEnPlan: ['premium'],
      tamano: '~1-3 MB'
    }
  ]

  const handleExport = () => {
    onExport(configuracion)
    onClose()
  }

  const isPremium = planEmpresa === 'premium'

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Download className="w-6 h-6 text-indigo-600" />
              Exportar Informe d'Analytics
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Genera informes personalitzats segons el teu pla
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Selección de formato */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Format d'Exportació</h3>
            <div className="space-y-3">
              {formatosDisponibles.map((formato) => {
                const disponible = formato.disponibleEnPlan.includes(planEmpresa)
                const Icon = formato.icon
                
                return (
                  <div
                    key={formato.formato}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      configuracion.formato === formato.formato && disponible
                        ? 'border-indigo-500 bg-indigo-50'
                        : disponible
                        ? 'border-slate-200 hover:border-slate-300'
                        : 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
                    }`}
                    onClick={() => disponible && setConfiguracion(prev => ({
                      ...prev,
                      formato: formato.formato
                    }))}
                  >
                    {!disponible && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Premium
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-lg ${
                        configuracion.formato === formato.formato && disponible
                          ? 'bg-indigo-100'
                          : 'bg-slate-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          configuracion.formato === formato.formato && disponible
                            ? 'text-indigo-600'
                            : 'text-slate-400'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800">{formato.nombre}</h4>
                        <p className="text-sm text-slate-600 mb-2">{formato.descripcion}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>Tamany: {formato.tamano}</span>
                        </div>
                      </div>
                      
                      {configuracion.formato === formato.formato && disponible && (
                        <div className="p-1">
                          <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Opciones de contenido */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Contingut de l'Informe</h3>
            
            <div className="space-y-4">
              {/* Opciones básicas */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-700">Contingut Bàsic</h4>
                
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configuracion.incluirGraficos}
                    onChange={(e) => setConfiguracion(prev => ({
                      ...prev,
                      incluirGraficos: e.target.checked
                    }))}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <div>
                    <div className="font-medium text-slate-800">Gràfics i Visualitzacions</div>
                    <div className="text-sm text-slate-500">Inclou tots els gràfics del dashboard</div>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configuracion.incluirTablas}
                    onChange={(e) => setConfiguracion(prev => ({
                      ...prev,
                      incluirTablas: e.target.checked
                    }))}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <div>
                    <div className="font-medium text-slate-800">Taules de Dades</div>
                    <div className="text-sm text-slate-500">Dades detallades de rendiment</div>
                  </div>
                </label>
              </div>

              {/* Opciones premium */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-700 flex items-center gap-2">
                  Contingut Avançat
                  {!isPremium && <Star className="w-4 h-4 text-purple-500" />}
                </h4>
                
                <label className={`flex items-center gap-3 p-3 border rounded-lg transition-all ${
                  isPremium 
                    ? 'border-slate-200 hover:bg-slate-50 cursor-pointer' 
                    : 'border-purple-200 bg-purple-50 cursor-not-allowed'
                }`}>
                  <input
                    type="checkbox"
                    checked={configuracion.incluirComparativas}
                    onChange={(e) => isPremium && setConfiguracion(prev => ({
                      ...prev,
                      incluirComparatives: e.target.checked
                    }))}
                    disabled={!isPremium}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <div>
                    <div className={`font-medium ${isPremium ? 'text-slate-800' : 'text-purple-700'}`}>
                      Benchmarking vs Sector
                    </div>
                    <div className={`text-sm ${isPremium ? 'text-slate-500' : 'text-purple-600'}`}>
                      Comparatives amb la competència
                    </div>
                  </div>
                  {!isPremium && (
                    <div className="ml-auto">
                      <Crown className="w-4 h-4 text-purple-500" />
                    </div>
                  )}
                </label>
                
                <label className={`flex items-center gap-3 p-3 border rounded-lg transition-all ${
                  isPremium 
                    ? 'border-slate-200 hover:bg-slate-50 cursor-pointer' 
                    : 'border-purple-200 bg-purple-50 cursor-not-allowed'
                }`}>
                  <input
                    type="checkbox"
                    checked={configuracion.incluirPredicciones}
                    onChange={(e) => isPremium && setConfiguracion(prev => ({
                      ...prev,
                      incluirPredicciones: e.target.checked
                    }))}
                    disabled={!isPremium}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <div>
                    <div className={`font-medium ${isPremium ? 'text-slate-800' : 'text-purple-700'}`}>
                      Prediccions amb IA
                    </div>
                    <div className={`text-sm ${isPremium ? 'text-slate-500' : 'text-purple-600'}`}>
                      Tendències i recomanacions
                    </div>
                  </div>
                  {!isPremium && (
                    <div className="ml-auto">
                      <Crown className="w-4 h-4 text-purple-500" />
                    </div>
                  )}
                </label>
              </div>

              {/* Personalización */}
              {isPremium && (
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-700 flex items-center gap-2">
                    Personalització
                    <Palette className="w-4 h-4 text-indigo-500" />
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-2">
                        Títol de l'Informe
                      </label>
                      <input
                        type="text"
                        value={configuracion.personalizacion?.encabezado || ''}
                        onChange={(e) => setConfiguracion(prev => ({
                          ...prev,
                          personalizacion: {
                            ...prev.personalizacion!,
                            encabezado: e.target.value
                          }
                        }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Informe d'Analytics - Gener 2024"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-2">
                        Esquema de Colors
                      </label>
                      <div className="flex gap-2">
                        {['indigo', 'blue', 'purple', 'green', 'orange'].map(color => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full border-2 ${
                              configuracion.personalizacion?.colores?.[0]?.includes(color)
                                ? 'border-slate-400'
                                : 'border-slate-200'
                            }`}
                            style={{ 
                              backgroundColor: {
                                indigo: '#4f46e5',
                                blue: '#06b6d4',
                                purple: '#8b5cf6',
                                green: '#10b981',
                                orange: '#f59e0b'
                              }[color] 
                            }}
                            onClick={() => setConfiguracion(prev => ({
                              ...prev,
                              personalizacion: {
                                ...prev.personalizacion!,
                                colores: [`#${color === 'indigo' ? '4f46e5' : color === 'blue' ? '06b6d4' : color === 'purple' ? '8b5cf6' : color === 'green' ? '10b981' : 'f59e0b'}`]
                              }
                            }))}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" />
                Temps estimat: 30-60 segons
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                L'informe estarà disponible durant 7 dies
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-700 font-medium"
              >
                Cancel·lar
              </button>
              <button
                onClick={handleExport}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" />
                Generar Informe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}