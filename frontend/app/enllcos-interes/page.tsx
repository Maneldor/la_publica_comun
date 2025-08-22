'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Building,
  Award,
  Eye,
  MousePointer
} from 'lucide-react';
import LayoutGeneral from '../../src/componentes/comunes/LayoutGeneral';
import { useComunidad } from '../../hooks/useComunidad';
import { crearContenidoMultiidioma } from '../../src/utils/contenidoMultiidioma';
import { 
  TipusInstitucio, 
  AmbitTerritorial, 
  InstitucioEnllac, 
  FiltresEnllacos,
  EstadistiquesEnllacos,
  TIPUS_INSTITUCIONS_METADATA
} from '../../tipos/enllcos';
import { TarjetaInstitucio } from '../../src/componentes/enllcos';

// Traducciones
const traducciones = {
  ca: {
    titulo: 'Enllaços d\'Interès',
    subtitulo: 'Directori d\'institucions, sindicats i organismes útils per a empleats públics',
    buscar: 'Cercar institucions...',
    filtrar: 'Filtres',
    totalInstitucions: 'institucions disponibles',
    visitarWeb: 'Visitar web',
    tipus: 'Tipus',
    ambit: 'Àmbit',
    provincia: 'Província',
    tots: 'Tots',
    netejarFiltres: 'Netejar filtres',
    ambits: {
      LOCAL: 'Local',
      COMARCAL: 'Comarcal', 
      PROVINCIAL: 'Provincial',
      AUTONOMIC: 'Autonòmic',
      ESTATAL: 'Estatal',
      INTERNACIONAL: 'Internacional'
    },
    estadistiques: {
      total: 'Total institucions',
      visites: 'Visites totals',
      verificades: 'Verificades',
      destacades: 'Destacades'
    }
  },
  es: {
    titulo: 'Enlaces de Interés',
    subtitulo: 'Directorio de instituciones, sindicatos y organismos útiles para empleados públicos',
    buscar: 'Buscar instituciones...',
    filtrar: 'Filtros',
    totalInstitucions: 'instituciones disponibles',
    visitarWeb: 'Visitar web',
    tipus: 'Tipo',
    ambit: 'Ámbito',
    provincia: 'Provincia',
    tots: 'Todos',
    netejarFiltres: 'Limpiar filtros',
    ambits: {
      LOCAL: 'Local',
      COMARCAL: 'Comarcal',
      PROVINCIAL: 'Provincial', 
      AUTONOMIC: 'Autonómico',
      ESTATAL: 'Estatal',
      INTERNACIONAL: 'Internacional'
    },
    estadistiques: {
      total: 'Total instituciones',
      visites: 'Visitas totales',
      verificades: 'Verificadas',
      destacades: 'Destacadas'
    }
  }
};

