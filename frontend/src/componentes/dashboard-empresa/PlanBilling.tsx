'use client';

import React, { useState } from 'react';
import { useTema } from '../../../hooks/useComunidad';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  aiCapabilities: string[];
  limits: {
    offers: number;
    emails: number;
    scraping: number;
  };
  current?: boolean;
}

const plans: Plan[] = [
  {
    id: 'basico',
    name: 'Asistente Virtual Básico',
    price: 99,
    features: [
      'Chat IA básico',
      'Creación de ofertas',
      'Estadísticas básicas',
      'Email marketing'
    ],
    aiCapabilities: [
      'Interacción conversacional',
      'Creación de perfiles de empresa',
      'Diseño de ofertas laborales',
      'Informes automatizados'
    ],
    limits: {
      offers: 5,
      emails: 1000,
      scraping: 100
    },
    current: true
  },
  {
    id: 'avanzado',
    name: 'Asistente Virtual Avanzado',
    price: 299,
    features: [
      'Todo lo del plan Básico',
      'Análisis competitivo',
      'Segmentación avanzada',
      'Automatización de procesos'
    ],
    aiCapabilities: [
      'Análisis predictivo',
      'Optimización de ofertas',
      'Scraping competitivo (5K/día)',
      'Lead scoring inteligente'
    ],
    limits: {
      offers: 20,
      emails: 5000,
      scraping: 5000
    }
  },
  {
    id: 'experto',
    name: 'Asistente Virtual Experto',
    price: 999,
    features: [
      'Todo lo del plan Avanzado',
      'IA personalizada',
      'Integraciones avanzadas',
      'Soporte prioritario'
    ],
    aiCapabilities: [
      'Estrategias de RRHH completas',
      'Análisis de mercado profundo',
      'Scraping masivo (50K/día)',
      'Automatización total'
    ],
    limits: {
      offers: 100,
      emails: 25000,
      scraping: 50000
    }
  }
];

interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  plan: string;
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-2024-06',
    date: new Date('2024-06-01'),
    amount: 99,
    status: 'paid',
    plan: 'Asistente Virtual Básico'
  },
  {
    id: 'INV-2024-05',
    date: new Date('2024-05-01'),
    amount: 99,
    status: 'paid',
    plan: 'Asistente Virtual Básico'
  },
  {
    id: 'INV-2024-04',
    date: new Date('2024-04-01'),
    amount: 99,
    status: 'paid',
    plan: 'Asistente Virtual Básico'
  }
];

