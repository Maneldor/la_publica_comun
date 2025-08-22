'use client';

import React, { useState } from 'react';
import { useTema } from '../../../hooks/useComunidad';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  BarChart3,
  MapPin,
  Users,
  Calendar,
  Settings,
  Globe,
  Target,
  Filter
} from 'lucide-react';

interface OfertaComercial {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  descuento: {
    valor: number;
    tipo: 'PORCENTAJE' | 'CANTIDAD_FIJA' | 'PRECIO_ESPECIAL';
  };
  fechaInicio: Date;
  fechaVencimiento: Date;
  estado: 'BORRADOR' | 'ACTIVA' | 'PAUSADA' | 'EXPIRADA';
  visibilidad: {
    comunidades: string[];
    grupos: string[];
    tipoDistribucion: 'TODAS_COMUNIDADES' | 'COMUNIDADES_SELECCIONADAS' | 'GRUPOS_ESPECIFICOS';
  };
  estadisticas: {
    visualizaciones: number;
    canjes: number;
    favoritos: number;
  };
  presupuesto: {
    gastado: number;
    limite: number;
  };
}

const mockOfertas: OfertaComercial[] = [
  {
    id: '1',
    titulo: 'MacBook Air M2 - 15% descuento',
    descripcion: 'Potencia tu productividad con la última generación de MacBook Air.',
    categoria: 'TECNOLOGIA',
    descuento: { valor: 15, tipo: 'PORCENTAJE' },
    fechaInicio: new Date('2025-01-01'),
    fechaVencimiento: new Date('2025-03-31'),
    estado: 'ACTIVA',
    visibilidad: {
      comunidades: ['catalunya', 'madrid', 'andalucia'],
      grupos: [],
      tipoDistribucion: 'COMUNIDADES_SELECCIONADAS'
    },
    estadisticas: { visualizaciones: 1247, canjes: 89, favoritos: 156 },
    presupuesto: { gastado: 2340, limite: 5000 }
  },
  {
    id: '2',
    titulo: 'Curso Excel Avanzado - 50% descuento',
    descripcion: 'Mejora tus habilidades con Excel avanzado para empleados públicos.',
    categoria: 'EDUCACION_FORMACION',
    descuento: { valor: 50, tipo: 'PORCENTAJE' },
    fechaInicio: new Date('2025-01-15'),
    fechaVencimiento: new Date('2025-02-28'),
    estado: 'ACTIVA',
    visibilidad: {
      comunidades: [],
      grupos: ['funcionaris-educacio', 'administracio-digital', 'gestores-publics'],
      tipoDistribucion: 'GRUPOS_ESPECIFICOS'
    },
    estadisticas: { visualizaciones: 856, canjes: 67, favoritos: 134 },
    presupuesto: { gastado: 1200, limite: 3000 }
  },
  {
    id: '3',
    titulo: 'Revisión dental gratuita',
    descripcion: 'Cuida tu salud bucal con nuestra revisión completa gratuita.',
    categoria: 'SALUD_BIENESTAR',
    descuento: { valor: 100, tipo: 'CANTIDAD_FIJA' },
    fechaInicio: new Date('2025-02-01'),
    fechaVencimiento: new Date('2025-06-30'),
    estado: 'BORRADOR',
    visibilidad: {
      comunidades: [],
      grupos: [],
      tipoDistribucion: 'TODAS_COMUNIDADES'
    },
    estadisticas: { visualizaciones: 0, canjes: 0, favoritos: 0 },
    presupuesto: { gastado: 0, limite: 2000 }
  }
];

const comunidades = [
  { id: 'catalunya', nombre: 'Catalunya', activa: true },
  { id: 'madrid', nombre: 'Madrid', activa: true },
  { id: 'andalucia', nombre: 'Andalucía', activa: true },
  { id: 'valencia', nombre: 'Comunitat Valenciana', activa: true },
  { id: 'galicia', nombre: 'Galicia', activa: true },
  { id: 'euskadi', nombre: 'Euskadi', activa: true }
];

