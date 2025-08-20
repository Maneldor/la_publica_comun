'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft,
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle,
  Calendar,
  MessageCircle,
  Video,
  DollarSign,
  Gift,
  User,
  Award,
  Globe,
  Shield
} from 'lucide-react';
import LayoutGeneral from '../../../src/componentes/comunes/LayoutGeneral';
import { useComunidad } from '../../../hooks/useComunidad';
import { useContenidoTraducido, crearContenidoMultiidioma } from '../../../hooks/useContenidoTraducido';
import { ServeiAsesorament, TipoAsesorament } from '../../../tipos/asesorament';

// Mock data del servicio (en una app real vendría de la API)
const getMockServei = (id: string): ServeiAsesorament | null => {
  const mockServeis: ServeiAsesorament[] = [
    {
      id: '1',
      empresa: {
        id: 'emp1',
        nom: 'Assessoria Jurídica Barcelona',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        descripcio: crearContenidoMultiidioma(
          'Especialistes en dret administratiu i laboral per a empleats públics amb més de 15 anys d\'experiència',
          'ca',
          {
            ca: 'Especialistes en dret administratiu i laboral per a empleats públics amb més de 15 anys d\'experiència',
            es: 'Especialistas en derecho administrativo y laboral para empleados públicos con más de 15 años de experiencia'
          }
        ),
        especialitats: ['JURIDIC', 'LABORAL', 'ADMINISTRATIU'],
        ubicacio: { provincia: 'Barcelona', ciutat: 'Barcelona', direccio: 'Carrer Major, 123', codiPostal: '08001' },
        contacte: { telefon: '934 567 890', email: 'info@assessoria-bcn.com', web: 'www.assessoria-bcn.com' },
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
        'Oferim assessorament jurídic especialitzat per a funcionaris i empleats públics en totes les qüestions relatives al dret administratiu, procediments disciplinaris, recursos administratius, drets laborals i molt més. El nostre equip d\'advocats especialitzats té una àmplia experiència en l\'àmbit públic.',
        'ca',
        {
          ca: 'Oferim assessorament jurídic especialitzat per a funcionaris i empleats públics en totes les qüestions relatives al dret administratiu, procediments disciplinaris, recursos administratius, drets laborals i molt més. El nostre equip d\'advocats especialitzats té una àmplia experiència en l\'àmbit públic.',
          es: 'Ofrecemos asesoramiento jurídico especializado para funcionarios y empleados públicos en todas las cuestiones relativas al derecho administrativo, procedimientos disciplinarios, recursos administrativos, derechos laborales y mucho más. Nuestro equipo de abogados especializados tiene una amplia experiencia en el ámbito público.'
        }
      ),
      modalitats: ['PRESENCIAL', 'TELEFONIC', 'VIDEOCONFERENCIA'],
      tarifa: {
        tipus: 'PRIMERA_CONSULTA_GRATUITA',
        descripcio: crearContenidoMultiidioma(
          'Primera consulta de 30 minuts completament gratuïta. Consultes posteriors: 60€/hora per telèfon o videoconferència, 80€/hora presencial.',
          'ca',
          {
            ca: 'Primera consulta de 30 minuts completament gratuïta. Consultes posteriors: 60€/hora per telèfon o videoconferència, 80€/hora presencial.',
            es: 'Primera consulta de 30 minutos completamente gratuita. Consultas posteriores: 60€/hora por teléfono o videoconferencia, 80€/hora presencial.'
          }
        )
      },
      duracio: '30-60 min',
      idiomes: ['ca', 'es'],
      disponible: true,
      horariFranges: ['09:00-12:00', '15:00-18:00'],
      tempsResposta: '24h',
      primeraConsultaGratuita: true,
      consultaUrgent: true,
      desplacament: false,
      consultesTotals: 245,
      puntuacioMitjana: 4.8,
      totalRessenyes: 89,
      dataCreacio: new Date('2023-02-01'),
      dataActualitzacio: new Date('2024-01-15'),
      actiu: true
    }
  ];

  return mockServeis.find(s => s.id === id) || null;
};

