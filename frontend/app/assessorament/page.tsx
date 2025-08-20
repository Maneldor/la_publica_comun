'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Star, 
  Users, 
  Award, 
  CheckCircle,
  Globe,
  Calendar,
  MessageCircle,
  Video,
  DollarSign,
  Gift
} from 'lucide-react';
import LayoutGeneral from '../../src/componentes/comunes/LayoutGeneral';
import { useComunidad } from '../../hooks/useComunidad';
import { crearContenidoMultiidioma } from '../../hooks/useContenidoTraducido';
import { 
  TipoAsesorament, 
  ModalitatiAsesorament, 
  ServeiAsesorament, 
  FiltresAsesorament,
  EstadistiquesAsesorament 
} from '../../tipos/asesorament';
import { TarjetaServei } from '../../src/componentes/assessorament';

// Traducciones
const traducciones = {
  ca: {
    titulo: 'Assessorament Professional',
    subtitulo: 'Serveis d\'assessorament especialitzats per a empleats públics',
    buscar: 'Cercar serveis d\'assessorament...',
    filtrar: 'Filtres',
    totalServeis: 'serveis disponibles',
    gratuit: 'Gratuït',
    primeraConsultaGratuita: 'Primera consulta gratuïta',
    descompte: 'Descompte especial',
    modalitats: 'Modalitats',
    horari: 'Horari d\'atenció',
    contactar: 'Sol·licitar Assessorament',
    puntuacio: 'Puntuació',
    ressenyes: 'ressenyes',
    provincia: 'Província',
    totes: 'Totes',
    tipusAssessorament: {
      JURIDIC: 'Jurídic',
      FISCAL: 'Fiscal',
      LABORAL: 'Laboral',
      FINANCIER: 'Financer',
      IMMOBILIARI: 'Immobiliari',
      FAMILIAR: 'Familiar',
      PENAL: 'Penal',
      ADMINISTRATIU: 'Administratiu',
      ALTRES: 'Altres'
    },
    modalitatsAten: {
      TELEFONIC: 'Telefònic',
      PRESENCIAL: 'Presencial',
      EMAIL: 'Correu electrònic',
      VIDEOCONFERENCIA: 'Videoconferència',
      CHAT: 'Chat en línia'
    }
  },
  es: {
    titulo: 'Asesoramiento Profesional',
    subtitulo: 'Servicios de asesoramiento especializados para empleados públicos',
    buscar: 'Buscar servicios de asesoramiento...',
    filtrar: 'Filtros',
    totalServeis: 'servicios disponibles',
    gratuit: 'Gratuito',
    primeraConsultaGratuita: 'Primera consulta gratuita',
    descompte: 'Descuento especial',
    modalitats: 'Modalidades',
    horari: 'Horario de atención',
    contactar: 'Solicitar Asesoramiento',
    puntuacio: 'Puntuación',
    ressenyes: 'reseñas',
    provincia: 'Provincia',
    totes: 'Todas',
    tipusAssessorament: {
      JURIDIC: 'Jurídico',
      FISCAL: 'Fiscal',
      LABORAL: 'Laboral',
      FINANCIER: 'Financiero',
      IMMOBILIARI: 'Inmobiliario',
      FAMILIAR: 'Familiar',
      PENAL: 'Penal',
      ADMINISTRATIU: 'Administrativo',
      ALTRES: 'Otros'
    },
    modalitatsAten: {
      TELEFONIC: 'Telefónico',
      PRESENCIAL: 'Presencial',
      EMAIL: 'Correo electrónico',
      VIDEOCONFERENCIA: 'Videoconferencia',
      CHAT: 'Chat en línea'
    }
  }
};

