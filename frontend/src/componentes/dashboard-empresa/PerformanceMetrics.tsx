'use client';

import React, { useState, useEffect } from 'react';
import { useTema } from '../../../hooks/useComunidad';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

interface ChartData {
  period: string;
  views: number;
  clicks: number;
  applications: number;
}

const metricsData: MetricCard[] = [
  {
    title: 'Visualizaciones Totales',
    value: '2,847',
    change: '+12.5%',
    changeType: 'positive',
    icon: '👁️'
  },
  {
    title: 'Clics en Ofertas',
    value: '389',
    change: '+8.2%',
    changeType: 'positive',
    icon: '🔗'
  },
  {
    title: 'Candidatos Interesados',
    value: '127',
    change: '+15.3%',
    changeType: 'positive',
    icon: '👥'
  },
  {
    title: 'Tasa de Conversión',
    value: '32.7%',
    change: '+2.1%',
    changeType: 'positive',
    icon: '🎯'
  },
  {
    title: 'Ofertas Activas',
    value: '3',
    change: '=',
    changeType: 'neutral',
    icon: '💼'
  },
  {
    title: 'Tiempo Promedio',
    value: '4.2 min',
    change: '-0.8 min',
    changeType: 'positive',
    icon: '⏱️'
  }
];

const chartData: ChartData[] = [
  { period: 'Ene', views: 1200, clicks: 180, applications: 45 },
  { period: 'Feb', views: 1450, clicks: 220, applications: 67 },
  { period: 'Mar', views: 1680, clicks: 195, applications: 52 },
  { period: 'Abr', views: 2100, clicks: 310, applications: 89 },
  { period: 'May', views: 2450, clicks: 380, applications: 112 },
  { period: 'Jun', views: 2847, clicks: 389, applications: 127 }
];

export function PerformanceMetrics() {
  const tema = useTema();
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-80 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      default: return tema.textoSecundario;
    }
  };

  const maxValue = Math.max(...chartData.map(d => Math.max(d.views, d.clicks * 10, d.applications * 20)));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: tema.texto }}>Estadísticas de Rendimiento</h1>
          <p className="text-sm mt-1" style={{ color: tema.textoSecundario }}>Seguimiento de métricas clave de tu empresa</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {['1m', '3m', '6m', '1a'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedPeriod === period ? 'shadow-md' : 'hover:shadow-sm'
              }`}
              style={{
                backgroundColor: selectedPeriod === period ? `${tema.primario}15` : 'transparent',
                color: selectedPeriod === period ? tema.primario : tema.textoSecundario,
                border: `1px solid ${selectedPeriod === period ? tema.primario : `${tema.primario}20`}`
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metricsData.map((metric, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-xl border hover:shadow-lg transition-all duration-200"
            style={{ borderColor: `${tema.primario}15` }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{metric.icon}</span>
              <div className={`px-2 py-1 rounded-full text-xs font-medium`} style={{
                backgroundColor: `${getChangeColor(metric.changeType)}15`,
                color: getChangeColor(metric.changeType)
              }}>
                {metric.change}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-1" style={{ color: tema.texto }}>{metric.value}</h3>
              <p className="text-sm" style={{ color: tema.textoSecundario }}>{metric.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
          <h3 className="text-lg font-semibold mb-6" style={{ color: tema.texto }}>Tendencia de Rendimiento</h3>
          
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="40"
                  y1={40 + i * 32}
                  x2="380"
                  y2={40 + i * 32}
                  stroke={`${tema.primario}10`}
                  strokeWidth="1"
                />
              ))}
              
              {/* Views line */}
              <path
                d={`M ${chartData.map((d, i) => `${60 + i * 55},${180 - (d.views / maxValue) * 140}`).join(' L ')}`}
                fill="none"
                stroke={tema.primario}
                strokeWidth="3"
                strokeLinecap="round"
              />
              
              {/* Clicks line */}
              <path
                d={`M ${chartData.map((d, i) => `${60 + i * 55},${180 - (d.clicks * 10 / maxValue) * 140}`).join(' L ')}`}
                fill="none"
                stroke={tema.secundario}
                strokeWidth="3"
                strokeLinecap="round"
              />
              
              {/* Data points */}
              {chartData.map((d, i) => (
                <g key={i}>
                  <circle
                    cx={60 + i * 55}
                    cy={180 - (d.views / maxValue) * 140}
                    r="4"
                    fill={tema.primario}
                  />
                  <circle
                    cx={60 + i * 55}
                    cy={180 - (d.clicks * 10 / maxValue) * 140}
                    r="4"
                    fill={tema.secundario}
                  />
                </g>
              ))}
              
              {/* Labels */}
              {chartData.map((d, i) => (
                <text
                  key={i}
                  x={60 + i * 55}
                  y="195"
                  textAnchor="middle"
                  fontSize="12"
                  fill={tema.textoSecundario}
                >
                  {d.period}
                </text>
              ))}
            </svg>
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tema.primario }}></div>
              <span className="text-sm" style={{ color: tema.textoSecundario }}>Visualizaciones</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tema.secundario }}></div>
              <span className="text-sm" style={{ color: tema.textoSecundario }}>Clics</span>
            </div>
          </div>
        </div>

        {/* Top Performing Offers */}
        <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
          <h3 className="text-lg font-semibold mb-6" style={{ color: tema.texto }}>Ofertas Más Exitosas</h3>
          
          <div className="space-y-4">
            {[
              { title: 'Técnico Superior Informática', views: 1247, applications: 89, success: 92 },
              { title: 'Analista de Datos', views: 856, applications: 67, success: 78 },
              { title: 'Gestor de Proyectos TIC', views: 744, applications: 45, success: 71 }
            ].map((offer, index) => (
              <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: `${tema.primario}05` }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium" style={{ color: tema.texto }}>{offer.title}</h4>
                  <span className="text-sm px-2 py-1 rounded-full" style={{
                    backgroundColor: `${tema.primario}15`,
                    color: tema.primario
                  }}>
                    {offer.success}% éxito
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm" style={{ color: tema.textoSecundario }}>
                  <span>👁️ {offer.views} vistas</span>
                  <span>👥 {offer.applications} candidatos</span>
                </div>
                
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500" 
                    style={{ 
                      backgroundColor: tema.primario,
                      width: `${offer.success}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-8 bg-gradient-to-r p-6 rounded-xl" style={{
        background: `linear-gradient(135deg, ${tema.primario}08, ${tema.secundario}08)`
      }}>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
            backgroundColor: `${tema.primario}15`
          }}>
            <span className="text-2xl">🤖</span>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2" style={{ color: tema.texto }}>Insights del Asistente IA</h3>
            <div className="space-y-2 text-sm" style={{ color: tema.textoSecundario }}>
              <p>• <strong>Mejor rendimiento:</strong> Tus ofertas de informática tienen un 23% más de engagement</p>
              <p>• <strong>Horario óptimo:</strong> Los martes a las 10:00 AM generan más visualizaciones</p>
              <p>• <strong>Recomendación:</strong> Considera crear más ofertas en el área de tecnología</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}