export default function AssessoramentDetallPage() {
  const router = useRouter();
  const params = useParams();
  const { idioma } = useComunidad();
  const [servei, setServei] = useState<ServeiAsesorament | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarServei = async () => {
      if (typeof params.id === 'string') {
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 500));
        const serveiData = getMockServei(params.id);
        setServei(serveiData);
      }
      setCargando(false);
    };

    cargarServei();
  }, [params.id]);

  const tituloTraducido = servei ? useContenidoTraducido(servei.titol) : null;
  const descripcionTraducida = servei ? useContenidoTraducido(servei.descripcio) : null;
  const tarifaTraducida = servei ? useContenidoTraducido(servei.tarifa.descripcio) : null;
  const descripcionEmpresaTraducida = servei ? useContenidoTraducido(servei.empresa.descripcio) : null;

  const iconosModalitat = {
    TELEFONIC: Phone,
    PRESENCIAL: MapPin,
    EMAIL: Mail,
    VIDEOCONFERENCIA: Video,
    CHAT: MessageCircle
  };

  const tipusLabels = {
    JURIDIC: 'Jurídic',
    FISCAL: 'Fiscal',
    LABORAL: 'Laboral',
    FINANCIER: 'Financer',
    IMMOBILIARI: 'Immobiliari',
    FAMILIAR: 'Familiar',
    PENAL: 'Penal',
    ADMINISTRATIU: 'Administratiu',
    ALTRES: 'Altres'
  };

  const modalitatsLabels = {
    TELEFONIC: 'Telefònic',
    PRESENCIAL: 'Presencial',  
    EMAIL: 'Correu electrònic',
    VIDEOCONFERENCIA: 'Videoconferència',
    CHAT: 'Chat en línia'
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

  if (!servei) {
    return (
      <LayoutGeneral paginaActual="assessorament">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Servei no trobat</h1>
            <button 
              onClick={() => router.push('/assessorament')}
              className="text-blue-600 hover:text-blue-700"
            >
              Tornar al llistat
            </button>
          </div>
        </div>
      </LayoutGeneral>
    );
  }

  return (
    <LayoutGeneral paginaActual="assessorament">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <button 
            onClick={() => router.push('/assessorament')}
            className="hover:text-gray-700 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Assessorament
          </button>
          <span>/</span>
          <span className="text-gray-900">
            {tituloTraducido?.texto || 'Carregant...'}
          </span>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            
            {/* Header del servicio */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-start space-x-4">
                {servei.empresa.logo && (
                  <img 
                    src={servei.empresa.logo} 
                    alt={servei.empresa.nom}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {tituloTraducido?.cargando ? (
                          <div className="h-6 bg-gray-200 rounded animate-pulse w-96"></div>
                        ) : (
                          tituloTraducido?.texto
                        )}
                      </h1>
                      <p className="text-lg text-gray-600 mb-2">{servei.empresa.nom}</p>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{servei.empresa.ubicacio.direccio}, {servei.empresa.ubicacio.ciutat}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white bg-blue-600">
                        {tipusLabels[servei.tipus]}
                      </span>
                      {servei.empresa.verificada && (
                        <div className="flex items-center text-green-600 text-sm">
                          <Shield className="h-4 w-4 mr-1" />
                          Verificat
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Puntuación */}
                  {servei.puntuacioMitjana && (
                    <div className="flex items-center mt-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(servei.puntuacioMitjana!) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium text-gray-900">{servei.puntuacioMitjana}</span>
                        <span className="ml-1 text-sm text-gray-500">({servei.totalRessenyes} ressenyes)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Descripción del servicio */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripció del servei</h2>
              <div className="prose prose-gray max-w-none">
                {descripcionTraducida?.cargando ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{descripcionTraducida?.texto}</p>
                )}
              </div>
            </div>

            {/* Modalidades y detalles */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Modalitats i detalls</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Modalidades */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Modalitats disponibles</h3>
                  <div className="space-y-2">
                    {servei.modalitats.map(modalitat => {
                      const Icon = iconosModalitat[modalitat];
                      return (
                        <div key={modalitat} className="flex items-center text-gray-700">
                          <Icon className="h-4 w-4 mr-2 text-blue-600" />
                          {modalitatsLabels[modalitat]}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Detalles */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Informació adicional</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Durada: {servei.duracio}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {servei.consultesTotals} consultes realitzades
                    </div>
                    {servei.tempsResposta && (
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Temps de resposta: {servei.tempsResposta}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Idiomes: {servei.idiomes.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información sobre la empresa */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sobre l'empresa</h2>
              <p className="text-gray-700 mb-4">
                {descripcionEmpresaTraducida?.cargando ? (
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  descripcionEmpresaTraducida?.texto
                )}
              </p>
              
              {/* Especialidades */}
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Especialitats</h3>
                <div className="flex flex-wrap gap-2">
                  {servei.empresa.especialitats.map(especialitat => (
                    <span key={especialitat} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {tipusLabels[especialitat]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Horario */}
              {servei.empresa.horariAtencio && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Horari d'atenció</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    {Object.entries(servei.empresa.horariAtencio).filter(([_, horari]) => horari).map(([dia, horari]) => (
                      <div key={dia} className="flex justify-between">
                        <span className="capitalize">{dia}:</span>
                        <span>{horari?.inici} - {horari?.fi}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="mt-6 lg:mt-0">
            
            {/* Tarifa y solicitud */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tarifa i condicions</h3>
              
              {servei.primeraConsultaGratuita && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center text-green-800">
                    <Gift className="h-4 w-4 mr-2" />
                    <span className="font-medium text-sm">Primera consulta gratuïta</span>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-start space-x-2">
                  <DollarSign className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    {tarifaTraducida?.cargando ? (
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      tarifaTraducida?.texto
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push(`/assessorament/${servei.id}/solicitar`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors mb-3"
              >
                Sol·licitar assessorament
              </button>
              
              <button
                onClick={() => window.open(`tel:${servei.empresa.contacte.telefon}`, '_self')}
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Phone className="h-4 w-4 mr-2" />
                Trucar ara
              </button>
            </div>

            {/* Contacto */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Informació de contacte</h3>
              
              <div className="space-y-3 text-sm">
                {servei.empresa.contacte.telefon && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    {servei.empresa.contacte.telefon}
                  </div>
                )}
                
                {servei.empresa.contacte.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-3 text-gray-400" />
                    {servei.empresa.contacte.email}
                  </div>
                )}
                
                {servei.empresa.contacte.web && (
                  <div className="flex items-center text-gray-600">
                    <Globe className="h-4 w-4 mr-3 text-gray-400" />
                    <a href={`https://${servei.empresa.contacte.web}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                      {servei.empresa.contacte.web}
                    </a>
                  </div>
                )}

                <div className="flex items-start text-gray-600">
                  <MapPin className="h-4 w-4 mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
                  <div>
                    {servei.empresa.ubicacio.direccio}<br />
                    {servei.empresa.ubicacio.codiPostal} {servei.empresa.ubicacio.ciutat}<br />
                    {servei.empresa.ubicacio.provincia}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutGeneral>
  );
}