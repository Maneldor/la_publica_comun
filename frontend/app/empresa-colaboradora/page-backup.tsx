'use client'

import DashboardSimple from './dashboard-simple'

export default function EmpresaColaboradoraPage() {
  const {
    empresaData,
    loading,
    error,
    activeSection,
    refreshing,
    chartPeriod,
    setChartPeriod,
    loadEmpresaData,
    refreshData,
    initializeRealTimeUpdates
  } = useEmpresaStore()
  const { t, formatTimeAgo } = useTranslations()

  // Mock data preservando el contenido original
  const mockEmpresaData = empresaData || {
    empresa: {
      id: 'empresa-001',
      nombre: 'TechSolutions Barcelona S.L.',
      sector: 'Tecnología',
      plan: 'Premium Enterprise' as const,
      planExpiry: new Date(),
      billingCycle: 'yearly' as const,
      gestorComercial: {
        id: 'gest-001',
        nombre: 'Maria González',
        email: 'maria@lapublica.cat',
        availability: 'Disponible'
      }
    },
    metrics: {
      ofertes: { actives: 47, limit: 100, progress: 47, trend: 12 },
      visualitzacions: { total: 24650, thisMonth: 8000, growth: 15, dailyAverage: 267, sources: { organic: 35, direct: 25, social: 20, referral: 20 } },
      clicks: { total: 2000, conversion: 8.5, growth: 22, bounceRate: 35 },
      comunitats: { actives: 12, total: 17, top: ['Catalunya', 'Madrid', 'Andalusia'], performance: { Catalunya: 85, Madrid: 72, Andalusia: 68 } },
      pipeline: { pending: 8, inReview: 15, approved: 32, rejected: 3 }
    },
    alerts: [],
    performance: {
      weeklyTrend: [500, 600, 750, 800, 900, 850, 950],
      monthlyTrend: Array(30).fill(0).map((_, i) => Math.floor(Math.sin(i + 1) * 1000 + 1500)),
      bestPerformingOffer: { title: 'Desenvolupador Senior React', views: 3500, clicks: 280, applications: 45 }
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    loadEmpresaData()
    
    // Suscribirse a actualizaciones en tiempo real
    const unsubscribe = initializeRealTimeUpdates('empresa-001')
    
    return unsubscribe
  }, [loadEmpresaData, initializeRealTimeUpdates])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">{t('carregantDades')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadEmpresaData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {t('tornAIntentar')}
          </button>
        </div>
      </div>
    )
  }
  
  if (!mockEmpresaData) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header empresaData={mockEmpresaData} />
      
      <div className="flex">
        <Sidebar empresaData={mockEmpresaData} />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dashboard Principal */}
          {activeSection === 'dashboard' && (
            <>
              {/* Metrics Overview Mejoradas */}
              <MetricsGrid empresaData={mockEmpresaData} />

              {/* Pipeline Status Mejorado */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-slate-200/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800">{t('pipelineAprovacio')}</h3>
                    <button 
                      onClick={refreshData}
                      className={`p-2 rounded-lg transition-all ${refreshing ? 'animate-spin' : 'hover:bg-slate-100'}`}
                    >
                      <RefreshCw className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                  
                  {/* Línea de progreso horizontal */}
                  <div className="relative mb-8">
                    <div className="absolute top-8 left-0 right-0 h-1 bg-slate-200 rounded-full"></div>
                    <div className="absolute top-8 left-0 h-1 bg-gradient-to-r from-yellow-500 via-blue-500 to-green-500 rounded-full" style={{width: '75%'}}></div>
                    <div className="relative grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 border-4 border-yellow-300 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10">
                          <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-800">{mockEmpresaData.metrics.pipeline.pending}</div>
                        <div className="text-sm text-slate-500">{t('pendents')}</div>
                        <div className="text-xs text-yellow-600 font-medium mt-1">~2 dies</div>
                        <button className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full hover:bg-yellow-200 transition-colors">
                          {t('verPendents')}
                        </button>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-blue-300 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10">
                          <Eye className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-800">{mockEmpresaData.metrics.pipeline.inReview}</div>
                        <div className="text-sm text-slate-500">{t('enRevisio')}</div>
                        <div className="text-xs text-blue-600 font-medium mt-1">~1 dia</div>
                        <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors">
                          {t('revisar')}
                        </button>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 border-4 border-green-300 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-800">{mockEmpresaData.metrics.pipeline.approved}</div>
                        <div className="text-sm text-slate-500">{t('aprovades')}</div>
                        <div className="text-xs text-green-600 font-medium mt-1">Aquest mes</div>
                        <button className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 transition-colors">
                          {t('verAprovades')}
                        </button>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 border-4 border-red-300 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10">
                          <X className="w-8 h-8 text-red-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-800">{mockEmpresaData.metrics.pipeline.rejected}</div>
                        <div className="text-sm text-slate-500">{t('rebutjades')}</div>
                        <div className="text-xs text-red-600 font-medium mt-1">Per revisar</div>
                        <button className="mt-2 px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200 transition-colors">
                          {t('verMotius')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notificaciones Mejoradas */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-slate-200/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800">{t('notificacions')}</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center shadow-sm animate-pulse">
                        0
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <div className="text-center text-slate-500 py-8">
                      <div className="text-sm">No hi ha notificacions noves</div>
                    </div>
                  </div>
                  
                  {/* Footer de notificaciones */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <button className="w-full text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
                      {t('veureTotsNotificacions')}
                      <ArrowRight className="w-4 h-4 inline-block ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Gráfico de Rendimiento Avanzado */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-slate-200/30 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{t('rendimentUltims30Dies')}</h3>
                    <p className="text-sm text-slate-500 mt-1">Comparativa de visualitzacions i clicks</p>
                  </div>
                  
                  {/* Selector de período elegante */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                      {['7D', '30D', '90D', '1Y'].map((period) => (
                        <button
                          key={period}
                          onClick={() => setChartPeriod(period)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                            chartPeriod === period
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                    
                    {/* Controles del gráfico */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/50">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div>
                          <span className="text-xs font-medium text-slate-700">Visualitzacions</span>
                        </div>
                        <div className="w-px h-4 bg-slate-200"></div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                          <span className="text-xs font-medium text-slate-700">Clicks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Gráfico interactivo mejorado */}
                <InteractiveChart period={chartPeriod} />
                  
                {/* Estadísticas rápidas */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-medium">Trend</span>
                    </div>
                    <div className="text-lg font-bold text-emerald-700">+23%</div>
                    <div className="text-xs text-emerald-600">vs período anterior</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                      <Target className="w-4 h-4" />
                      <span className="text-xs font-medium">CTR Promedio</span>
                    </div>
                    <div className="text-lg font-bold text-purple-700">7.2%</div>
                    <div className="text-xs text-purple-600">aquest període</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <Activity className="w-4 h-4" />
                      <span className="text-xs font-medium">Peak</span>
                    </div>
                    <div className="text-lg font-bold text-blue-700">1,847</div>
                    <div className="text-xs text-blue-600">millor dia</div>
                  </div>
                </div>
              </div>

              {/* Nuevos Widgets Premium */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Widget Próxima Renovación */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 border border-amber-200/60 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/20 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-400/20 rounded-full translate-y-6 -translate-x-6"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <CalendarDays className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">Pròxima Renovació</h3>
                        <p className="text-xs text-amber-700">{mockEmpresaData.empresa.plan}</p>
                      </div>
                    </div>
                    
                    {/* Countdown elegante */}
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-slate-800 mb-1">23 dies</div>
                      <div className="text-xs text-slate-600">fins a la renovació automàtica</div>
                    </div>
                    
                    {/* Barra de progreso circular simulada */}
                    <div className="flex justify-center mb-4">
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-amber-200"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent" style={{transform: 'rotate(270deg)'}}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-amber-700">76%</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-semibold py-2 rounded-lg hover:shadow-md transition-all">
                      {t('gestionarPla')}
                    </button>
                  </div>
                </div>

                {/* Panel Sugerencias IA */}
                <div className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-2xl p-6 border border-violet-200/60 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-400/20 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-400/20 rounded-full translate-y-8 -translate-x-8"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">Suggeriments IA</h3>
                        <p className="text-xs text-violet-700">Optimització proactiva</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="p-3 bg-white/70 rounded-lg border border-violet-200/50">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <div className="text-xs font-medium text-slate-800">Millor rendiment</div>
                            <div className="text-xs text-slate-600 mt-1">Publiqueu entre 10-12h per +34% visibilitat</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-white/70 rounded-lg border border-violet-200/50">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <div className="text-xs font-medium text-slate-800">Nou segment</div>
                            <div className="text-xs text-slate-600 mt-1">Exploreu perfils júnior a Euskadi</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-semibold py-2 rounded-lg hover:shadow-md transition-all">
                      {t('veureTotsTooltips')}
                    </button>
                  </div>
                </div>

                {/* Acceso Gestor Prominente */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl p-6 border border-emerald-200/60 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-22 h-22 bg-emerald-400/20 rounded-full -translate-y-9 translate-x-9"></div>
                  <div className="absolute bottom-0 left-0 w-18 h-18 bg-teal-400/20 rounded-full translate-y-7 -translate-x-7"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{t('gestorComercial')}</h3>
                        <p className="text-xs text-emerald-700">Suport personalitzat</p>
                      </div>
                    </div>
                    
                    {/* Info del gestor */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">MG</span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 text-sm">{mockEmpresaData.empresa.gestorComercial.nombre}</div>
                        <div className="text-xs text-slate-600">{mockEmpresaData.empresa.gestorComercial.email}</div>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span>Disponible ara</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold py-2 rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {t('chat')}
                      </button>
                      <button className="bg-white text-emerald-700 text-xs font-semibold py-2 rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-all flex items-center justify-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {t('cita')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Perfil Empresa */}
          {activeSection === 'perfil' && <PerfilEmpresa />}
          
          {/* Grups Ocults */}
          {activeSection === 'grups' && <GrupsOcults />}
          
          {/* Gestió d'Ofertes */}
          {activeSection === 'ofertes' && <GestioOfertes />}
          
          {/* Analytics i Informes */}
          {activeSection === 'analytics' && (
            <AnalyticsInformes 
              empresaId={mockEmpresaData?.empresa.id || 'empresa-001'}
              planEmpresa={mockEmpresaData?.empresa.plan.toLowerCase().includes('premium') ? 'premium' : 'basic'}
            />
          )}
          
          {/* Centre de Comunicació */}
          {activeSection === 'comunicacio' && <CentreComunicacio />}
          
          {/* Configuració IA */}
          {activeSection === 'ia' && <ConfiguracioIA />}
          
          {activeSection === 'recursos' && (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('recursos')}</h2>
              <p className="text-slate-600">Documentació, tutorials i suport tècnic especialitzat</p>
              <div className="mt-8 p-8 border-2 border-dashed border-slate-200 rounded-xl text-center">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Component en desenvolupament</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* AI Chat Component */}
      <AIChat />
    </div>
  )
}