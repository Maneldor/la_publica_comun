'use client'

import { useState, useEffect } from 'react'
import { Activity } from 'lucide-react'

interface ChartProps {
  period: string
}

export default function InteractiveChart({ period }: ChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Generar datos basados en el período con semilla determinística
  const generateData = (period: string) => {
    const points = period === '7D' ? 7 : period === '30D' ? 30 : period === '90D' ? 90 : 365
    const interval = Math.min(points, 30) // Máximo 30 puntos en el gráfico
    
    // Función determinística para generar números "aleatorios" consistentes
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }
    
    return {
      labels: Array.from({ length: interval }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (interval - i - 1))
        return date.toLocaleDateString('ca', { day: 'numeric', month: 'short' })
      }),
      visualitzacions: Array.from({ length: interval }, (_, i) => 
        Math.floor(seededRandom(i + 1) * 2000 + 6000)
      ),
      clicks: Array.from({ length: interval }, (_, i) => 
        Math.floor(seededRandom(i + 100) * 300 + 100)
      )
    }
  }
  
  const [data, setData] = useState(() => generateData(period))
  
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setData(generateData(period))
      setLoading(false)
    }, 300)
  }, [period])
  
  // Calcular posiciones SVG
  const chartWidth = 800
  const chartHeight = 240
  const padding = 40
  const plotWidth = chartWidth - padding * 2
  const plotHeight = chartHeight - padding * 2
  
  const maxViews = Math.max(...data.visualitzacions)
  const maxClicks = Math.max(...data.clicks)
  
  const viewsPath = data.visualitzacions.map((value, i) => {
    const x = (i / (data.visualitzacions.length - 1)) * plotWidth + padding
    const y = chartHeight - padding - (value / maxViews) * plotHeight
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
  
  const clicksPath = data.clicks.map((value, i) => {
    const x = (i / (data.clicks.length - 1)) * plotWidth + padding
    const y = chartHeight - padding - (value / maxClicks) * plotHeight * 0.8 // Escala diferente para clicks
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
  
  const viewsArea = `${viewsPath} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`
  const clicksArea = `${clicksPath} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`
  
  if (loading) {
    return (
      <div className="h-80 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl border border-slate-200/50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 text-indigo-600 animate-pulse mx-auto mb-2" />
          <p className="text-sm text-slate-600">Carregant gràfic...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative h-80 bg-gradient-to-br from-white via-slate-50 to-indigo-50 rounded-xl border border-slate-200/50 overflow-hidden">
      {/* Grid de fondo */}
      <svg className="absolute inset-0" width="100%" height="100%">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* Gráfico principal */}
      <svg className="relative" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" width="100%" height="100%">
        <defs>
          {/* Gradientes para áreas */}
          <linearGradient id="viewsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05"/>
          </linearGradient>
          <linearGradient id="clicksGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05"/>
          </linearGradient>
        </defs>
        
        {/* Líneas del eje Y */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <g key={percent}>
            <line
              x1={padding}
              y1={chartHeight - padding - (percent / 100) * plotHeight}
              x2={chartWidth - padding}
              y2={chartHeight - padding - (percent / 100) * plotHeight}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.5"
            />
            <text
              x={padding - 10}
              y={chartHeight - padding - (percent / 100) * plotHeight + 5}
              textAnchor="end"
              fill="#94a3b8"
              fontSize="10"
            >
              {percent === 0 ? '0' : `${((maxViews * percent) / 100 / 1000).toFixed(1)}K`}
            </text>
          </g>
        ))}
        
        {/* Área bajo las líneas */}
        <path d={viewsArea} fill="url(#viewsGradient)" />
        <path d={clicksArea} fill="url(#clicksGradient)" />
        
        {/* Líneas principales */}
        <path
          d={viewsPath}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          className="drop-shadow-md"
        />
        <path
          d={clicksPath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          className="drop-shadow-md"
        />
        
        {/* Puntos interactivos */}
        {data.visualitzacions.map((value, i) => {
          const x = (i / (data.visualitzacions.length - 1)) * plotWidth + padding
          const y = chartHeight - padding - (value / maxViews) * plotHeight
          const clickY = chartHeight - padding - (data.clicks[i] / maxClicks) * plotHeight * 0.8
          
          return (
            <g key={i}>
              {/* Punto de visualizaciones */}
              <circle
                cx={x}
                cy={y}
                r={hoveredPoint === i ? "6" : "4"}
                fill="#10b981"
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* Punto de clicks */}
              <circle
                cx={x}
                cy={clickY}
                r={hoveredPoint === i ? "6" : "4"}
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              
              {/* Tooltip */}
              {hoveredPoint === i && (
                <foreignObject x={x - 60} y={Math.min(y, clickY) - 80} width="120" height="70">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-slate-200 p-2 text-xs">
                    <div className="font-semibold text-slate-800 mb-1">{data.labels[i]}</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-600">{value.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-slate-600">{data.clicks[i].toLocaleString()}</span>
                    </div>
                  </div>
                </foreignObject>
              )}
            </g>
          )
        })}
        
        {/* Labels del eje X */}
        {data.labels.filter((_, i) => i % Math.ceil(data.labels.length / 6) === 0).map((label, i, filtered) => {
          const originalIndex = data.labels.indexOf(label)
          const x = (originalIndex / (data.labels.length - 1)) * plotWidth + padding
          
          return (
            <text
              key={originalIndex}
              x={x}
              y={chartHeight - 10}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
            >
              {label}
            </text>
          )
        })}
      </svg>
      
      {/* Indicador de actualización en tiempo real */}
      <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-slate-600">Actualitzant</span>
      </div>
    </div>
  )
}