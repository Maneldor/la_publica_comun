'use client'

import { useState, useMemo } from 'react'
import {
  BarChart3, LineChart, PieChart, Activity, TrendingUp,
  Maximize2, Download, Share2, Settings, Info, X
} from 'lucide-react'
import { DatoGrafico, ConfiguracionGrafico, PlanEmpresa } from '../../../../tipos/analytics'

interface ChartContainerProps {
  configuracion: ConfiguracionGrafico
  planEmpresa: PlanEmpresa
  className?: string
  showActions?: boolean
  showTitle?: boolean
  onMaximize?: () => void
  onExport?: (formato: string) => void
}

export function ChartContainer({ 
  configuracion, 
  planEmpresa, 
  className = '', 
  showActions = true,
  showTitle = true,
  onMaximize,
  onExport 
}: ChartContainerProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  
  const isDisponible = configuracion.disponibleEnPlan.includes(planEmpresa)
  
  if (!isDisponible) {
    return (
      <div className={`bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">{configuracion.titulo}</h3>
          <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Premium
          </div>
        </div>
        <div className="h-64 flex items-center justify-center text-center">
          <div>
            <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-purple-700 font-medium mb-2">Gràfic Premium</p>
            <p className="text-purple-600 text-sm">Actualitza el teu pla per accedir a analytics avançats</p>
            <button className="mt-4 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
              Actualitzar Pla
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-6 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">{configuracion.titulo}</h3>
          {showActions && (
            <div className="flex items-center gap-2">
              <button 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => onMaximize?.()}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => onExport?.('png')}
              >
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {configuracion.tipo === 'line' && (
        <LineChartComponent 
          datos={configuracion.datos}
          colores={configuracion.colores}
          ejes={configuracion.ejes}
          onHover={setHoveredPoint}
          hoveredPoint={hoveredPoint}
        />
      )}
      
      {configuracion.tipo === 'bar' && (
        <BarChartComponent 
          datos={configuracion.datos}
          colores={configuracion.colores}
          ejes={configuracion.ejes}
          onHover={setHoveredPoint}
          hoveredPoint={hoveredPoint}
        />
      )}

      {configuracion.tipo === 'pie' && (
        <PieChartComponent 
          datos={configuracion.datos}
          colores={configuracion.colores}
          onHover={setHoveredPoint}
          hoveredPoint={hoveredPoint}
        />
      )}

      {configuracion.tipo === 'heatmap' && (
        <HeatmapComponent datos={configuracion.datos} />
      )}
    </div>
  )
}

// Componente de gráfico de líneas
function LineChartComponent({ 
  datos, 
  colores = ['#4f46e5'], 
  ejes,
  onHover,
  hoveredPoint
}: {
  datos: DatoGrafico[]
  colores?: string[]
  ejes?: any
  onHover: (index: number | null) => void
  hoveredPoint: number | null
}) {
  const maxValue = Math.max(...datos.map(d => d.value))
  const points = datos.map((dato, index) => ({
    x: (index / (datos.length - 1)) * 100,
    y: 100 - (dato.value / maxValue) * 80, // 80% del height para padding
    value: dato.value,
    label: dato.label
  }))

  const pathD = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L'
    return `${path} ${command} ${point.x} ${point.y}`
  }, '')

  return (
    <div className="h-64 relative">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f1f5f9" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        
        {/* Área bajo la curva */}
        <path
          d={`${pathD} L 100 100 L 0 100 Z`}
          fill="url(#gradient)"
          opacity="0.1"
        />
        
        {/* Línea principal */}
        <path
          d={pathD}
          fill="none"
          stroke={colores[0]}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Puntos interactivos */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={hoveredPoint === index ? "3" : "2"}
            fill={colores[0]}
            className="cursor-pointer transition-all"
            onMouseEnter={() => onHover(index)}
            onMouseLeave={() => onHover(null)}
          />
        ))}
        
        {/* Gradiente */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colores[0]} />
            <stop offset="100%" stopColor={colores[0]} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Tooltip */}
      {hoveredPoint !== null && (
        <div 
          className="absolute bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${points[hoveredPoint].x}%`,
            top: `${points[hoveredPoint].y}%`,
            marginTop: '-8px'
          }}
        >
          <div>{points[hoveredPoint].label}</div>
          <div className="text-xs opacity-75">{points[hoveredPoint].value.toLocaleString('es-ES')}</div>
        </div>
      )}
      
      {/* Ejes */}
      <div className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-between text-xs text-slate-500 px-2">
        {datos.slice(0, 5).map((dato, index) => (
          <span key={index}>{dato.label}</span>
        ))}
      </div>
    </div>
  )
}

