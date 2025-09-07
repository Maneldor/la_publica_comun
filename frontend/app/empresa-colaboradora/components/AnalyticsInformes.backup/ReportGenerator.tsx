'use client'

import { useState } from 'react'
import {
  FileText, Download, Settings, Calendar, Clock, Users,
  TrendingUp, Target, Award, BarChart3, PieChart, Activity,
  Globe, Map, Loader2, CheckCircle, AlertCircle, X, 
  Star, Crown, Zap, Brain, ChevronRight, Mail, Share2
} from 'lucide-react'
import { DashboardAnalytics, PlanEmpresa } from '../../../../tipos/analytics'

interface ReportGeneratorProps {
  data: DashboardAnalytics
  planEmpresa: PlanEmpresa
  empresaInfo: {
    nombre: string
    logo?: string
    color?: string
  }
  onClose: () => void
}

interface ReportConfig {
  periodo: {
    inicio: string
    fin: string
  }
  formato: 'pdf' | 'excel' | 'ambos'
  secciones: {
    portada: boolean
    executiveSummary: boolean
    rendimientoGlobal: boolean
    analisisOfertas: boolean
    audienciaSegmentacion: boolean
    benchmarking: boolean
    recomendaciones: boolean
    anexos: boolean
  }
  branding: {
    incluirLogo: boolean
    colorPrimario: string
    colorSecundario: string
  }
  envio: {
    email: boolean
    destinatarios: string[]
    programado: boolean
    frecuencia?: 'semanal' | 'mensual' | 'trimestral'
  }
}

