import React from 'react';
import { useComunidad, useCaracteristicas } from '../../../hooks/useComunidad';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Globe,
  Users,
  MessageCircle,
  Calendar,
  Briefcase,
  FileText,
  Shield,
  Heart
} from 'lucide-react';

export interface PropiedadesFooter {
  mostrarRedesSociales?: boolean;
  mostrarEstadisticas?: boolean;
  enlaces?: {
    titulo: string;
    items: { nombre: string; href: string; externo?: boolean; }[];
  }[];
}

/**
 * Footer para red social profesional que se adapta a cada comunidad
 */
export const Footer: React.FC<PropiedadesFooter> = ({
  mostrarRedesSociales = true,
  mostrarEstadisticas = true,
  enlaces
}) => {
  const { configuracion } = useComunidad();
  const { terminologia } = useCaracteristicas();

  // Enlaces por defecto organizados para red social profesional
  const enlacesPorDefecto = [
    {
      titulo: 'Comunidad',
      items: [
        { nombre: terminologia.grupos, href: '/grupos' },
        { nombre: terminologia.miembros, href: '/miembros' },
        { nombre: 'Eventos', href: '/eventos' },
        { nombre: terminologia.blog, href: '/blog' },
        { nombre: 'Directorio', href: '/directorio' }
      ]
    },
    {
      titulo: 'Profesional',
      items: [
        { nombre: terminologia.tablonAnuncios, href: '/tablon' },
        { nombre: 'Demandas', href: '/demandas' },
        { nombre: terminologia.empresas, href: '/empresas' },
        { nombre: 'Administraciones', href: '/administraciones' },
        { nombre: 'Sindicatos', href: '/sindicatos' }
      ]
    },
    {
      titulo: 'Recursos',
      items: [
        { nombre: 'Centro de Ayuda', href: '/ayuda' },
        { nombre: 'Guías y Tutoriales', href: '/guias' },
        { nombre: 'Normas de la Comunidad', href: '/normas' },
        { nombre: 'Consejos de Seguridad', href: '/seguridad' },
        { nombre: 'API para Desarrolladores', href: '/api' }
      ]
    },
    {
      titulo: 'Soporte',
      items: [
        { nombre: 'Contacta con Nosotros', href: '/contacto' },
        { nombre: 'Reportar Problema', href: '/reportar' },
        { nombre: 'Sugerencias', href: '/sugerencias' },
        { nombre: 'Estado del Servicio', href: '/status' },
        { nombre: 'Feedback', href: '/feedback' }
      ]
    }
  ];

  const enlacesFinales = enlaces || enlacesPorDefecto;

  // Información de contacto específica por comunidad
  const informacionContacto = {
    catalunya: {
      direccion: 'Plaça de Sant Jaume, 4, 08002 Barcelona',
      telefono: '+34 93 402 46 00',
      email: 'comunidad@lapublica.cat',
      web: 'https://web.gencat.cat'
    },
    euskadi: {
      direccion: 'Lehendakaritza, Vitoria-Gasteiz, 01010',
      telefono: '+34 945 01 80 00',
      email: 'komunitatea@lapublica.eus',
      web: 'https://www.euskadi.eus'
    },
    galicia: {
      direccion: 'Praza do Obradoiro, s/n, 15705 Santiago de Compostela',
      telefono: '+34 981 54 00 00',
      email: 'comunidade@lapublica.gal',
      web: 'https://www.xunta.gal'
    },
    madrid: {
      direccion: 'Puerta del Sol, 7, 28013 Madrid',
      telefono: '+34 91 580 20 00',
      email: 'comunidad@madrid.lapublica.es',
      web: 'https://www.comunidad.madrid'
    },
    andalucia: {
      direccion: 'Plaza Nueva, 4, 41001 Sevilla',
      telefono: '+34 95 503 50 00',
      email: 'comunidad@andalucia.lapublica.es',
      web: 'https://www.juntadeandalucia.es'
    }
  };

  const contacto = informacionContacto[configuracion.codigo as keyof typeof informacionContacto] || 
                   informacionContacto.catalunya;

  // Redes sociales específicas por comunidad
  const redesSociales = [
    { 
      nombre: 'Facebook', 
      icono: <Facebook size={20} />, 
      href: `https://facebook.com/lapublica${configuracion.codigo}`,
      descripcion: 'Síguenos en Facebook'
    },
    { 
      nombre: 'Twitter', 
      icono: <Twitter size={20} />, 
      href: `https://twitter.com/lapublica_${configuracion.codigo}`,
      descripcion: 'Últimas noticias en Twitter'
    },
    { 
      nombre: 'LinkedIn', 
      icono: <Linkedin size={20} />, 
      href: `https://linkedin.com/company/lapublica-${configuracion.codigo}`,
      descripcion: 'Red profesional en LinkedIn'
    },
    { 
      nombre: 'Instagram', 
      icono: <Instagram size={20} />, 
      href: `https://instagram.com/lapublica_${configuracion.codigo}`,
      descripcion: 'Fotos y momentos en Instagram'
    }
  ];

  // Estadísticas ficticias de la comunidad (en una app real vendrían de la API)
  const estadisticasComunidad = {
    miembros: '12,500+',
    grupos: '450+',
    empresas: '280+',
    posts: '25,000+'
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Estadísticas de la comunidad */}
      {mostrarEstadisticas && (
        <div className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Nuestra Comunidad de {configuracion.nombre}
              </h3>
              <p className="text-gray-300">
                Conectando profesionales del sector público
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="flex justify-center mb-2">
                  <Users size={24} style={{ color: configuracion.tema.colorPrimario }} />
                </div>
                <div className="text-2xl font-bold text-white">{estadisticasComunidad.miembros}</div>
                <div className="text-sm text-gray-400">{terminologia.miembros}</div>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <Users size={24} style={{ color: configuracion.tema.colorPrimario }} />
                </div>
                <div className="text-2xl font-bold text-white">{estadisticasComunidad.grupos}</div>
                <div className="text-sm text-gray-400">{terminologia.grupos}</div>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <Briefcase size={24} style={{ color: configuracion.tema.colorPrimario }} />
                </div>
                <div className="text-2xl font-bold text-white">{estadisticasComunidad.empresas}</div>
                <div className="text-sm text-gray-400">Organizaciones</div>
              </div>
              <div>
                <div className="flex justify-center mb-2">
                  <MessageCircle size={24} style={{ color: configuracion.tema.colorPrimario }} />
                </div>
                <div className="text-2xl font-bold text-white">{estadisticasComunidad.posts}</div>
                <div className="text-sm text-gray-400">Posts Publicados</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sección principal del footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Información de la comunidad */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img
                className="h-12 w-auto filter brightness-0 invert"
                src={(configuracion.tema as any).logo}
                alt={`Logo ${configuracion.nombre}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/logo-placeholder-white.svg';
                }}
              />
              <div className="ml-3">
                <h3 className="text-xl font-bold">La Pública</h3>
                <p 
                  className="text-sm font-medium"
                  style={{ color: configuracion.tema.colorPrimario }}
                >
                  {configuracion.nombre}
                </p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              La red social profesional del sector público de {configuracion.nombre}. 
              Conecta con colegas, comparte experiencias, encuentra oportunidades y 
              haz crecer tu carrera profesional.
            </p>

            {/* Información de contacto */}
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin size={16} className="mt-1 mr-3 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">{contacto.direccion}</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-3 text-gray-400" />
                <a 
                  href={`tel:${contacto.telefono}`}
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {contacto.telefono}
                </a>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-3 text-gray-400" />
                <a 
                  href={`mailto:${contacto.email}`}
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {contacto.email}
                </a>
              </div>
              <div className="flex items-center">
                <Globe size={16} className="mr-3 text-gray-400" />
                <a 
                  href={contacto.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  Web oficial <ExternalLink size={12} className="ml-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Enlaces organizados en columnas */}
          {enlacesFinales.map((seccion, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{seccion.titulo}</h4>
              <ul className="space-y-2">
                {seccion.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a
                      href={item.href}
                      target={(item as any).externo ? '_blank' : undefined}
                      rel={(item as any).externo ? 'noopener noreferrer' : undefined}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center"
                    >
                      {item.nombre}
                      {(item as any).externo && <ExternalLink size={12} className="ml-1" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Redes sociales */}
        {mostrarRedesSociales && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-400 text-sm mb-2">
                  Únete a nuestra comunidad en redes sociales
                </p>
                <p className="text-gray-500 text-xs">
                  Mantente conectado y no te pierdas las últimas actualizaciones
                </p>
              </div>
              <div className="flex space-x-4">
                {redesSociales.map((red) => (
                  <a
                    key={red.nombre}
                    href={red.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200 p-3 rounded-md hover:bg-gray-800"
                    title={red.descripcion}
                  >
                    {red.icono}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Barra inferior */}
      <div 
        className="border-t-2"
        style={{ borderTopColor: configuracion.tema.colorPrimario }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-4 sm:mb-0 text-center sm:text-left">
              <p className="flex items-center justify-center sm:justify-start">
                © {new Date().getFullYear()} La Pública - {configuracion.nombre}. 
                <span className="ml-1">Hecho con</span>
                <Heart size={14} className="mx-1 text-red-500" />
                <span>para el sector público</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Plataforma diseñada por y para profesionales del sector público
              </p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-6 text-center">
              <a 
                href="/privacidad" 
                className="hover:text-white transition-colors duration-200 flex items-center"
              >
                <Shield size={12} className="mr-1" />
                Privacidad
              </a>
              <a 
                href="/terminos" 
                className="hover:text-white transition-colors duration-200"
              >
                Términos de Uso
              </a>
              <a 
                href="/cookies" 
                className="hover:text-white transition-colors duration-200"
              >
                Cookies
              </a>
              <a 
                href="/accesibilidad" 
                className="hover:text-white transition-colors duration-200"
              >
                Accesibilidad
              </a>
              <a 
                href="/normas" 
                className="hover:text-white transition-colors duration-200"
              >
                Normas Comunidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;