// Componente de gráfico de barras
function BarChartComponent({ 
  datos, 
  colores = ['#4f46e5'], 
  ejes,
  onHover,
  hoveredPoint
}: {
  datos: DatoGrafico[]
  colores?: string[]
  ejes?: any
  onHover: (index: number | null) => void
  hoveredPoint: number | null
}) {
  const maxValue = Math.max(...datos.map(d => d.value))

  return (
    <div className="h-64 flex items-end justify-center gap-2 px-4 pb-8 pt-4">
      {datos.slice(0, 10).map((dato, index) => {
        const height = Math.max((dato.value / maxValue) * 80, 5)
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className={`w-full rounded-t-lg transition-all duration-300 cursor-pointer ${
                hoveredPoint === index ? 'opacity-100 shadow-lg' : 'opacity-80 hover:opacity-100'
              }`}
              style={{
                height: `${height}%`,
                minHeight: '8px',
                backgroundColor: colores[index % colores.length] || colores[0]
              }}
              onMouseEnter={() => onHover(index)}
              onMouseLeave={() => onHover(null)}
            />
            <div className="text-xs text-slate-500 mt-2 transform -rotate-45 origin-center">
              {dato.label}
            </div>
            
            {hoveredPoint === index && (
              <div className="absolute bg-slate-800 text-white px-2 py-1 rounded text-xs font-medium transform -translate-y-full mt-2">
                {dato.value.toLocaleString('es-ES')}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Componente de gráfico circular
function PieChartComponent({ 
  datos, 
  colores = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'], 
  onHover,
  hoveredPoint
}: {
  datos: DatoGrafico[]
  colores?: string[]
  onHover: (index: number | null) => void
  hoveredPoint: number | null
}) {
  const total = datos.reduce((sum, dato) => sum + dato.value, 0)
  
  let cumulativePercentage = 0
  const slices = datos.map((dato, index) => {
    const percentage = (dato.value / total) * 100
    const startAngle = (cumulativePercentage / 100) * 360
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360
    
    cumulativePercentage += percentage
    
    return {
      ...dato,
      percentage,
      startAngle,
      endAngle,
      color: colores[index % colores.length]
    }
  })

  return (
    <div className="h-80 flex flex-col items-center justify-start p-4">
      <div className="relative flex flex-col items-center">
        <svg viewBox="0 0 200 200" className="w-48 h-48 transform -rotate-90 max-w-full">
          {slices.map((slice, index) => {
            const largeArcFlag = slice.percentage > 50 ? 1 : 0
            const startX = 100 + 80 * Math.cos((slice.startAngle * Math.PI) / 180)
            const startY = 100 + 80 * Math.sin((slice.startAngle * Math.PI) / 180)
            const endX = 100 + 80 * Math.cos((slice.endAngle * Math.PI) / 180)
            const endY = 100 + 80 * Math.sin((slice.endAngle * Math.PI) / 180)
            
            const pathData = [
              `M 100 100`,
              `L ${startX} ${startY}`,
              `A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z'
            ].join(' ')
            
            return (
              <path
                key={index}
                d={pathData}
                fill={slice.color}
                className={`cursor-pointer transition-all ${
                  hoveredPoint === index ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                }`}
                onMouseEnter={() => onHover(index)}
                onMouseLeave={() => onHover(null)}
              />
            )
          })}
        </svg>
        
        {/* Leyenda */}
        <div className="mt-4 space-y-1 w-full max-w-xs">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-slate-700">{slice.label}</span>
              <span className="text-slate-500">({slice.percentage.toFixed(1)}%)</span>
            </div>
          ))}
        </div>
        
        {/* Tooltip central */}
        {hoveredPoint !== null && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-3 text-center border">
              <div className="font-semibold text-slate-800">{slices[hoveredPoint].label}</div>
              <div className="text-sm text-slate-600">{slices[hoveredPoint].value.toLocaleString('es-ES')}</div>
              <div className="text-xs text-slate-500">{slices[hoveredPoint].percentage.toFixed(1)}%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente de heatmap (solo premium)
function HeatmapComponent({ datos }: { datos: DatoGrafico[] }) {
  const gridSize = Math.ceil(Math.sqrt(datos.length))
  const maxValue = Math.max(...datos.map(d => d.value))
  
  return (
    <div className="h-64 p-4">
      <div 
        className="grid gap-1 h-full"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {datos.slice(0, gridSize * gridSize).map((dato, index) => {
          const intensity = dato.value / maxValue
          return (
            <div
              key={index}
              className="rounded transition-all hover:scale-110 cursor-pointer flex items-center justify-center text-xs font-medium"
              style={{
                backgroundColor: `rgba(79, 70, 229, ${intensity})`,
                color: intensity > 0.5 ? 'white' : '#374151'
              }}
              title={`${dato.label}: ${dato.value}`}
            >
              {dato.value}
            </div>
          )
        })}
      </div>
      
      <div className="flex items-center justify-center mt-4 gap-2 text-xs text-slate-500">
        <span>Menys</span>
        <div className="flex gap-1">
          {[0.2, 0.4, 0.6, 0.8, 1.0].map(intensity => (
            <div
              key={intensity}
              className="w-4 h-4 rounded"
              style={{ backgroundColor: `rgba(79, 70, 229, ${intensity})` }}
            />
          ))}
        </div>
        <span>Més</span>
      </div>
    </div>
  )
}

// Modal para gráficos maximizados
interface MaximizedChartModalProps {
  configuracion: ConfiguracionGrafico
  planEmpresa: PlanEmpresa
  onClose: () => void
}

export function MaximizedChartModal({ configuracion, planEmpresa, onClose }: MaximizedChartModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-slate-800">{configuracion.titulo}</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <ChartContainer 
            configuracion={configuracion}
            planEmpresa={planEmpresa}
            className="h-[600px]"
            showActions={false}
            showTitle={false}
          />
        </div>
      </div>
    </div>
  )
}