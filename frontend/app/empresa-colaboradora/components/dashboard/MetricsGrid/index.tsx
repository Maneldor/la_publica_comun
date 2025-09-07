import React from 'react'
import { FileCheck, Eye, MousePointer, MapPin, ArrowUp, TrendingUp, Info, ExternalLink, Target } from 'lucide-react'
import { useEmpresaStore } from '../../../store/useEmpresaStore'
import { useTranslations } from '../../../hooks/useTranslations'

interface MetricsGridProps {
  empresaData: any
}

export default function MetricsGrid({ empresaData }: MetricsGridProps) {
  const { showTooltip, setShowTooltip, hoveredMetric, setHoveredMetric } = useEmpresaStore()
  const { t } = useTranslations()

  if (!empresaData) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Ofertes Actives - Mejorada */}
      <div 
        className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 group relative hover:-translate-y-1"
        onMouseEnter={() => setHoveredMetric('ofertes')}
        onMouseLeave={() => setHoveredMetric('')}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              <ArrowUp className="w-3 h-3" />
              <span className="text-xs font-semibold">+12%</span>
            </div>
            <button 
              className={`p-1.5 rounded-lg transition-all ${hoveredMetric === 'ofertes' ? 'bg-indigo-100 text-indigo-600' : 'bg-transparent text-slate-400'}`}
              onClick={() => setShowTooltip(showTooltip === 'ofertes' ? '' : 'ofertes')}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mb-3">
          <h3 className="text-2xl font-bold text-slate-800">{empresaData.metrics.ofertes.actives}</h3>
          <p className="text-sm text-slate-500">{t('ofertesActives')}</p>
          <p className="text-xs text-slate-400 mt-1">vs mes anterior</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>{t('usPla')}</span>
            <span>{empresaData.metrics.ofertes.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${empresaData.metrics.ofertes.progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Botón Ver detalles en hover */}
        <button className={`absolute bottom-4 right-4 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-indigo-700 flex items-center gap-1`}>
          {t('verDetalls')}
          <ExternalLink className="w-3 h-3" />
        </button>
        
        {/* Tooltip */}
        {showTooltip === 'ofertes' && (
          <div className="absolute top-16 left-4 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-10 max-w-64">
            <div className="font-medium mb-1">{t('ofertesActives')}</div>
            <div>Número d'ofertes de feina actualment publicades i actives a la plataforma. Límit segons el vostre pla Premium Enterprise.</div>
            <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
          </div>
        )}
      </div>

      {/* Visualitzacions - Mejorada */}
      <div 
        className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 group relative hover:-translate-y-1"
        onMouseEnter={() => setHoveredMetric('views')}
        onMouseLeave={() => setHoveredMetric('')}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-semibold">+{empresaData.metrics.visualitzacions.growth}%</span>
            </div>
            <button 
              className={`p-1.5 rounded-lg transition-all ${hoveredMetric === 'views' ? 'bg-emerald-100 text-emerald-600' : 'bg-transparent text-slate-400'}`}
              onClick={() => setShowTooltip(showTooltip === 'views' ? '' : 'views')}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">{empresaData.metrics.visualitzacions.thisMonth.toLocaleString('es-ES')}</h3>
          <p className="text-sm text-slate-500">{t('visualitzacionsAquestMes')}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-emerald-600 font-medium">vs mes anterior</p>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-50 rounded-full">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-600 font-medium">LIVE</span>
            </div>
          </div>
        </div>
        
        {/* Botón Ver detalles en hover */}
        <button className={`absolute bottom-4 right-4 px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-emerald-700 flex items-center gap-1`}>
          {t('verDetalls')}
          <ExternalLink className="w-3 h-3" />
        </button>
        
        {/* Tooltip */}
        {showTooltip === 'views' && (
          <div className="absolute top-16 left-4 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-10 max-w-64">
            <div className="font-medium mb-1">{t('visualitzacions')}</div>
            <div>Nombre total de visualitzacions de les vostres ofertes de feina durant aquest mes. Inclou visualitzacions úniques i repetides.</div>
            <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
          </div>
        )}
      </div>

      {/* Clicks i Conversió - Mejorada */}
      <div 
        className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group relative hover:-translate-y-1"
        onMouseEnter={() => setHoveredMetric('clicks')}
        onMouseLeave={() => setHoveredMetric('')}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <MousePointer className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-semibold">+{empresaData.metrics.clicks.growth}%</span>
            </div>
            <button 
              className={`p-1.5 rounded-lg transition-all ${hoveredMetric === 'clicks' ? 'bg-purple-100 text-purple-600' : 'bg-transparent text-slate-400'}`}
              onClick={() => setShowTooltip(showTooltip === 'clicks' ? '' : 'clicks')}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">{empresaData.metrics.clicks.total.toLocaleString('es-ES')}</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-500">{t('clicks')}</p>
            <div className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full">
              <Target className="w-3 h-3 text-orange-600" />
              <span className="text-xs font-semibold text-orange-600">{empresaData.metrics.clicks.conversion}% {t('conversio')}</span>
            </div>
          </div>
          <p className="text-xs text-purple-600 font-medium mt-1">vs mes anterior</p>
        </div>
        
        {/* Botón Ver detalles en hover */}
        <button className={`absolute bottom-4 right-4 px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-purple-700 flex items-center gap-1`}>
          {t('verDetalls')}
          <ExternalLink className="w-3 h-3" />
        </button>
        
        {/* Tooltip */}
        {showTooltip === 'clicks' && (
          <div className="absolute top-16 left-4 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-10 max-w-64">
            <div className="font-medium mb-1">Clicks i Conversió</div>
            <div>Nombre de clicks rebuts a les vostres ofertes i percentatge de conversió (candidatures completades).</div>
            <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
          </div>
        )}
      </div>

      {/* Comunitats - Mejorada */}
      <div 
        className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 group relative hover:-translate-y-1"
        onMouseEnter={() => setHoveredMetric('comunitats')}
        onMouseLeave={() => setHoveredMetric('')}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{empresaData.metrics.comunitats.actives}/{empresaData.metrics.comunitats.total}</span>
            <button 
              className={`p-1.5 rounded-lg transition-all ${hoveredMetric === 'comunitats' ? 'bg-orange-100 text-orange-600' : 'bg-transparent text-slate-400'}`}
              onClick={() => setShowTooltip(showTooltip === 'comunitats' ? '' : 'comunitats')}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">{empresaData.metrics.comunitats.actives}</h3>
          <p className="text-sm text-slate-500">{t('comunitatsActives')}</p>
          <p className="text-xs text-slate-400 mt-1">de {empresaData.metrics.comunitats.total} disponibles</p>
        </div>
        
        {/* Botón Ver detalles en hover */}
        <button className={`absolute bottom-4 right-4 px-3 py-1.5 bg-orange-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-orange-700 flex items-center gap-1`}>
          {t('verDetalls')}
          <ExternalLink className="w-3 h-3" />
        </button>
        
        {/* Tooltip */}
        {showTooltip === 'comunitats' && (
          <div className="absolute top-16 left-4 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-10 max-w-64">
            <div className="font-medium mb-1">{t('comunitatsActives')}</div>
            <div>Nombre de comunitats autònomes on teniu ofertes actives. Cada comunitat té la seva pròpia audiència i regulacions.</div>
            <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
          </div>
        )}
      </div>
    </div>
  )
}