export default function EnllaçosInteresPage() {
  const { idioma } = useComunidad();
  const [busqueda, setBusqueda] = useState('');
  const [filtres, setFiltres] = useState<FiltresEnllacos>({});
  const [institucions, setInstitucions] = useState<InstitucioEnllac[]>([]);
  const [institucionsFiltrades, setInstitucionsFiltrades] = useState<InstitucioEnllac[]>([]);
  const [estadistiques, setEstadistiques] = useState<EstadistiquesEnllacos | null>(null);
  const [cargando, setCargando] = useState(true);

  const t = (traducciones as any)[idioma] || traducciones.es;

  // Mock data de instituciones
  useEffect(() => {
    const cargarDades = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockInstitucions: InstitucioEnllac[] = [
        {
          id: '1',
          nom: crearContenidoMultiidioma('Ajuntament de Barcelona', 'ca'),
          tipus: 'AJUNTAMENT',
          ambit: 'LOCAL',
          descripcio: crearContenidoMultiidioma(
            'Ajuntament de la ciutat de Barcelona. Portal de tràmits i serveis municipals.',
            'ca',
            {
              ca: 'Ajuntament de la ciutat de Barcelona. Portal de tràmits i serveis municipals.',
              es: 'Ayuntamiento de la ciudad de Barcelona. Portal de trámites y servicios municipales.'
            }
          ),
          logo: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=200&h=200&fit=crop',
          contacte: {
            telefon: '010',
            email: 'ajuntament@bcn.cat',
            web: 'www.barcelona.cat',
            adreça: 'Plaça de Sant Jaume, 1',
            codiPostal: '08002',
            ciutat: 'Barcelona',
            provincia: 'Barcelona'
          },
          tags: ['tràmits', 'serveis', 'municipal', 'oposicions'],
          sectors: ['administració'],
          verificat: true,
          destacat: true,
          dataRegistre: new Date('2023-01-10'),
          dataActualitzacio: new Date('2024-01-15'),
          actiu: true,
          visites: 1547,
          clics: 892
        },
        {
          id: '2',
          nom: crearContenidoMultiidioma('CCOO Catalunya', 'ca'),
          tipus: 'SINDICAT',
          ambit: 'AUTONOMIC',
          descripcio: crearContenidoMultiidioma(
            'Comissions Obreres de Catalunya. Sindicat de classe, unitari, democràtic, participatiu i sociopolític.',
            'ca',
            {
              ca: 'Comissions Obreres de Catalunya. Sindicat de classe, unitari, democràtic, participatiu i sociopolític.',
              es: 'Comisiones Obreras de Cataluña. Sindicato de clase, unitario, democrático, participativo y sociopolítico.'
            }
          ),
          logo: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&h=200&fit=crop',
          contacte: {
            telefon: '93 481 27 00',
            email: 'info@ccoo.cat',
            web: 'www.ccoo.cat',
            adreça: 'Via Laietana, 16',
            codiPostal: '08003',
            ciutat: 'Barcelona',
            provincia: 'Barcelona'
          },
          tags: ['sindicat', 'drets laborals', 'negociació', 'formació'],
          sectors: ['laboral', 'social'],
          verificat: true,
          destacat: true,
          dataRegistre: new Date('2023-02-05'),
          dataActualitzacio: new Date('2024-01-10'),
          actiu: true,
          visites: 987,
          clics: 543
        },
        {
          id: '3',
          nom: crearContenidoMultiidioma('Generalitat de Catalunya', 'ca'),
          tipus: 'GENERALITAT',
          ambit: 'AUTONOMIC',
          descripcio: crearContenidoMultiidioma(
            'Portal oficial del govern de Catalunya. Tràmits, oposicions i informació per a empleats públics.',
            'ca',
            {
              ca: 'Portal oficial del govern de Catalunya. Tràmits, oposicions i informació per a empleats públics.',
              es: 'Portal oficial del gobierno de Cataluña. Trámites, oposiciones e información para empleados públicos.'
            }
          ),
          logo: 'https://images.unsplash.com/photo-1580130379624-3a069adbffc5?w=200&h=200&fit=crop',
          contacte: {
            telefon: '012',
            email: 'gencat@gencat.cat',
            web: 'www.gencat.cat',
            adreça: 'Plaça de Sant Jaume, 4',
            codiPostal: '08002',
            ciutat: 'Barcelona',
            provincia: 'Barcelona'
          },
          tags: ['govern', 'oposicions', 'empleats públics', 'tràmits'],
          sectors: ['administració', 'funció pública'],
          verificat: true,
          destacat: true,
          dataRegistre: new Date('2023-01-05'),
          dataActualitzacio: new Date('2024-01-20'),
          actiu: true,
          visites: 2341,
          clics: 1234
        },
        {
          id: '4',
          nom: crearContenidoMultiidioma('Col·legi d\'Advocats de Barcelona', 'ca'),
          tipus: 'COL_LEGI_PROFESSIONAL',
          ambit: 'PROVINCIAL',
          descripcio: crearContenidoMultiidioma(
            'Il·lustre Col·legi d\'Advocats de Barcelona. Serveis professionals i formació contínua.',
            'ca',
            {
              ca: 'Il·lustre Col·legi d\'Advocats de Barcelona. Serveis professionals i formació contínua.',
              es: 'Ilustre Colegio de Abogados de Barcelona. Servicios profesionales y formación continua.'
            }
          ),
          logo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=200&fit=crop',
          contacte: {
            telefon: '93 496 18 80',
            email: 'icab@icab.cat',
            web: 'www.icab.cat',
            adreça: 'Carrer Mallorca, 283',
            codiPostal: '08037',
            ciutat: 'Barcelona',
            provincia: 'Barcelona'
          },
          tags: ['advocats', 'col·legi professional', 'formació', 'serveis jurídics'],
          sectors: ['jurídic'],
          verificat: true,
          destacat: false,
          dataRegistre: new Date('2023-03-12'),
          dataActualitzacio: new Date('2024-01-08'),
          actiu: true,
          visites: 675,
          clics: 234
        },
        {
          id: '5',
          nom: crearContenidoMultiidioma('UGT Catalunya', 'ca'),
          tipus: 'SINDICAT',
          ambit: 'AUTONOMIC', 
          descripcio: crearContenidoMultiidioma(
            'Unió General de Treballadors de Catalunya. Defensem els drets dels treballadors i treballadores.',
            'ca',
            {
              ca: 'Unió General de Treballadors de Catalunya. Defensem els drets dels treballadors i treballadores.',
              es: 'Unión General de Trabajadores de Cataluña. Defendemos los derechos de los trabajadores y trabajadoras.'
            }
          ),
          logo: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=200&h=200&fit=crop',
          contacte: {
            telefon: '93 342 61 00',
            email: 'catalunya@ugt.org',
            web: 'www.ugt.cat',
            adreça: 'Rambla de Santa Mònica, 10',
            codiPostal: '08002',
            ciutat: 'Barcelona',
            provincia: 'Barcelona'
          },
          tags: ['sindicat', 'treballadors', 'negociació col·lectiva'],
          sectors: ['laboral'],
          verificat: true,
          destacat: false,
          dataRegistre: new Date('2023-02-20'),
          dataActualitzacio: new Date('2024-01-12'),
          actiu: true,
          visites: 523,
          clics: 287
        },
        {
          id: '6',
          nom: crearContenidoMultiidioma('Diputació de Barcelona', 'ca'),
          tipus: 'DIPUTACIO',
          ambit: 'PROVINCIAL',
          descripcio: crearContenidoMultiidioma(
            'Diputació de Barcelona. Suport als ajuntaments i serveis supramunicipals.',
            'ca',
            {
              ca: 'Diputació de Barcelona. Suport als ajuntaments i serveis supramunicipals.',
              es: 'Diputación de Barcelona. Apoyo a ayuntamientos y servicios supramunicipales.'
            }
          ),
          logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop',
          contacte: {
            telefon: '93 402 25 00',
            email: 'diba@diba.cat',
            web: 'www.diba.cat',
            adreça: 'Rambla de Catalunya, 126',
            codiPostal: '08008',
            ciutat: 'Barcelona',
            provincia: 'Barcelona'
          },
          tags: ['diputació', 'municipal', 'serveis', 'suport'],
          sectors: ['administració'],
          verificat: true,
          destacat: false,
          dataRegistre: new Date('2023-01-25'),
          dataActualitzacio: new Date('2024-01-05'),
          actiu: true,
          visites: 434,
          clics: 189
        }
      ];

      const mockEstadistiques: EstadistiquesEnllacos = {
        totalInstitucions: mockInstitucions.length,
        institucionsPerTipus: {
          AJUNTAMENT: 1,
          DIPUTACIO: 1,
          GENERALITAT: 1,
          ESTAT: 0,
          SINDICAT: 2,
          ASSOCIACIO_PROFESSIONAL: 0,
          COL_LEGI_PROFESSIONAL: 1,
          DEPARTAMENT: 0,
          ORGANISME_AUTONOM: 0,
          UNIVERSITAT: 0,
          ALTRES: 0
        },
        institucionsPerAmbit: {
          LOCAL: 1,
          COMARCAL: 0,
          PROVINCIAL: 2,
          AUTONOMIC: 3,
          ESTATAL: 0,
          INTERNACIONAL: 0
        },
        institucionsPerProvincia: { Barcelona: 6 },
        totalVisites: mockInstitucions.reduce((sum, inst) => sum + inst.visites, 0),
        totalClics: mockInstitucions.reduce((sum, inst) => sum + inst.clics, 0),
        institucionsVerificades: mockInstitucions.filter(i => i.verificat).length,
        institucionsDestacades: mockInstitucions.filter(i => i.destacat).length
      };

      setInstitucions(mockInstitucions);
      setInstitucionsFiltrades(mockInstitucions);
      setEstadistiques(mockEstadistiques);
      setCargando(false);
    };

    cargarDades();
  }, []);

  // Filtrar instituciones
  useEffect(() => {
    let resultats = [...institucions];

    // Filtro de búsqueda por texto
    if (busqueda.trim()) {
      const terme = busqueda.toLowerCase();
      resultats = resultats.filter(inst => {
        const nomMatch = inst.nom.texto.toLowerCase().includes(terme) ||
          (inst.nom.traducciones?.ca && inst.nom.traducciones.ca.toLowerCase().includes(terme)) ||
          (inst.nom.traducciones?.es && inst.nom.traducciones.es.toLowerCase().includes(terme));
        
        const descripcionMatch = inst.descripcio.texto.toLowerCase().includes(terme) ||
          (inst.descripcio.traducciones?.ca && inst.descripcio.traducciones.ca.toLowerCase().includes(terme)) ||
          (inst.descripcio.traducciones?.es && inst.descripcio.traducciones.es.toLowerCase().includes(terme));
          
        const ubicacionMatch = inst.contacte.ciutat?.toLowerCase().includes(terme) ||
          inst.contacte.provincia?.toLowerCase().includes(terme);
          
        const tipusMatch = inst.tipus.toLowerCase().includes(terme);
        const tagsMatch = inst.tags.some(tag => tag.toLowerCase().includes(terme));
        
        return nomMatch || descripcionMatch || ubicacionMatch || tipusMatch || tagsMatch;
      });
    }

    // Filtros específicos
    if (filtres.tipus) {
      resultats = resultats.filter(inst => inst.tipus === filtres.tipus);
    }

    if (filtres.ambit) {
      resultats = resultats.filter(inst => inst.ambit === filtres.ambit);
    }

    if (filtres.provincia) {
      resultats = resultats.filter(inst => inst.contacte.provincia === filtres.provincia);
    }

    if (filtres.nomesVerificats) {
      resultats = resultats.filter(inst => inst.verificat);
    }

    if (filtres.nomesDestacats) {
      resultats = resultats.filter(inst => inst.destacat);
    }

    // Ordenación
    if (filtres.ordenPer) {
      resultats.sort((a, b) => {
        const direccio = filtres.ordenDireccio === 'DESC' ? -1 : 1;
        switch (filtres.ordenPer) {
          case 'NOM':
            return a.nom.texto.localeCompare(b.nom.texto) * direccio;
          case 'VISITES':
            return (a.visites - b.visites) * direccio;
          case 'DATA':
            return (a.dataRegistre.getTime() - b.dataRegistre.getTime()) * direccio;
          default:
            return 0;
        }
      });
    }

    // Destacadas primero por defecto
    resultats.sort((a, b) => {
      if (a.destacat && !b.destacat) return -1;
      if (!a.destacat && b.destacat) return 1;
      return 0;
    });

    setInstitucionsFiltrades(resultats);
  }, [institucions, busqueda, filtres]);

  const handleLimpiarFiltres = () => {
    setBusqueda('');
    setFiltres({});
  };

  const handleVisitarWeb = (institucio: InstitucioEnllac) => {
    // Simular conteo de clic
    const url = institucio.contacte.web.startsWith('http') 
      ? institucio.contacte.web 
      : `https://${institucio.contacte.web}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (cargando) {
    return (
      <LayoutGeneral paginaActual="enllcos-interes">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </LayoutGeneral>
    );
  }

  return (
    <LayoutGeneral paginaActual="enllcos-interes">
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
                <Building className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t.estadistiques.total}</p>
                  <p className="text-2xl font-bold text-gray-900">{estadistiques.totalInstitucions}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t.estadistiques.visites}</p>
                  <p className="text-2xl font-bold text-gray-900">{estadistiques.totalVisites}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t.estadistiques.verificades}</p>
                  <p className="text-2xl font-bold text-gray-900">{estadistiques.institucionsVerificades}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <MousePointer className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total clics</p>
                  <p className="text-2xl font-bold text-gray-900">{estadistiques.totalClics}</p>
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
                onChange={(e) => setFiltres(prev => ({ ...prev, tipus: e.target.value as TipusInstitucio || undefined }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t.tots} {t.tipus}</option>
                {Object.entries(TIPUS_INSTITUCIONS_METADATA).map(([key, metadata]) => (
                  <option key={key} value={key}>
                    {metadata.nom.traducciones?.[idioma as keyof typeof metadata.nom.traducciones] || metadata.nom.texto}
                  </option>
                ))}
              </select>

              <select
                value={filtres.ambit || ''}
                onChange={(e) => setFiltres(prev => ({ ...prev, ambit: e.target.value as AmbitTerritorial || undefined }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t.tots} {t.ambit}</option>
                {Object.entries(t.ambits).map(([key, label]) => (
                  <option key={key} value={key}>{label as string}</option>
                ))}
              </select>

              <select
                value={filtres.provincia || ''}
                onChange={(e) => setFiltres(prev => ({ ...prev, provincia: e.target.value || undefined }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t.tots} {t.provincia}</option>
                <option value="Barcelona">Barcelona</option>
                <option value="Madrid">Madrid</option>
                <option value="Valencia">Valencia</option>
              </select>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filtres.nomesVerificats || false}
                  onChange={(e) => setFiltres(prev => ({ ...prev, nomesVerificats: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Només verificades</span>
              </label>

              {/* Botón limpiar filtros */}
              {(busqueda.trim() || Object.keys(filtres).length > 0) && (
                <button
                  onClick={handleLimpiarFiltres}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t.netejarFiltres}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {institucionsFiltrades.length} {t.totalInstitucions}
              {institucionsFiltrades.length < institucions.length && (
                <span className="text-gray-400"> de {institucions.length} totals</span>
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

        {/* Lista de instituciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {institucionsFiltrades.map((institucio) => (
            <div key={institucio.id} className="w-full max-w-sm mx-auto">
              <TarjetaInstitucio
                institucio={institucio}
                onVisitarWeb={handleVisitarWeb}
                translations={t}
              />
            </div>
          ))}
        </div>

        {/* Estado vacío */}
        {institucionsFiltrades.length === 0 && !cargando && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔗</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {busqueda.trim() || Object.keys(filtres).length > 0 
                ? "No s'han trobat institucions que coincideixin" 
                : "No hi ha institucions disponibles"}
            </h3>
            <p className="text-gray-600 mb-4">
              {busqueda.trim() || Object.keys(filtres).length > 0 
                ? "Intenta amb altres termes de cerca o filtres diferents" 
                : "No hi ha institucions configurades actualment"}
            </p>
            {(busqueda.trim() || Object.keys(filtres).length > 0) && (
              <button
                onClick={handleLimpiarFiltres}
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