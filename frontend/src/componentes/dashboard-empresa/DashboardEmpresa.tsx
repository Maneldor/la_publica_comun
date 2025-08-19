'use client';

import React, { useState, useEffect } from 'react';
import { useTema } from '../../../hooks/useComunidad';
import { AIChatInterface } from './AIChatInterface';
import { PerformanceMetrics } from './PerformanceMetrics';
import { JobOfferManager } from './JobOfferManager';
import { EmailCampaigns } from './EmailCampaigns';
import { CompetitiveAnalysis } from './CompetitiveAnalysis';
import { PlanBilling } from './PlanBilling';
import { Header } from '../comunes/Header';
import { Sidebar } from './Sidebar';

interface DashboardSection {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType;
}

const sections: DashboardSection[] = [
  { id: 'chat', name: 'Asistente IA', icon: '🤖', component: AIChatInterface },
  { id: 'metrics', name: 'Estadísticas', icon: '📊', component: PerformanceMetrics },
  { id: 'offers', name: 'Ofertas Laborales', icon: '👥', component: JobOfferManager },
  { id: 'emails', name: 'Campañas Email', icon: '📧', component: EmailCampaigns },
  { id: 'competition', name: 'Análisis Competitivo', icon: '🔍', component: CompetitiveAnalysis },
  { id: 'billing', name: 'Plan y Facturación', icon: '💳', component: PlanBilling },
];

export function DashboardEmpresa() {
  const tema = useTema();
  const [activeSection, setActiveSection] = useState('chat');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || AIChatInterface;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br" style={{
        background: `linear-gradient(135deg, ${tema.primario}15, ${tema.secundario}10)`
      }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" 
                 style={{ borderColor: tema.primario }}></div>
            <p className="text-lg font-medium" style={{ color: tema.texto }}>Cargando tu dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br" style={{
      background: `linear-gradient(135deg, ${tema.primario}08, ${tema.secundario}05)`
    }}>
      {/* Header */}
      <Header 
        usuario={{
          nombre: 'Empresa',
          apellidos: 'Demo',
          email: 'empresa@ejemplo.es',
          tipo: 'empresa',
          verificado: true
        }}
        mostrarBusqueda={true}
        mostrarNotificaciones={true}
        notificacionesPendientes={3}
      />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          sections={sections}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <div className="flex items-center space-x-2 text-sm">
                <span style={{ color: tema.textoSecundario }}>Dashboard</span>
                <span style={{ color: tema.textoSecundario }}>›</span>
                <span style={{ color: tema.primario }} className="font-medium">
                  {sections.find(s => s.id === activeSection)?.name}
                </span>
              </div>
            </nav>
            
            {/* Content */}
            <div className="bg-white rounded-2xl shadow-lg border" style={{
              borderColor: `${tema.primario}20`
            }}>
              <ActiveComponent />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}