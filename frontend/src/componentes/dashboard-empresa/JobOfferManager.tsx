'use client';

import React, { useState } from 'react';
import { useTema } from '../../../hooks/useComunidad';

interface JobOffer {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  type: string;
  status: 'draft' | 'active' | 'paused' | 'closed';
  applications: number;
  views: number;
  createdAt: Date;
  expiresAt: Date;
}

const mockOffers: JobOffer[] = [
  {
    id: '1',
    title: 'Técnico Superior en Informática',
    department: 'Tecnologías de la Información',
    location: 'Barcelona, Catalunya',
    salary: '35.000€ - 42.000€',
    type: 'Funcionario de carrera',
    status: 'active',
    applications: 89,
    views: 1247,
    createdAt: new Date('2024-06-01'),
    expiresAt: new Date('2024-08-01')
  },
  {
    id: '2',
    title: 'Analista de Datos',
    department: 'Administración Digital',
    location: 'Madrid, Madrid',
    salary: '32.000€ - 38.000€',
    type: 'Laboral temporal',
    status: 'active',
    applications: 67,
    views: 856,
    createdAt: new Date('2024-06-15'),
    expiresAt: new Date('2024-08-15')
  },
  {
    id: '3',
    title: 'Gestor de Proyectos TIC',
    department: 'Dirección General',
    location: 'Sevilla, Andalucía',
    salary: '40.000€ - 48.000€',
    type: 'Funcionario interino',
    status: 'paused',
    applications: 45,
    views: 744,
    createdAt: new Date('2024-05-20'),
    expiresAt: new Date('2024-07-20')
  }
];