export default function ReportGenerator({ 
  data, 
  planEmpresa, 
  empresaInfo,
  onClose 
}: ReportGeneratorProps) {
  const [step, setStep] = useState<'config' | 'generating' | 'complete'>('config')
  const [progress, setProgress] = useState(0)
  const [reportUrl, setReportUrl] = useState<string>('')
  
  const [config, setConfig] = useState<ReportConfig>({
    periodo: {
      inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      fin: new Date().toISOString().split('T')[0]
    },
    formato: planEmpresa === 'premium' ? 'ambos' : 'pdf',
    secciones: {
      portada: true,
      executiveSummary: true,
      rendimientoGlobal: true,
      analisisOfertas: true,
      audienciaSegmentacion: true,
      benchmarking: planEmpresa === 'premium',
      recomendaciones: true,
      anexos: planEmpresa === 'premium'
    },
    branding: {
      incluirLogo: true,
      colorPrimario: empresaInfo.color || '#4f46e5',
      colorSecundario: '#06b6d4'
    },
    envio: {
      email: false,
      destinatarios: [],
      programado: false
    }
  })

  const generateReport = async () => {
    setStep('generating')
    setProgress(0)

    // Simulación de generación del informe
    const steps = [
      { name: 'Recopilant dades...', progress: 20 },
      { name: 'Generant gràfics...', progress: 40 },
      { name: 'Analitzant mètriques...', progress: 60 },
      { name: 'Creant document...', progress: 80 },
      { name: 'Finalitzant...', progress: 100 }
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProgress(step.progress)
    }

    // En producción, aquí se generaría el PDF real
    setReportUrl('/api/reports/download/sample.pdf')
    setStep('complete')
  }

  const isPremium = planEmpresa === 'premium'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Generador d'Informes Professional</h2>
                <p className="text-blue-100 mt-1">
                  Crea informes detallats del rendiment de les teves ofertes
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {step === 'config' && (
            <div className="space-y-6">
              {/* Período */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Període de l'Informe
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Data d'inici
                    </label>
                    <input
                      type="date"
                      value={config.periodo.inicio}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        periodo: { ...prev.periodo, inicio: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Data de fi
                    </label>
                    <input
                      type="date"
                      value={config.periodo.fin}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        periodo: { ...prev.periodo, fin: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Formato */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  Format d'Exportació
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, formato: 'pdf' }))}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      config.formato === 'pdf' || config.formato === 'ambos'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <FileText className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                    <div className="font-semibold text-slate-800">PDF</div>
                    <div className="text-xs text-slate-500">Document professional</div>
                  </button>
                  
                  <button
                    onClick={() => isPremium && setConfig(prev => ({ ...prev, formato: 'excel' }))}
                    className={`p-4 border-2 rounded-xl transition-all relative ${
                      !isPremium ? 'opacity-60 cursor-not-allowed' : ''
                    } ${
                      config.formato === 'excel' || config.formato === 'ambos'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {!isPremium && (
                      <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                        <Crown className="w-3 h-3 inline" />
                      </div>
                    )}
                    <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold text-slate-800">Excel</div>
                    <div className="text-xs text-slate-500">Dades processables</div>
                  </button>
                  
                  <button
                    onClick={() => isPremium && setConfig(prev => ({ ...prev, formato: 'ambos' }))}
                    className={`p-4 border-2 rounded-xl transition-all relative ${
                      !isPremium ? 'opacity-60 cursor-not-allowed' : ''
                    } ${
                      config.formato === 'ambos'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {!isPremium && (
                      <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                        <Crown className="w-3 h-3 inline" />
                      </div>
                    )}
                    <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="font-semibold text-slate-800">Ambdós</div>
                    <div className="text-xs text-slate-500">Complet</div>
                  </button>
                </div>
              </div>

              {/* Secciones */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  Seccions a Incloure
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries({
                    portada: { name: 'Portada Professional', icon: FileText, basic: true },
                    executiveSummary: { name: 'Executive Summary', icon: TrendingUp, basic: true },
                    rendimientoGlobal: { name: 'Rendiment Global', icon: Globe, basic: true },
                    analisisOfertas: { name: 'Anàlisi d\'Ofertes', icon: Target, basic: true },
                    audienciaSegmentacion: { name: 'Audiència i Segmentació', icon: Users, basic: true },
                    benchmarking: { name: 'Benchmarking Sectorial', icon: Award, basic: false },
                    recomendaciones: { name: 'Recomanacions Estratègiques', icon: Brain, basic: true },
                    anexos: { name: 'Annexos i Dades Raw', icon: Activity, basic: false }
                  }).map(([key, section]) => {
                    const Icon = section.icon
                    const isAvailable = section.basic || isPremium
                    
                    return (
                      <label
                        key={key}
                        className={`flex items-center gap-3 p-3 border rounded-lg transition-all cursor-pointer ${
                          isAvailable
                            ? 'border-slate-200 hover:bg-slate-50'
                            : 'border-purple-200 bg-purple-50 cursor-not-allowed'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={config.secciones[key as keyof typeof config.secciones]}
                          onChange={(e) => isAvailable && setConfig(prev => ({
                            ...prev,
                            secciones: {
                              ...prev.secciones,
                              [key]: e.target.checked
                            }
                          }))}
                          disabled={!isAvailable}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <Icon className={`w-5 h-5 ${isAvailable ? 'text-slate-600' : 'text-purple-600'}`} />
                        <div className="flex-1">
                          <div className={`font-medium ${isAvailable ? 'text-slate-800' : 'text-purple-700'}`}>
                            {section.name}
                          </div>
                        </div>
                        {!section.basic && !isPremium && (
                          <Crown className="w-4 h-4 text-purple-500" />
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Branding */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  Personalització de Marca
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={config.branding.incluirLogo}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        branding: {
                          ...prev.branding,
                          incluirLogo: e.target.checked
                        }
                      }))}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <span className="font-medium text-slate-700">Incloure logo de l'empresa</span>
                  </label>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Color primari
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.branding.colorPrimario}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              colorPrimario: e.target.value
                            }
                          }))}
                          className="w-12 h-12 border border-slate-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.branding.colorPrimario}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              colorPrimario: e.target.value
                            }
                          }))}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Color secundari
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.branding.colorSecundario}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              colorSecundario: e.target.value
                            }
                          }))}
                          className="w-12 h-12 border border-slate-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={config.branding.colorSecundario}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              colorSecundario: e.target.value
                            }
                          }))}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Envío Premium */}
              {isPremium && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    Opcions d'Enviament
                    <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                      Premium
                    </span>
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={config.envio.email}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          envio: {
                            ...prev.envio,
                            email: e.target.checked
                          }
                        }))}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <span className="font-medium text-slate-700">Enviar per email als stakeholders</span>
                    </label>
                    
                    {config.envio.email && (
                      <div className="ml-7 space-y-3">
                        <input
                          type="email"
                          placeholder="emails@empresa.com (separats per comes)"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        />
                        
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={config.envio.programado}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              envio: {
                                ...prev.envio,
                                programado: e.target.checked
                              }
                            }))}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-slate-700">Programar enviament automàtic</span>
                        </label>
                        
                        {config.envio.programado && (
                          <select 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              envio: {
                                ...prev.envio,
                                frecuencia: e.target.value as 'semanal' | 'mensual' | 'trimestral'
                              }
                            }))}
                          >
                            <option value="semanal">Setmanal</option>
                            <option value="mensual">Mensual</option>
                            <option value="trimestral">Trimestral</option>
                          </select>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'generating' && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-32 h-32 border-8 border-slate-200 rounded-full"></div>
                <div 
                  className="absolute inset-0 w-32 h-32 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin"
                  style={{ 
                    clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-slate-800">{progress}%</span>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <h3 className="text-lg font-semibold text-slate-800">Generant l'informe...</h3>
                <p className="text-slate-500 mt-2">Això pot trigar uns segons</p>
              </div>
              
              <div className="w-full max-w-md mt-8">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Informe generat amb èxit!
              </h3>
              <p className="text-slate-600 mb-8">
                El teu informe està llest per descarregar
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Descarregar Informe
                </button>
                
                {config.formato === 'ambos' && (
                  <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Descarregar Excel
                  </button>
                )}
                
                <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Compartir
                </button>
              </div>
              
              <div className="mt-8 p-4 bg-slate-50 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-slate-600">
                  L'informe estarà disponible durant 30 dies al teu historial d'informes
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              {step === 'config' && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Temps estimat: 30-60 segons</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {step === 'config' && (
                <>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-slate-600 hover:text-slate-700 font-medium"
                  >
                    Cancel·lar
                  </button>
                  <button
                    onClick={generateReport}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                  >
                    <FileText className="w-5 h-5" />
                    Generar Informe
                  </button>
                </>
              )}
              
              {step === 'complete' && (
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Tancar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}