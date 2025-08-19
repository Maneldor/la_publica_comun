'use client';

import React from 'react';
import { useTema } from '../../../hooks/useComunidad';

interface DashboardSection {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType;
}

interface SidebarProps {
  sections: DashboardSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export function Sidebar({ sections, activeSection, onSectionChange }: SidebarProps) {
  const tema = useTema();

  return (
    <aside className="w-64 bg-white border-r min-h-screen" style={{
      borderColor: `${tema.primario}15`
    }}>
      <div className="p-6">
        {/* Company Logo/Name */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
              backgroundColor: tema.primario
            }}>
              <span className="text-white font-bold text-lg">🏢</span>
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: tema.texto }}>Mi Empresa</h2>
              <p className="text-sm" style={{ color: tema.textoSecundario }}>Plan Básico</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                  isActive ? 'shadow-md' : 'hover:shadow-sm'
                }`}
                style={{
                  backgroundColor: isActive ? `${tema.primario}15` : 'transparent',
                  borderLeft: isActive ? `3px solid ${tema.primario}` : '3px solid transparent',
                  color: isActive ? tema.primario : tema.texto
                }}
              >
                <span className="text-xl">{section.icon}</span>
                <span className="font-medium">{section.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 rounded-lg" style={{
          backgroundColor: `${tema.secundario}10`
        }}>
          <h3 className="font-semibold mb-3" style={{ color: tema.texto }}>Resumen Rápido</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: tema.textoSecundario }}>Ofertas Activas:</span>
              <span className="font-medium" style={{ color: tema.texto }}>3</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: tema.textoSecundario }}>Candidatos:</span>
              <span className="font-medium" style={{ color: tema.texto }}>127</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: tema.textoSecundario }}>Mensajes IA:</span>
              <span className="font-medium" style={{ color: tema.texto }}>45</span>
            </div>
          </div>
        </div>

        {/* AI Agent Status */}
        <div className="mt-6 p-4 rounded-lg border" style={{
          borderColor: `${tema.primario}20`,
          backgroundColor: `${tema.primario}05`
        }}>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium" style={{ color: tema.texto }}>Agente IA Activo</span>
          </div>
          <p className="text-xs" style={{ color: tema.textoSecundario }}>
            Tu asistente virtual está listo para ayudarte
          </p>
        </div>
      </div>
    </aside>
  );
}