export function JobOfferManager() {
  const tema = useTema();
  const [offers, setOffers] = useState<JobOffer[]>(mockOffers);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'paused': return '#f59e0b';
      case 'closed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'paused': return 'Pausada';
      case 'closed': return 'Cerrada';
      default: return 'Borrador';
    }
  };

  const filteredOffers = filterStatus === 'all' 
    ? offers 
    : offers.filter(offer => offer.status === filterStatus);

  const handleStatusChange = (offerId: string, newStatus: JobOffer['status']) => {
    setOffers(prev => prev.map(offer => 
      offer.id === offerId ? { ...offer, status: newStatus } : offer
    ));
  };

  const CreateOfferForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: tema.texto }}>Nueva Oferta Laboral</h2>
          <button 
            onClick={() => setShowCreateForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: tema.texto }}>Título del Puesto</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: `${tema.primario}20`, focusRingColor: tema.primario }}
              placeholder="Ej: Técnico Superior en Informática"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: tema.texto }}>Departamento</label>
              <select className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: `${tema.primario}20` }}>
                <option>Tecnologías de la Información</option>
                <option>Administración Digital</option>
                <option>Recursos Humanos</option>
                <option>Finanzas</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: tema.texto }}>Ubicación</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: `${tema.primario}20` }}
                placeholder="Ciudad, Comunidad Autónoma"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: tema.texto }}>Rango Salarial</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: `${tema.primario}20` }}
                placeholder="30.000€ - 40.000€"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: tema.texto }}>Tipo de Contrato</label>
              <select className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: `${tema.primario}20` }}>
                <option>Funcionario de carrera</option>
                <option>Funcionario interino</option>
                <option>Laboral temporal</option>
                <option>Laboral indefinido</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: tema.texto }}>Descripción del Puesto</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: `${tema.primario}20` }}
              placeholder="Describe las funciones, requisitos y responsabilidades..."
            ></textarea>
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
              Crear Oferta
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: tema.texto }}>Gestión de Ofertas</h1>
          <p className="text-sm mt-1" style={{ color: tema.textoSecundario }}>Administra tus ofertas de empleo público</p>
        </div>
        
        <button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg"
          style={{ backgroundColor: tema.primario }}
        >
          <span>➕</span>
          <span>Nueva Oferta</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <span className="text-sm font-medium" style={{ color: tema.texto }}>Filtrar por:</span>
        {[
          { key: 'all', label: 'Todas' },
          { key: 'active', label: 'Activas' },
          { key: 'paused', label: 'Pausadas' },
          { key: 'draft', label: 'Borradores' }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setFilterStatus(filter.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filterStatus === filter.key ? 'shadow-md' : 'hover:shadow-sm'
            }`}
            style={{
              backgroundColor: filterStatus === filter.key ? `${tema.primario}15` : 'transparent',
              color: filterStatus === filter.key ? tema.primario : tema.textoSecundario,
              border: `1px solid ${filterStatus === filter.key ? tema.primario : `${tema.primario}20`}`
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.map((offer) => (
          <div 
            key={offer.id} 
            className="bg-white p-6 rounded-xl border hover:shadow-lg transition-all duration-200 cursor-pointer"
            style={{ borderColor: `${tema.primario}15` }}
            onClick={() => setSelectedOffer(offer)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold" style={{ color: tema.texto }}>{offer.title}</h3>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${getStatusColor(offer.status)}15`,
                      color: getStatusColor(offer.status)
                    }}
                  >
                    {getStatusText(offer.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm" style={{ color: tema.textoSecundario }}>
                  <div className="flex items-center space-x-2">
                    <span>🏢</span>
                    <span>{offer.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🗺️</span>
                    <span>{offer.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>💰</span>
                    <span>{offer.salary}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📄</span>
                    <span>{offer.type}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 ml-6">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: tema.primario }}>{offer.applications}</div>
                  <div className="text-xs" style={{ color: tema.textoSecundario }}>Candidatos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: tema.secundario }}>{offer.views}</div>
                  <div className="text-xs" style={{ color: tema.textoSecundario }}>Visualizaciones</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(offer.id, offer.status === 'active' ? 'paused' : 'active');
                    }}
                    className="p-2 rounded-lg hover:shadow-md transition-all duration-200"
                    style={{ backgroundColor: `${tema.primario}10` }}
                  >
                    <span className="text-lg">{offer.status === 'active' ? '⏸️' : '▶️'}</span>
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit
                    }}
                    className="p-2 rounded-lg hover:shadow-md transition-all duration-200"
                    style={{ backgroundColor: `${tema.secundario}10` }}
                  >
                    <span className="text-lg">✏️</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-xs" style={{ color: tema.textoSecundario }}>
              <span>Creada: {offer.createdAt.toLocaleDateString('es-ES')}</span>
              <span>Expira: {offer.expiresAt.toLocaleDateString('es-ES')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Recommendations */}
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
            <h3 className="text-lg font-semibold mb-2" style={{ color: tema.texto }}>Recomendaciones IA</h3>
            <div className="space-y-2 text-sm" style={{ color: tema.textoSecundario }}>
              <p>• <strong>Optimización:</strong> Tus ofertas de IT tienen 40% más engagement - considera crear más</p>
              <p>• <strong>Timing:</strong> Publicar ofertas los martes genera 25% más visualizaciones</p>
              <p>• <strong>Salarios:</strong> El rango 35k-42k está 7% por encima del mercado - muy competitivo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && <CreateOfferForm />}
      
      {/* Offer Detail Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: tema.texto }}>{selectedOffer.title}</h2>
              <button 
                onClick={() => setSelectedOffer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4" style={{ color: tema.texto }}>Detalles de la Oferta</h3>
                <div className="space-y-3 text-sm">
                  <div><strong>Departamento:</strong> {selectedOffer.department}</div>
                  <div><strong>Ubicación:</strong> {selectedOffer.location}</div>
                  <div><strong>Salario:</strong> {selectedOffer.salary}</div>
                  <div><strong>Tipo:</strong> {selectedOffer.type}</div>
                  <div><strong>Estado:</strong> {getStatusText(selectedOffer.status)}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4" style={{ color: tema.texto }}>Estadísticas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: `${tema.primario}10` }}>
                    <div className="text-2xl font-bold" style={{ color: tema.primario }}>{selectedOffer.applications}</div>
                    <div className="text-sm" style={{ color: tema.textoSecundario }}>Candidatos</div>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: `${tema.secundario}10` }}>
                    <div className="text-2xl font-bold" style={{ color: tema.secundario }}>{selectedOffer.views}</div>
                    <div className="text-sm" style={{ color: tema.textoSecundario }}>Visualizaciones</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}