'use client'

import { useEffect } from 'react'
import { 
  Search, AlertTriangle, RefreshCw, Clock, CheckCircle, X, Eye,
  ArrowRight, CalendarDays, Lightbulb, Users, MessageCircle, Calendar,
  TrendingUp, Activity, Target
} from 'lucide-react'
import { useEmpresaStore } from './store/useEmpresaStore'
import { useTranslations } from './hooks/useTranslations'
import MetricsGrid from './components/dashboard/MetricsGrid'
import InteractiveChart from './components/InteractiveChart'

export default function DashboardSimple() {
  const {
    empresaData,
    loading,
    error,
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
      visualitzacions: { 
        total: 24650, 
        thisMonth: 8000, 
        growth: 15, 
        dailyAverage: 267,
        sources: { organic: 35, direct: 25, social: 20, referral: 20 }
      },
      clicks: { total: 2000, conversion: 8.5, growth: 22, bounceRate: 35 },
      comunitats: { 
        actives: 12, 
        total: 17, 
        top: ['Catalunya', 'Madrid', 'Andalusia'],
        performance: { Catalunya: 85, Madrid: 72, Andalusia: 68 }
      },
      pipeline: { pending: 8, inReview: 15, approved: 32, rejected: 3 }
    },
    alerts: [],
    performance: {
      weeklyTrend: [500, 600, 750, 800, 900, 850, 950],
      monthlyTrend: Array(30).fill(0).map((_, i) => Math.floor(Math.sin(i + 1) * 1000 + 1500)),
      bestPerformingOffer: { title: 'Desenvolupador Senior React', views: 3500, clicks: 280, applications: 45 }
    }
  }

  useEffect(() => {
    loadEmpresaData()
    const unsubscribe = initializeRealTimeUpdates('empresa-001')
    return unsubscribe
  }, [loadEmpresaData, initializeRealTimeUpdates])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-lg">Carregant...</div></div>
  if (error) return <div className="text-red-600 text-center p-4">{error}</div>

  return (
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
              disabled={refreshing}
              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-8">
            {/* Pipeline Steps */}
            {[
              { key: 'pending', label: t('pendents'), count: mockEmpresaData.metrics.pipeline.pending, color: 'bg-yellow-500', trend: '-2 dies' },
              { key: 'inReview', label: t('enRevisio'), count: mockEmpresaData.metrics.pipeline.inReview, color: 'bg-blue-500', trend: '-1 dia' },
              { key: 'approved', label: t('aprovades'), count: mockEmpresaData.metrics.pipeline.approved, color: 'bg-green-500', trend: 'Aquest mes' },
              { key: 'rejected', label: t('rebutjades'), count: mockEmpresaData.metrics.pipeline.rejected, color: 'bg-red-500', trend: 'Per revisar' }
            ].map((step, idx) => (
              <div key={step.key} className="flex flex-col items-center">
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                  {step.key === 'pending' && <Clock className="w-6 h-6 text-white" />}
                  {step.key === 'inReview' && <Eye className="w-6 h-6 text-white" />}
                  {step.key === 'approved' && <CheckCircle className="w-6 h-6 text-white" />}
                  {step.key === 'rejected' && <X className="w-6 h-6 text-white" />}
                </div>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-slate-800">{step.count}</div>
                  <div className="text-sm text-slate-600">{step.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{step.trend}</div>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:block absolute mt-8">
                    <ArrowRight className="w-4 h-4 text-slate-400" style={{ transform: 'translateX(4rem)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button className="flex-1 p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium">
              Ver Pendents
            </button>
            <button className="flex-1 p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium">
              Revisar
            </button>
            <button className="flex-1 p-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-sm font-medium">
              Ver Aprovades
            </button>
            <button className="flex-1 p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium">
              Ver Motius
            </button>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6">
          {/* Renovació */}
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
              
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-slate-800 mb-1">23 dies</div>
                <div className="text-xs text-slate-600">fins a la renovació automàtica</div>
              </div>
              
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

          {/* Sugerencias IA */}
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
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-slate-200/30 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">Rendiment dels Últims 30 Dies</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Comparativa de visualitzacions i clicks</span>
            <div className="flex bg-slate-100 rounded-lg p-1">
              {['7D', '30D', '90D', '1Y'].map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    chartPeriod === period
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <InteractiveChart 
          data={mockEmpresaData.performance.monthlyTrend} 
          period={chartPeriod}
          height={300}
        />
      </div>
    </>
  )
}