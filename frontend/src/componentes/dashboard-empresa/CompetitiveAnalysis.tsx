'use client';

import React, { useState } from 'react';
import { useTema } from '../../../hooks/useComunidad';

interface Competitor {
  id: string;
  name: string;
  sector: string;
  employees: string;
  avgSalary: string;
  benefits: string[];
  locations: string[];
  activeOffers: number;
  trustScore: number;
}

const mockCompetitors: Competitor[] = [
  {
    id: '1',
    name: 'TechConsulting SL',
    sector: 'Consultoría IT',
    employees: '50-100',
    avgSalary: '38.000€ - 45.000€',
    benefits: ['Teletrabajo', 'Formación', 'Seguro médico'],
    locations: ['Madrid', 'Barcelona'],
    activeOffers: 12,
    trustScore: 87
  },
  {
    id: '2',
    name: 'Digital Solutions SA',
    sector: 'Transformación Digital',
    employees: '100-250',
    avgSalary: '35.000€ - 42.000€',
    benefits: ['Flexibilidad horaria', 'Bonos', 'Parking'],
    locations: ['Valencia', 'Sevilla'],
    activeOffers: 8,
    trustScore: 92
  },
  {
    id: '3',
    name: 'Innovation Hub',
    sector: 'Desarrollo Software',
    employees: '25-50',
    avgSalary: '32.000€ - 40.000€',
    benefits: ['Ambiente joven', 'Proyectos innovadores'],
    locations: ['Bilbao', 'Zaragoza'],
    activeOffers: 5,
    trustScore: 78
  }
];