const gruposProfesionales = [
  { id: 'funcionaris-educacio', nombre: 'Funcionarios de Educación Catalunya', miembros: 247 },
  { id: 'administracio-digital', nombre: 'Administración Digital Madrid', miembros: 189 },
  { id: 'gestores-publics', nombre: 'Gestores Públicos Valencia', miembros: 156 },
  { id: 'sanidad-andalucia', nombre: 'Sanidad Pública Andalucía', miembros: 312 },
  { id: 'educacion-galicia', nombre: 'Educación Galicia', miembros: 198 },
  { id: 'hacienda-euskadi', nombre: 'Hacienda Foral Euskadi', miembros: 143 }
];

export function OfertasComerciales() {
  const tema = useTema();
  const [ofertas] = useState<OfertaComercial[]>(mockOfertas);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<OfertaComercial | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODAS');

  const ofertasFiltradas = filtroEstado === 'TODAS' 
    ? ofertas 
    : ofertas.filter(o => o.estado === filtroEstado);

  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case 'ACTIVA': return '🟢';
      case 'PAUSADA': return '⏸️';
      case 'BORRADOR': return '📝';
      case 'EXPIRADA': return '🔴';
      default: return '⚪';
    }
  };

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'ACTIVA': return 'bg-green-100 text-green-800';
      case 'PAUSADA': return 'bg-yellow-100 text-yellow-800';
      case 'BORRADOR': return 'bg-gray-100 text-gray-800';
      case 'EXPIRADA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const obtenerTextoDistribucion = (visibilidad: OfertaComercial['visibilidad']) => {
    switch (visibilidad.tipoDistribucion) {
      case 'TODAS_COMUNIDADES':
        return 'Todas las comunidades';
      case 'COMUNIDADES_SELECCIONADAS':
        return `${visibilidad.comunidades.length} comunidades`;
      case 'GRUPOS_ESPECIFICOS':
        return `${visibilidad.grupos.length} grupos específicos`;
      default:
        return 'Sin configurar';
    }
  };

  const handleConfiguracionDistribucion = (oferta: OfertaComercial) => {
    setOfertaSeleccionada(oferta);
    setMostrarConfiguracion(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ofertas Comerciales</h1>
          <p className="text-gray-600 mt-1">Gestiona tus ofertas y su distribución por comunidades y grupos</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="TODAS">Todas las ofertas</option>
            <option value="ACTIVA">Activas</option>
            <option value="PAUSADA">Pausadas</option>
            <option value="BORRADOR">Borradores</option>
            <option value="EXPIRADA">Expiradas</option>
          </select>
          <button
            onClick={() => setMostrarModal(true)}
            className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: tema.primario }}
          >
            <Plus size={20} />
            <span>Nueva Oferta</span>
          </button>
        </div>
      </div>

      {/* Estadísticas Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Ofertas Activas', valor: ofertas.filter(o => o.estado === 'ACTIVA').length, icono: '🟢' },
          { label: 'Total Visualizaciones', valor: ofertas.reduce((sum, o) => sum + o.estadisticas.visualizaciones, 0), icono: '👁️' },
          { label: 'Total Canjes', valor: ofertas.reduce((sum, o) => sum + o.estadisticas.canjes, 0), icono: '💰' },
          { label: 'Presupuesto Gastado', valor: `${ofertas.reduce((sum, o) => sum + o.presupuesto.gastado, 0)}€`, icono: '📊' }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.valor}</p>
              </div>
              <span className="text-2xl">{stat.icono}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lista de Ofertas */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oferta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distribución
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estadísticas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presupuesto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ofertasFiltradas.map((oferta) => (
                <tr key={oferta.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{oferta.titulo}</div>
                      <div className="text-sm text-gray-500">{oferta.categoria}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {oferta.descuento.valor}{oferta.descuento.tipo === 'PORCENTAJE' ? '%' : '€'} descuento
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenerColorEstado(oferta.estado)}`}>
                      {obtenerIconoEstado(oferta.estado)} {oferta.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-900">{obtenerTextoDistribucion(oferta.visibilidad)}</div>
                      <button
                        onClick={() => handleConfiguracionDistribucion(oferta)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Configurar distribución"
                      >
                        <Settings size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{oferta.estadisticas.visualizaciones} views</div>
                      <div>{oferta.estadisticas.canjes} canjes</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{oferta.presupuesto.gastado}€ / {oferta.presupuesto.limite}€</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(oferta.presupuesto.gastado / oferta.presupuesto.limite) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-purple-600">
                        <Copy size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Configuración de Distribución */}
      {mostrarConfiguracion && ofertaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            
            {/* Header del modal */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Configurar Distribución
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {ofertaSeleccionada.titulo}
                  </p>
                </div>
                <button
                  onClick={() => setMostrarConfiguracion(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              
              {/* Tipo de distribución */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tipo de Distribución</h3>
                <div className="space-y-3">
                  {[
                    { 
                      id: 'TODAS_COMUNIDADES', 
                      titulo: 'Todas las Comunidades', 
                      descripcion: 'La oferta se mostrará en todas las comunidades autónomas disponibles',
                      icono: <Globe size={20} className="text-blue-500" />
                    },
                    { 
                      id: 'COMUNIDADES_SELECCIONADAS', 
                      titulo: 'Comunidades Específicas', 
                      descripcion: 'Selecciona qué comunidades autónomas verán la oferta',
                      icono: <MapPin size={20} className="text-green-500" />
                    },
                    { 
                      id: 'GRUPOS_ESPECIFICOS', 
                      titulo: 'Grupos Profesionales', 
                      descripcion: 'Dirigida a grupos profesionales específicos',
                      icono: <Target size={20} className="text-purple-500" />
                    }
                  ].map((opcion) => (
                    <label key={opcion.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="tipoDistribucion"
                        value={opcion.id}
                        checked={ofertaSeleccionada.visibilidad.tipoDistribucion === opcion.id}
                        className="mt-1"
                      />
                      <div className="flex-shrink-0 mt-0.5">{opcion.icono}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{opcion.titulo}</div>
                        <div className="text-xs text-gray-600">{opcion.descripcion}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Selección de Comunidades */}
              {ofertaSeleccionada.visibilidad.tipoDistribucion === 'COMUNIDADES_SELECCIONADAS' && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Comunidades Autónomas</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {comunidades.map((comunidad) => (
                      <label key={comunidad.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ofertaSeleccionada.visibilidad.comunidades.includes(comunidad.id)}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{comunidad.nombre}</div>
                          <div className="text-xs text-gray-600">{comunidad.activa ? 'Activa' : 'Inactiva'}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Selección de Grupos */}
              {ofertaSeleccionada.visibilidad.tipoDistribucion === 'GRUPOS_ESPECIFICOS' && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Grupos Profesionales</h3>
                  <div className="space-y-2">
                    {gruposProfesionales.map((grupo) => (
                      <label key={grupo.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={ofertaSeleccionada.visibilidad.grupos.includes(grupo.id)}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{grupo.nombre}</div>
                            <div className="text-xs text-gray-600">{grupo.miembros} miembros</div>
                          </div>
                        </div>
                        <Users size={16} className="text-gray-400" />
                      </label>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Footer del modal */}
            <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
              <div className="text-sm text-gray-600">
                💡 Los cambios se aplicarán inmediatamente a tu oferta
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setMostrarConfiguracion(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setMostrarConfiguracion(false)}
                  className="px-4 py-2 text-white rounded-lg"
                  style={{ backgroundColor: tema.primario }}
                >
                  Guardar Configuración
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}