export function PlanBilling() {
  const tema = useTema();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(plans[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'overdue': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagada';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencida';
      default: return 'Desconocido';
    }
  };

  const calculateSavings = (plan: Plan) => {
    const humanTeamCost = plan.id === 'basico' ? 1200 : plan.id === 'avanzado' ? 3600 : 12000;
    const savings = ((humanTeamCost - plan.price) / humanTeamCost * 100).toFixed(0);
    return { savings, humanTeamCost };
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: tema.texto }}>Plan y Facturación</h1>
          <p className="text-sm mt-1" style={{ color: tema.textoSecundario }}>Gestiona tu suscripción y historial de pagos</p>
        </div>
      </div>

      {/* Current Plan */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4" style={{ color: tema.texto }}>Plan Actual</h2>
        <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                  backgroundColor: `${tema.primario}15`
                }}>
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: tema.texto }}>{selectedPlan?.name}</h3>
                  <p className="text-2xl font-bold" style={{ color: tema.primario }}>
                    {selectedPlan?.price}€<span className="text-sm font-normal">/mes</span>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{
                  backgroundColor: `${tema.primario}15`,
                  color: tema.primario
                }}>
                  Activo
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3" style={{ color: tema.texto }}>Características Incluidas</h4>
                  <ul className="space-y-2 text-sm" style={{ color: tema.textoSecundario }}>
                    {selectedPlan?.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3" style={{ color: tema.texto }}>Capacidades IA</h4>
                  <ul className="space-y-2 text-sm" style={{ color: tema.textoSecundario }}>
                    {selectedPlan?.aiCapabilities.map((capability, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="text-blue-500">🤖</span>
                        <span>{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: tema.primario }}
            >
              Mejorar Plan
            </button>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4" style={{ color: tema.texto }}>Uso Actual</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">💼</span>
              <span className="text-sm" style={{ color: tema.textoSecundario }}>3 / {selectedPlan?.limits.offers}</span>
            </div>
            <h3 className="text-xl font-bold" style={{ color: tema.texto }}>Ofertas Activas</h3>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500" 
                style={{ 
                  backgroundColor: tema.primario,
                  width: `${selectedPlan ? (3 / selectedPlan.limits.offers * 100) : 0}%`
                }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">📧</span>
              <span className="text-sm" style={{ color: tema.textoSecundario }}>750 / {selectedPlan?.limits.emails}</span>
            </div>
            <h3 className="text-xl font-bold" style={{ color: tema.texto }}>Emails Enviados</h3>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500" 
                style={{ 
                  backgroundColor: tema.secundario,
                  width: `${selectedPlan ? (750 / selectedPlan.limits.emails * 100) : 0}%`
                }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">🔍</span>
              <span className="text-sm" style={{ color: tema.textoSecundario }}>45 / {selectedPlan?.limits.scraping}</span>
            </div>
            <h3 className="text-xl font-bold" style={{ color: tema.texto }}>Scraping Realizado</h3>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500" 
                style={{ 
                  backgroundColor: '#f59e0b',
                  width: `${selectedPlan ? (45 / selectedPlan.limits.scraping * 100) : 0}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4" style={{ color: tema.texto }}>Historial de Facturación</h2>
        <div className="bg-white rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
          <div className="divide-y" style={{ borderColor: `${tema.primario}10` }}>
            {mockInvoices.map((invoice) => (
              <div key={invoice.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
                    backgroundColor: `${getStatusColor(invoice.status)}15`
                  }}>
                    <span style={{ color: getStatusColor(invoice.status) }}>📎</span>
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: tema.texto }}>{invoice.id}</h4>
                    <p className="text-sm" style={{ color: tema.textoSecundario }}>
                      {invoice.plan} - {invoice.date.toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-bold" style={{ color: tema.texto }}>{invoice.amount}€</span>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${getStatusColor(invoice.status)}15`,
                      color: getStatusColor(invoice.status)
                    }}
                  >
                    {getStatusText(invoice.status)}
                  </span>
                  <button 
                    className="p-2 rounded-lg hover:shadow-md transition-all duration-200"
                    style={{ backgroundColor: `${tema.primario}10` }}
                  >
                    <span className="text-lg">📄</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="bg-gradient-to-r p-6 rounded-xl" style={{
        background: `linear-gradient(135deg, ${tema.primario}08, ${tema.secundario}08)`
      }}>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
            backgroundColor: `${tema.primario}15`
          }}>
            <span className="text-2xl">💰</span>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2" style={{ color: tema.texto }}>Ahorro vs Equipo Humano</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              {plans.map((plan) => {
                const { savings, humanTeamCost } = calculateSavings(plan);
                return (
                  <div key={plan.id} className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium mb-2" style={{ color: tema.texto }}>{plan.name}</h4>
                    <div className="space-y-1" style={{ color: tema.textoSecundario }}>
                      <p>Equipo humano: {humanTeamCost.toLocaleString()}€/mes</p>
                      <p>Plan IA: {plan.price}€/mes</p>
                      <p className="font-bold text-green-600">Ahorro: {savings}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: tema.texto }}>Mejorar tu Plan</h2>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const { savings, humanTeamCost } = calculateSavings(plan);
                const isCurrent = plan.current;
                
                return (
                  <div 
                    key={plan.id} 
                    className={`p-6 rounded-xl border-2 ${
                      isCurrent ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    } transition-all duration-200`}
                  >
                    {isCurrent && (
                      <div className="mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                          Plan Actual
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-lg font-bold mb-2" style={{ color: tema.texto }}>{plan.name}</h3>
                    <div className="text-3xl font-bold mb-1" style={{ color: tema.primario }}>
                      {plan.price}€<span className="text-sm font-normal">/mes</span>
                    </div>
                    <p className="text-sm mb-6" style={{ color: tema.textoSecundario }}>Ahorras {savings}% vs equipo humano</p>
                    
                    <ul className="space-y-2 mb-6 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="text-green-500">✓</span>
                          <span style={{ color: tema.textoSecundario }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button 
                      disabled={isCurrent}
                      className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                        isCurrent 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'text-white hover:shadow-lg'
                      }`}
                      style={{ 
                        backgroundColor: isCurrent ? undefined : tema.primario
                      }}
                    >
                      {isCurrent ? 'Plan Actual' : 'Seleccionar Plan'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}