export function CompetitiveAnalysis() {
  const tema = useTema();
  const [competitors, setCompetitors] = useState<Competitor[]>(mockCompetitors);
  const [selectedSector, setSelectedSector] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sectors = ['all', 'Consultoría IT', 'Transformación Digital', 'Desarrollo Software'];
  
  const filteredCompetitors = selectedSector === 'all' 
    ? competitors 
    : competitors.filter(comp => comp.sector === selectedSector);

  const runNewAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: tema.texto }}>Análisis Competitivo</h1>
          <p className="text-sm mt-1" style={{ color: tema.textoSecundario }}>Monitorea la competencia en tu sector</p>
        </div>
        
        <button 
          onClick={runNewAnalysis}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50"
          style={{ backgroundColor: tema.primario }}
        >
          <span>{isAnalyzing ? '⏳' : '🔍'}</span>
          <span>{isAnalyzing ? 'Analizando...' : 'Nuevo Análisis'}</span>
        </button>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">🏢</span>
            <div className="text-green-500 text-sm font-medium">+5%</div>
          </div>
          <h3 className="text-2xl font-bold" style={{ color: tema.texto }}>127</h3>
          <p className="text-sm" style={{ color: tema.textoSecundario }}>Competidores Activos</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">💰</span>
            <div className="text-red-500 text-sm font-medium">+3%</div>
          </div>
          <h3 className="text-2xl font-bold" style={{ color: tema.texto }}>36.8k€</h3>
          <p className="text-sm" style={{ color: tema.textoSecundario }}>Salario Promedio</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">💼</span>
            <div className="text-green-500 text-sm font-medium">+12%</div>
          </div>
          <h3 className="text-2xl font-bold" style={{ color: tema.texto }}>342</h3>
          <p className="text-sm" style={{ color: tema.textoSecundario }}>Ofertas Activas</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">🎯</span>
            <div className="text-green-500 text-sm font-medium">+8%</div>
          </div>
          <h3 className="text-2xl font-bold" style={{ color: tema.texto }}>23%</h3>
          <p className="text-sm" style={{ color: tema.textoSecundario }}>Tu Cuota de Mercado</p>
        </div>
      </div>

      {/* Sector Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <span className="text-sm font-medium" style={{ color: tema.texto }}>Filtrar por sector:</span>
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setSelectedSector(sector)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedSector === sector ? 'shadow-md' : 'hover:shadow-sm'
            }`}
            style={{
              backgroundColor: selectedSector === sector ? `${tema.primario}15` : 'transparent',
              color: selectedSector === sector ? tema.primario : tema.textoSecundario,
              border: `1px solid ${selectedSector === sector ? tema.primario : `${tema.primario}20`}`
            }}
          >
            {sector === 'all' ? 'Todos' : sector}
          </button>
        ))}
      </div>

      {/* Competitors List */}
      <div className="space-y-6">
        {filteredCompetitors.map((competitor) => (
          <div 
            key={competitor.id} 
            className="bg-white p-6 rounded-xl border hover:shadow-lg transition-all duration-200"
            style={{ borderColor: `${tema.primario}15` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold" style={{ color: tema.texto }}>{competitor.name}</h3>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${getTrustScoreColor(competitor.trustScore)}15`,
                      color: getTrustScoreColor(competitor.trustScore)
                    }}
                  >
                    {competitor.trustScore}% confianza
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm" style={{ color: tema.textoSecundario }}>
                  <div className="flex items-center space-x-2">
                    <span>🏢</span>
                    <span>{competitor.sector}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>👥</span>
                    <span>{competitor.employees} empleados</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>💰</span>
                    <span>{competitor.avgSalary}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>💼</span>
                    <span>{competitor.activeOffers} ofertas activas</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 rounded-lg hover:shadow-md transition-all duration-200"
                  style={{ backgroundColor: `${tema.primario}10` }}
                >
                  <span className="text-lg">📊</span>
                </button>
                
                <button 
                  className="p-2 rounded-lg hover:shadow-md transition-all duration-200"
                  style={{ backgroundColor: `${tema.secundario}10` }}
                >
                  <span className="text-lg">🔗</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2" style={{ color: tema.texto }}>Beneficios Ofrecidos</h4>
                <div className="flex flex-wrap gap-2">
                  {competitor.benefits.map((benefit, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: `${tema.secundario}15`,
                        color: tema.secundario
                      }}
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2" style={{ color: tema.texto }}>Ubicaciones</h4>
                <div className="flex flex-wrap gap-2">
                  {competitor.locations.map((location, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: `${tema.primario}15`,
                        color: tema.primario
                      }}
                    >
                      🗺️ {location}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Market Insights */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Salary Comparison */}
        <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
          <h3 className="text-lg font-semibold mb-6" style={{ color: tema.texto }}>Comparación Salarial</h3>
          
          <div className="space-y-4">
            {[
              { role: 'Técnico Junior', market: '28k-32k', yours: '30k-35k', status: 'competitive' },
              { role: 'Técnico Senior', market: '35k-42k', yours: '38k-45k', status: 'above' },
              { role: 'Analista', market: '30k-38k', yours: '32k-40k', status: 'competitive' },
              { role: 'Gestor Proyecto', market: '40k-50k', yours: '42k-52k', status: 'above' }
            ].map((role, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: `${tema.primario}05` }}>
                <div>
                  <h4 className="font-medium" style={{ color: tema.texto }}>{role.role}</h4>
                  <p className="text-sm" style={{ color: tema.textoSecundario }}>Mercado: {role.market} | Tuyo: {role.yours}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium`} style={{
                  backgroundColor: role.status === 'above' ? '#10b98115' : '#f59e0b15',
                  color: role.status === 'above' ? '#10b981' : '#f59e0b'
                }}>
                  {role.status === 'above' ? 'Por encima' : 'Competitivo'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Market Trends */}
        <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
          <h3 className="text-lg font-semibold mb-6" style={{ color: tema.texto }}>Tendencias del Mercado</h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: `${tema.primario}05` }}>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-green-500">↑</span>
                <h4 className="font-medium" style={{ color: tema.texto }}>Demanda de Teletrabajo</h4>
              </div>
              <p className="text-sm" style={{ color: tema.textoSecundario }}>85% de ofertas incluyen modalidad remota (+15% vs año anterior)</p>
            </div>
            
            <div className="p-4 rounded-lg" style={{ backgroundColor: `${tema.secundario}05` }}>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-blue-500">→</span>
                <h4 className="font-medium" style={{ color: tema.texto }}>Formación Continua</h4>
              </div>
              <p className="text-sm" style={{ color: tema.textoSecundario }}>70% valoran planes de desarrollo profesional</p>
            </div>
            
            <div className="p-4 rounded-lg" style={{ backgroundColor: `${tema.primario}05` }}>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-red-500">↓</span>
                <h4 className="font-medium" style={{ color: tema.texto }}>Contratos Temporales</h4>
              </div>
              <p className="text-sm" style={{ color: tema.textoSecundario }}>Preferencia por estabilidad laboral (-8% contratos temporales)</p>
            </div>
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
            <h3 className="text-lg font-semibold mb-2" style={{ color: tema.texto }}>Insights IA del Mercado</h3>
            <div className="space-y-2 text-sm" style={{ color: tema.textoSecundario }}>
              <p>• <strong>Oportunidad:</strong> Tus salarios están 12% por encima del mercado - ventaja competitiva</p>
              <p>• <strong>Tendencia:</strong> Incluir "desarrollo profesional" aumenta candidatos 34%</p>
              <p>• <strong>Recomendación:</strong> Considera expandir a Bilbao - menos competencia, alta demanda</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}