export default function AssessoramentPage() {
  const router = useRouter();
  const { usuario, idioma } = useComunidad();
  const [busqueda, setBusqueda] = useState('');
  const [filtres, setFiltres] = useState<FiltresAsesorament>({});
  const [serveis, setServeis] = useState<ServeiAsesorament[]>([]);
  const [servicesFiltrats, setServicesFiltrats] = useState<ServeiAsesorament[]>([]);
  const [estadistiques, setEstadistiques] = useState<EstadistiquesAsesorament | null>(null);
  const [cargando, setCargando] = useState(true);

  const t = (traducciones as any)[idioma] || traducciones.es;

  // Mock data de servicios de asesoramiento
  useEffect(() => {
    const cargarDades = async () => {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockServeis: ServeiAsesorament[] = [
        {
          id: '1',
          empresa: {
            id: 'emp1',
            nom: 'Assessoria Jurídica Barcelona',
            logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
            descripcio: crearContenidoMultiidioma(
              'Especialistes en dret administratiu i laboral per a empleats públics',
              'ca',
              {
                ca: 'Especialistes en dret administratiu i laboral per a empleats públics',
                es: 'Especialistas en derecho administrativo y laboral para empleados públicos'
              }
            ),
            especialitats: ['JURIDIC', 'LABORAL', 'ADMINISTRATIU'],
            ubicacio: { provincia: 'Barcelona', ciutat: 'Barcelona', direccio: 'Carrer Major, 123' },
            contacte: { telefon: '934 567 890', email: 'info@assessoria-bcn.com' },
            horariAtencio: {
              dilluns: { inici: '09:00', fi: '18:00' },
              dimarts: { inici: '09:00', fi: '18:00' },
              dimecres: { inici: '09:00', fi: '18:00' },
              dijous: { inici: '09:00', fi: '18:00' },
              divendres: { inici: '09:00', fi: '16:00' }
            },
            verificada: true,
            puntuacio: 4.8,
            totalRessenyes: 127,
            dataRegistre: new Date('2023-01-15')
          },
          tipus: 'JURIDIC',
          titol: crearContenidoMultiidioma(
            'Assessorament Jurídic Integral',
            'ca',
            {
              ca: 'Assessorament Jurídic Integral',
              es: 'Asesoramiento Jurídico Integral'
            }
          ),
          descripcio: crearContenidoMultiidioma(
            'Consultes sobre procediments administratius, recursos, règim disciplinari i drets laborals',
            'ca',
            {
              ca: 'Consultes sobre procediments administratius, recursos, règim disciplinari i drets laborals',
              es: 'Consultas sobre procedimientos administrativos, recursos, régimen disciplinario y derechos laborales'
            }
          ),
          modalitats: ['PRESENCIAL', 'TELEFONIC', 'VIDEOCONFERENCIA'],
          tarifa: {
            tipus: 'PRIMERA_CONSULTA_GRATUITA',
            descripcio: crearContenidoMultiidioma(
              'Primera consulta de 30 minuts gratuïta, consultes posteriors 60€/hora',
              'ca',
              {
                ca: 'Primera consulta de 30 minuts gratuïta, consultes posteriors 60€/hora',
                es: 'Primera consulta de 30 minutos gratuita, consultas posteriores 60€/hora'
              }
            )
          },
          duracio: '30-60 min',
          idiomes: ['ca', 'es'],
          disponible: true,
          primeraConsultaGratuita: true,
          consultaUrgent: true,
          desplacament: false,
          consultesTotals: 245,
          puntuacioMitjana: 4.8,
          totalRessenyes: 89,
          dataCreacio: new Date('2023-02-01'),
          dataActualitzacio: new Date('2024-01-15'),
          actiu: true
        },
        {
          id: '2',
          empresa: {
            id: 'emp2',
            nom: 'Fiscalitat i Gestió',
            logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop',
            descripcio: crearContenidoMultiidioma(
              'Experts en fiscalitat i gestió patrimonial per a funcionaris',
              'ca',
              {
                ca: 'Experts en fiscalitat i gestió patrimonial per a funcionaris',
                es: 'Expertos en fiscalidad y gestión patrimonial para funcionarios'
              }
            ),
            especialitats: ['FISCAL', 'FINANCIER'],
            ubicacio: { provincia: 'Barcelona', ciutat: 'Girona' },
            contacte: { telefon: '972 123 456', email: 'consultes@fiscalitat.cat' },
            horariAtencio: {
              dilluns: { inici: '08:30', fi: '19:00' },
              dimarts: { inici: '08:30', fi: '19:00' },
              dimecres: { inici: '08:30', fi: '19:00' },
              dijous: { inici: '08:30', fi: '19:00' },
              divendres: { inici: '08:30', fi: '15:00' }
            },
            verificada: true,
            puntuacio: 4.6,
            totalRessenyes: 95,
            dataRegistre: new Date('2023-03-10')
          },
          tipus: 'FISCAL',
          titol: crearContenidoMultiidioma(
            'Assessorament Fiscal Personalitzat',
            'ca',
            {
              ca: 'Assessorament Fiscal Personalitzat',
              es: 'Asesoramiento Fiscal Personalizado'
            }
          ),
          descripcio: crearContenidoMultiidioma(
            'Declaració de renda, planificació fiscal, inversions i patrimoni per a funcionaris públics',
            'ca',
            {
              ca: 'Declaració de renda, planificació fiscal, inversions i patrimoni per a funcionaris públics',
              es: 'Declaración de renta, planificación fiscal, inversiones y patrimonio para funcionarios públicos'
            }
          ),
          modalitats: ['PRESENCIAL', 'TELEFONIC', 'EMAIL'],
          tarifa: {
            tipus: 'DESCOMPTE',
            percentatgeDescompte: 20,
            descripcio: crearContenidoMultiidioma(
              '20% de descompte sobre tarifes generals per a empleats públics',
              'ca',
              {
                ca: '20% de descompte sobre tarifes generals per a empleats públics',
                es: '20% de descuento sobre tarifas generales para empleados públicos'
              }
            )
          },
          duracio: '45-90 min',
          idiomes: ['ca', 'es'],
          disponible: true,
          primeraConsultaGratuita: false,
          consultaUrgent: false,
          desplacament: true,
          consultesTotals: 178,
          puntuacioMitjana: 4.6,
          totalRessenyes: 67,
          dataCreacio: new Date('2023-03-15'),
          dataActualitzacio: new Date('2024-01-10'),
          actiu: true
        },
        {
          id: '3',
          empresa: {
            id: 'emp3',
            nom: 'Laboral Experts',
            logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=200&fit=crop',
            descripcio: crearContenidoMultiidioma(
              'Especialistes en dret laboral i relacions sindicals',
              'ca',
              {
                ca: 'Especialistes en dret laboral i relacions sindicals',
                es: 'Especialistas en derecho laboral y relaciones sindicales'
              }
            ),
            especialitats: ['LABORAL', 'JURIDIC'],
            ubicacio: { provincia: 'Barcelona', ciutat: 'Sabadell' },
            contacte: { telefon: '937 890 123', email: 'info@laboralexperts.com', whatsapp: '637 890 123' },
            horariAtencio: {
              dilluns: { inici: '09:00', fi: '17:30' },
              dimarts: { inici: '09:00', fi: '17:30' },
              dimecres: { inici: '09:00', fi: '17:30' },
              dijous: { inici: '09:00', fi: '17:30' },
              divendres: { inici: '09:00', fi: '15:00' }
            },
            verificada: true,
            puntuacio: 4.9,
            totalRessenyes: 203,
            dataRegistre: new Date('2022-11-20')
          },
          tipus: 'LABORAL',
          titol: crearContenidoMultiidioma(
            'Consultoria Laboral Especialitzada',
            'ca',
            {
              ca: 'Consultoria Laboral Especialitzada',
              es: 'Consultoría Laboral Especializada'
            }
          ),
          descripcio: crearContenidoMultiidioma(
            'Conflictes laborals, negociació col·lectiva, promocions, trasllats i drets sindicals',
            'ca',
            {
              ca: 'Conflictes laborals, negociació col·lectiva, promocions, trasllats i drets sindicals',
              es: 'Conflictos laborales, negociación colectiva, promociones, traslados y derechos sindicales'
            }
          ),
          modalitats: ['TELEFONIC', 'EMAIL', 'CHAT', 'VIDEOCONFERENCIA'],
          tarifa: {
            tipus: 'GRATUITA',
            descripcio: crearContenidoMultiidioma(
              'Consultes bàsiques gratuïtes per a empleats públics afiliats a sindicats col·laboradors',
              'ca',
              {
                ca: 'Consultes bàsiques gratuïtes per a empleats públics afiliats a sindicats col·laboradors',
                es: 'Consultas básicas gratuitas para empleados públicos afiliados a sindicatos colaboradores'
              }
            )
          },
          duracio: '20-45 min',
          idiomes: ['ca', 'es'],
          disponible: true,
          primeraConsultaGratuita: true,
          consultaUrgent: true,
          desplacament: false,
          consultesTotals: 389,
          puntuacioMitjana: 4.9,
          totalRessenyes: 156,
          dataCreacio: new Date('2022-12-01'),
          dataActualitzacio: new Date('2024-01-20'),
          actiu: true
        }
      ];

      const mockEstadistiques: EstadistiquesAsesorament = {
        totalServeis: mockServeis.length,
        serveisProvincia: { Barcelona: 3 },
        serveisPerTipus: {
          JURIDIC: 2,
          FISCAL: 1,
          LABORAL: 2,
          FINANCIER: 1,
          IMMOBILIARI: 0,
          FAMILIAR: 0,
          PENAL: 0,
          ADMINISTRATIU: 1,
          ALTRES: 0
        },
        solicitudsActives: 23,
        solicitudsResoltes: 156,
        puntuacioMitjanaGlobal: 4.7,
        empresesActives: 3
      };

      setServeis(mockServeis);
      setServicesFiltrats(mockServeis);
      setEstadistiques(mockEstadistiques);
      setCargando(false);
    };

    cargarDades();
  }, []);

  // Filtrar servicios
  useEffect(() => {
    let resultats = [...serveis];

    // Filtro de búsqueda por texto
    if (busqueda.trim()) {
      const terme = busqueda.toLowerCase();
      resultats = resultats.filter(servei => {
        // Buscar en el título (texto principal y traducciones)
        const tituloMatch = servei.titol.texto.toLowerCase().includes(terme) ||
          (servei.titol.traducciones?.ca && servei.titol.traducciones.ca.toLowerCase().includes(terme)) ||
          (servei.titol.traducciones?.es && servei.titol.traducciones.es.toLowerCase().includes(terme));
        
        // Buscar en la descripción (texto principal y traducciones)  
        const descripcionMatch = servei.descripcio.texto.toLowerCase().includes(terme) ||
          (servei.descripcio.traducciones?.ca && servei.descripcio.traducciones.ca.toLowerCase().includes(terme)) ||
          (servei.descripcio.traducciones?.es && servei.descripcio.traducciones.es.toLowerCase().includes(terme));
          
        // Buscar en empresa y ubicación
        const empresaMatch = servei.empresa.nom.toLowerCase().includes(terme);
        const ubicacionMatch = servei.empresa.ubicacio.ciutat.toLowerCase().includes(terme) ||
          servei.empresa.ubicacio.provincia.toLowerCase().includes(terme);
          
        // Buscar en tipo de asesoramiento
        const tipoMatch = servei.tipus.toLowerCase().includes(terme);
        
        return tituloMatch || descripcionMatch || empresaMatch || ubicacionMatch || tipoMatch;
      });
    }

    // Filtros específicos
    if (filtres.tipus) {
      resultats = resultats.filter(servei => servei.tipus === filtres.tipus);
    }

    if (filtres.provincia) {
      resultats = resultats.filter(servei => servei.empresa.ubicacio.provincia === filtres.provincia);
    }

    if (filtres.gratuita) {
      resultats = resultats.filter(servei => servei.tarifa.tipus === 'GRATUITA');
    }

    if (filtres.primeraConsultaGratuita) {
      resultats = resultats.filter(servei => servei.primeraConsultaGratuita);
    }

    // Ordenación
    if (filtres.ordenPer) {
      resultats.sort((a, b) => {
        switch (filtres.ordenPer) {
          case 'PUNTUACIO':
            return (b.puntuacioMitjana || 0) - (a.puntuacioMitjana || 0);
          case 'DISPONIBILITAT':
            return a.disponible === b.disponible ? 0 : a.disponible ? -1 : 1;
          default:
            return 0;
        }
      });
    }

    setServicesFiltrats(resultats);
  }, [serveis, busqueda, filtres]);

  const handleSolicitar = (serveiId: string) => {
    router.push(`/assessorament/${serveiId}/solicitar`);
  };

  const handleLimpiarFiltros = () => {
    setBusqueda('');
    setFiltres({});
  };


  if (cargando) {
    return (
      <LayoutGeneral paginaActual="assessorament">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </LayoutGeneral>
    );
  }

  return (
    <LayoutGeneral paginaActual="assessorament">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t.titulo}
              </h1>
              <p className="text-gray-600">
                {t.subtitulo}
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        {estadistiques && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Serveis</p>
                  <p className="text-2xl font-bold text-gray-900">{estadistiques.totalServeis}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sol·licituds Actives</p>
                  <p className="text-2xl font-bold text-gray-900">{estadistiques.solicitudsActives}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Puntuació Mitjana</p>
                  <p className="text-2xl font-bold text-gray-900">{estadistiques.puntuacioMitjanaGlobal}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Empreses Actives</p>
                  <p className="text-2xl font-bold text-gray-900">{estadistiques.empresesActives}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Búsqueda y filtros */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
            
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.buscar}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4">
              <select
                value={filtres.tipus || ''}
                onChange={(e) => setFiltres(prev => ({ ...prev, tipus: e.target.value as TipoAsesorament || undefined }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t.totes}</option>
                {Object.entries(t.tipusAssessorament).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              <select
                value={filtres.provincia || ''}
                onChange={(e) => setFiltres(prev => ({ ...prev, provincia: e.target.value || undefined }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t.totes} {t.provincia}</option>
                <option value="Barcelona">Barcelona</option>
                <option value="Madrid">Madrid</option>
                <option value="Valencia">Valencia</option>
              </select>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filtres.primeraConsultaGratuita || false}
                  onChange={(e) => setFiltres(prev => ({ ...prev, primeraConsultaGratuita: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{t.primeraConsultaGratuita}</span>
              </label>

              {/* Botón limpiar filtros */}
              {(busqueda.trim() || Object.keys(filtres).length > 0) && (
                <button
                  onClick={handleLimpiarFiltros}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Netejar filtres
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {servicesFiltrats.length} {t.totalServeis}
              {servicesFiltrats.length < serveis.length && (
                <span className="text-gray-400"> de {serveis.length} totals</span>
              )}
            </div>
            
            {/* Indicador de filtros activos */}
            {(busqueda.trim() || Object.keys(filtres).length > 0) && (
              <div className="text-sm text-blue-600">
                Filtres actius
              </div>
            )}
          </div>
        </div>

        {/* Lista de servicios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {servicesFiltrats.map((servei) => (
            <TarjetaServei
              key={servei.id}
              servei={servei}
              onSolicitar={handleSolicitar}
              translations={t}
            />
          ))}
        </div>

        {/* Estado vacío */}
        {servicesFiltrats.length === 0 && !cargando && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {busqueda.trim() || Object.keys(filtres).length > 0 
                ? "No s'han trobat serveis que coincideixin" 
                : "No hi ha serveis disponibles"}
            </h3>
            <p className="text-gray-600 mb-4">
              {busqueda.trim() || Object.keys(filtres).length > 0 
                ? "Intenta amb altres termes de cerca o filtres diferents" 
                : "No hi ha serveis d'assessorament configurats actualment"}
            </p>
            {(busqueda.trim() || Object.keys(filtres).length > 0) && (
              <button
                onClick={handleLimpiarFiltros}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Netejar tots els filtres
              </button>
            )}
          </div>
        )}
        
      </div>
    </LayoutGeneral>
  );
}