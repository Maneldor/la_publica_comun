'use client';

import React, { useState } from 'react';
import { useTema } from '../../../hooks/useComunidad';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  recipients: number;
  opens: number;
  clicks: number;
  scheduledDate?: Date;
  sentDate?: Date;
}

const mockCampaigns: EmailCampaign[] = [
  {
    id: '1',
    name: 'Nuevas Oportunidades IT - Junio',
    subject: 'Ofertas exclusivas en Tecnología para empleados públicos',
    status: 'sent',
    recipients: 1250,
    opens: 847,
    clicks: 234,
    sentDate: new Date('2024-06-15')
  },
  {
    id: '2',  
    name: 'Newsletter Mensual - Mayo',
    subject: 'Actualizaciones y nuevas convocatorias',
    status: 'sent',
    recipients: 2100,
    opens: 1456,
    clicks: 389,
    sentDate: new Date('2024-05-30')
  },
  {
    id: '3',
    name: 'Campaña Verano 2024',
    subject: 'Prepara tu futuro profesional este verano',
    status: 'scheduled',
    recipients: 1800,
    opens: 0,
    clicks: 0,
    scheduledDate: new Date('2024-07-01')
  }
];

export function EmailCampaigns() {
  const tema = useTema();
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(mockCampaigns);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return '#10b981';
      case 'scheduled': return '#3b82f6';
      case 'paused': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Enviada';
      case 'scheduled': return 'Programada';
      case 'paused': return 'Pausada';
      default: return 'Borrador';
    }
  };

  const calculateOpenRate = (opens: number, recipients: number) => {
    return recipients > 0 ? ((opens / recipients) * 100).toFixed(1) : '0';
  };

  const calculateClickRate = (clicks: number, opens: number) => {
    return opens > 0 ? ((clicks / opens) * 100).toFixed(1) : '0';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: tema.texto }}>Campañas de Email</h1>
          <p className="text-sm mt-1" style={{ color: tema.textoSecundario }}>Gestiona tus campañas de email marketing</p>
        </div>
        
        <button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg"
          style={{ backgroundColor: tema.primario }}
        >
          <span>➕</span>
          <span>Nueva Campaña</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">📧</span>
            <div className="text-green-500 text-sm font-medium">+12%</div>
          </div>
          <h3 className="text-2xl font-bold" style={{ color: tema.texto }}>5,150</h3>
          <p className="text-sm" style={{ color: tema.textoSecundario }}>Emails Enviados</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">👁️</span>
            <div className="text-green-500 text-sm font-medium">+8%</div>
          </div>
          <h3 className="text-2xl font-bold" style={{ color: tema.texto }}>67.8%</h3>
          <p className="text-sm" style={{ color: tema.textoSecundario }}>Tasa de Apertura</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">🔗</span>
            <div className="text-green-500 text-sm font-medium">+15%</div>
          </div>
          <h3 className="text-2xl font-bold" style={{ color: tema.texto }}>27.2%</h3>
          <p className="text-sm" style={{ color: tema.textoSecundario }}>Tasa de Clics</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">🎯</span>
            <div className="text-green-500 text-sm font-medium">+5%</div>
          </div>
          <h3 className="text-2xl font-bold" style={{ color: tema.texto }}>623</h3>
          <p className="text-sm" style={{ color: tema.textoSecundario }}>Conversiones</p>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-xl border" style={{ borderColor: `${tema.primario}15` }}>
        <div className="p-6 border-b" style={{ borderColor: `${tema.primario}15` }}>
          <h2 className="text-lg font-semibold" style={{ color: tema.texto }}>Campañas Recientes</h2>
        </div>
        
        <div className="divide-y" style={{ borderColor: `${tema.primario}10` }}>
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="p-6 hover:bg-gray-50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold" style={{ color: tema.texto }}>{campaign.name}</h3>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${getStatusColor(campaign.status)}15`,
                        color: getStatusColor(campaign.status)
                      }}
                    >
                      {getStatusText(campaign.status)}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-3" style={{ color: tema.textoSecundario }}>Asunto: {campaign.subject}</p>
                  
                  <div className="flex items-center space-x-6 text-sm" style={{ color: tema.textoSecundario }}>
                    <span>👥 {campaign.recipients.toLocaleString()} destinatarios</span>
                    {campaign.status === 'sent' && (
                      <>
                        <span>👁️ {calculateOpenRate(campaign.opens, campaign.recipients)}% apertura</span>
                        <span>🔗 {calculateClickRate(campaign.clicks, campaign.opens)}% clics</span>
                      </>
                    )}
                    {campaign.scheduledDate && (
                      <span>📅 Programada: {campaign.scheduledDate.toLocaleDateString('es-ES')}</span>
                    )}
                    {campaign.sentDate && (
                      <span>✓ Enviada: {campaign.sentDate.toLocaleDateString('es-ES')}</span>
                    )}
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
                    <span className="text-lg">✏️</span>
                  </button>
                  
                  {campaign.status === 'draft' && (
                    <button 
                      className="p-2 rounded-lg hover:shadow-md transition-all duration-200"
                      style={{ backgroundColor: `${getStatusColor('sent')}15` }}
                    >
                      <span className="text-lg">🚀</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Email Assistant */}
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
            <h3 className="text-lg font-semibold mb-2" style={{ color: tema.texto }}>Asistente de Email IA</h3>
            <div className="space-y-2 text-sm" style={{ color: tema.textoSecundario }}>
              <p>• <strong>Mejor día:</strong> Los martes a las 10:00 AM tienen 23% más apertura</p>
              <p>• <strong>Asunto óptimo:</strong> Incluir "Oportunidades exclusivas" aumenta clics 18%</p>
              <p>• <strong>Segmentación:</strong> Empleados IT responden 34% mejor a contenido técnico</p>
            </div>
            
            <button 
              className="mt-4 px-4 py-2 rounded-lg font-medium text-white transition-all duration-200"
              style={{ backgroundColor: tema.primario }}
            >
              Optimizar con IA
            </button>
          </div>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: tema.texto }}>Nueva Campaña de Email</h2>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: tema.texto }}>Nombre de la Campaña</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: `${tema.primario}20` }}
                  placeholder="Ej: Ofertas IT - Julio 2024"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: tema.texto }}>Asunto del Email</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: `${tema.primario}20` }}
                  placeholder="Nuevas oportunidades exclusivas para ti"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: tema.texto }}>Contenido del Email</label>
                <textarea 
                  rows={6}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: `${tema.primario}20` }}
                  placeholder="Escribe el contenido de tu email..."
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: tema.texto }}>Segmento de Audiencia</label>
                  <select className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: `${tema.primario}20` }}>
                    <option>Todos los empleados</option>
                    <option>Empleados IT</option>
                    <option>Administración</option>
                    <option>Educación</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: tema.texto }}>Fecha de Envío</label>
                  <input 
                    type="datetime-local" 
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: `${tema.primario}20` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4">
                <button 
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 rounded-lg border font-medium"
                  style={{ borderColor: `${tema.primario}20`, color: tema.textoSecundario }}
                >
                  Cancelar
                </button>
                <button 
                  className="px-6 py-3 rounded-lg font-medium text-white"
                  style={{ backgroundColor: tema.primario }}
                >
                  Programar Envío
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}