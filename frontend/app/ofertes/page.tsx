'use client';

import React, { useState, useEffect } from 'react';
import LayoutGeneral from '../../src/componentes/comunes/LayoutGeneral';
import { TarjetaOferta, type OfertaComercial } from '../../src/componentes/ofertes';
import { useIdioma } from '../../hooks/useComunidad';
import { 
  ShoppingBag,
  Search,
  MapPin,
  Percent,
  Award,
  Filter,
  LayoutGrid,
  List,
  Eye,
  Heart,
  Calendar,
  Gift,
  Star,
  TrendingUp
} from 'lucide-react';

// Traducciones por idioma
const traducciones = {
  ca: {
    // Header
    titulo: 'Ofertes Exclusives',
    subtitulo: 'Descomptes i promocions especials per a empleats públics',
    
    // Estadísticas
    ofertes: 'Ofertes',
    estalviMitja: 'Estalvi mitjà',
    canjos: 'Canjos',
    destacades: 'Destacades',
    
    // Filtros
    cercarOfertes: 'Cercar ofertes...',
    totesCategories: 'Totes les categories',
    totesModalitats: 'Totes les modalitats',
    totesUbicacions: 'Totes les ubicacions',
    nomesDestacades: 'Només destacades',
    vistaGraella: 'Vista en graella',
    vistaLlista: 'Vista en llista',
    
    // Resultados
    ofertesTrobades: 'ofertes trobades',
    netejarFiltres: 'Netejar filtres',
    noOfertes: 'No s\'han trobat ofertes',
    provarFiltres: 'Prova ajustant els filtres de cerca',
    
    // Categorías
    GASTRONOMIA: 'Gastronomia',
    VIAJES: 'Viatges',
    TECNOLOGIA: 'Tecnologia',
    SALUD_BIENESTAR: 'Salut i Benestar',
    EDUCACION: 'Educació',
    HOGAR: 'Llar',
    MODA: 'Moda',
    OCIO_CULTURA: 'Oci i Cultura',
    DEPORTES: 'Esports',
    SERVICIOS_PROFESIONALES: 'Serveis Professionals',
    
    // Modalidades
    ONLINE: 'En línia',
    PRESENCIAL: 'Presencial',
    AMBAS: 'Ambdues'
  },
  es: {
    // Header
    titulo: 'Ofertas Exclusivas',
    subtitulo: 'Descuentos y promociones especiales para empleados públicos',
    
    // Estadísticas
    ofertes: 'Ofertas',
    estalviMitja: 'Ahorro medio',
    canjos: 'Canjes',
    destacades: 'Destacadas',
    
    // Filtros
    cercarOfertes: 'Buscar ofertas...',
    totesCategories: 'Todas las categorías',
    totesModalitats: 'Todas las modalidades',
    totesUbicacions: 'Todas las ubicaciones',
    nomesDestacades: 'Solo destacadas',
    vistaGraella: 'Vista en cuadrícula',
    vistaLlista: 'Vista en lista',
    
    // Resultados
    ofertesTrobades: 'ofertas encontradas',
    netejarFiltres: 'Limpiar filtros',
    noOfertes: 'No se encontraron ofertas',
    provarFiltres: 'Prueba ajustando los filtros de búsqueda',
    
    // Categorías
    GASTRONOMIA: 'Gastronomía',
    VIAJES: 'Viajes',
    TECNOLOGIA: 'Tecnología',
    SALUD_BIENESTAR: 'Salud y Bienestar',
    EDUCACION: 'Educación',
    HOGAR: 'Hogar',
    MODA: 'Moda',
    OCIO_CULTURA: 'Ocio y Cultura',
    DEPORTES: 'Deportes',
    SERVICIOS_PROFESIONALES: 'Servicios Profesionales',
    
    // Modalidades
    ONLINE: 'Online',
    PRESENCIAL: 'Presencial',
    AMBAS: 'Ambas'
  },
  eu: {
    // Header
    titulo: 'Eskaintza Esklusiboak',
    subtitulo: 'Langile publikoentzako berezko deskontuak eta promozio bereziak',
    
    // Estadísticas
    ofertes: 'Eskaintzak',
    estalviMitja: 'Batez besteko aurrezkia',
    canjos: 'Trukatutakoak',
    destacades: 'Nabarmendutakoak',
    
    // Filtros
    cercarOfertes: 'Eskaintzak bilatu...',
    totesCategories: 'Kategoria guztiak',
    totesModalitats: 'Modalitate guztiak',
    totesUbicacions: 'Kokaleku guztiak',
    nomesDestacades: 'Nabarmendutakoak bakarrik',
    vistaGraella: 'Sareta ikuspegia',
    vistaLlista: 'Zerrenda ikuspegia',
    
    // Resultados
    ofertesTrobades: 'eskaintza aurkitu dira',
    netejarFiltres: 'Iragazkiak garbitu',
    noOfertes: 'Ez da eskaintzarik aurkitu',
    provarFiltres: 'Saiatu bilaketa iragazkiak doituz',
    
    // Categorías
    GASTRONOMIA: 'Gastronomia',
    VIAJES: 'Bidaiak',
    TECNOLOGIA: 'Teknologia',
    SALUD_BIENESTAR: 'Osasuna eta Ongizatea',
    EDUCACION: 'Hezkuntza',
    HOGAR: 'Etxea',
    MODA: 'Moda',
    OCIO_CULTURA: 'Aisialdi eta Kultura',
    DEPORTES: 'Kirolak',
    SERVICIOS_PROFESIONALES: 'Zerbitzu Profesionalak',
    
    // Modalidades
    ONLINE: 'Lineaz',
    PRESENCIAL: 'Presentziala',
    AMBAS: 'Biak'
  },
  gl: {
    // Header
    titulo: 'Ofertas Exclusivas',
    subtitulo: 'Descontos e promocións especiais para empregados públicos',
    
    // Estadísticas
    ofertes: 'Ofertas',
    estalviMitja: 'Aforro medio',
    canjos: 'Canxes',
    destacades: 'Destacadas',
    
    // Filtros
    cercarOfertes: 'Buscar ofertas...',
    totesCategories: 'Todas as categorías',
    totesModalitats: 'Todas as modalidades',
    totesUbicacions: 'Todas as ubicacións',
    nomesDestacades: 'Só destacadas',
    vistaGraella: 'Vista en grella',
    vistaLlista: 'Vista en lista',
    
    // Resultados
    ofertesTrobades: 'ofertas atopadas',
    netejarFiltres: 'Limpar filtros',
    noOfertes: 'Non se atoparon ofertas',
    provarFiltres: 'Proba axustando os filtros de busca',
    
    // Categorías
    GASTRONOMIA: 'Gastronomía',
    VIAJES: 'Viaxes',
    TECNOLOGIA: 'Tecnoloxía',
    SALUD_BIENESTAR: 'Saúde e Benestar',
    EDUCACION: 'Educación',
    HOGAR: 'Fogar',
    MODA: 'Moda',
    OCIO_CULTURA: 'Ocio e Cultura',
    DEPORTES: 'Deportes',
    SERVICIOS_PROFESIONALES: 'Servizos Profesionais',
    
    // Modalidades
    ONLINE: 'Online',
    PRESENCIAL: 'Presencial',
    AMBAS: 'Ambas'
  }
};

// Función para obtener datos de ofertas según idioma
const getOfertasMock = (idioma: string): OfertaComercial[] => {
  const baseDatos = [
    {
      id: '1',
      categoria: 'GASTRONOMIA' as const,
      imagen: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=250&fit=crop',
      empresa: {
        id: '1',
        nombre: 'RestaurantGroup Barcelona',
        logo: 'https://ui-avatars.com/api/?name=RestaurantGroup&background=f59e0b&color=fff',
        sector: 'Gastronomía',
        verificada: true
      },
      tipoDescuento: 'PORCENTAJE' as const,
      descuento: {
        valor: 40,
        valorOriginal: 85,
        valorFinal: 51,
        moneda: 'EUR'
      },
      modalidad: 'PRESENCIAL' as const,
      ubicaciones: ['Barcelona', 'Hospitalet', 'Badalona'],
      codigoDescuento: 'EMPLEADOS40',
      fechaPublicacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      destacada: true,
      exclusiva: true,
      estado: 'ACTIVA' as const,
      vistas: 342,
      canjes: 48,
      favoritos: 67,
      contenido: {
        ca: {
          titulo: 'Menú complet per a 2 persones - 40% descompte',
          descripcion: 'Gaudeix d\'un excel·lent sopar per a dues persones amb entrant, principal i postre. Vàlid a tots els nostres restaurants.',
          instrucciones: 'Presenta la teva targeta d\'empleat públic en fer la reserva',
          limitaciones: ['No vàlid caps de setmana', 'Màxim 2 usos per persona']
        },
        es: {
          titulo: 'Menú completo para 2 personas - 40% descuento',
          descripcion: 'Disfruta de una excelente cena para dos personas con entrante, principal y postre. Válido en todos nuestros restaurantes.',
          instrucciones: 'Presenta tu tarjeta de empleado público al hacer la reserva',
          limitaciones: ['No válido fines de semana', 'Máximo 2 usos por persona']
        },
        eu: {
          titulo: '2 pertsonentzako menu osoa - %40 deskontua',
          descripcion: 'Gozatu bi pertsonentzako afari bikain batekin sarrera, nagusia eta postrea. Gure jatetxe guztietan baliozkoa.',
          instrucciones: 'Aurkeztu zure langile publikoaren txartela erreserba egitean',
          limitaciones: ['Ez da baliozkoa asteburuetan', 'Gehienez 2 erabilera pertsonako']
        },
        gl: {
          titulo: 'Menú completo para 2 persoas - 40% desconto',
          descripcion: 'Goza dunha excelente cea para dúas persoas con entrante, principal e postre. Válido en todos os nosos restaurantes.',
          instrucciones: 'Presenta a túa tarxeta de empregado público ao facer a reserva',
          limitaciones: ['Non válido fins de semana', 'Máximo 2 usos por persoa']
        }
      }
    },
    {
      id: '2',
      categoria: 'VIAJES' as const,
      imagen: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop',
      empresa: {
        id: '2',
        nombre: 'Hotels Rural Catalunya',
        logo: 'https://ui-avatars.com/api/?name=Hotels+Rural&background=22c55e&color=fff',
        sector: 'Turismo',
        verificada: true
      },
      tipoDescuento: 'PRECIO_ESPECIAL' as const,
      descuento: {
        valor: 35,
        valorOriginal: 280,
        valorFinal: 180,
        moneda: 'EUR'
      },
      modalidad: 'PRESENCIAL' as const,
      ubicaciones: ['Girona', 'Lleida', 'Tarragona'],
      enlaceExterno: 'https://hotelsrural.cat/empleados-publicos',
      fechaPublicacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      destacada: false,
      exclusiva: true,
      estado: 'ACTIVA' as const,
      vistas: 198,
      canjes: 23,
      favoritos: 45,
      stockDisponible: 8,
      contenido: {
        ca: {
          titulo: 'Escapada rural - 2 nits amb esmorzar',
          descripcion: 'Desconnecta al nostre hotel rural amb spa inclòs. Perfecte per a una escapada relaxant a la natura.',
          instrucciones: 'Reserva online amb codi promocional o truca indicant que ets empleat públic',
          limitaciones: ['Subjecte a disponibilitat', 'No vàlid en temporada alta']
        },
        es: {
          titulo: 'Escapada rural - 2 noches con desayuno',
          descripcion: 'Desconecta en nuestro hotel rural con spa incluido. Perfecto para una escapada relajante en la naturaleza.',
          instrucciones: 'Reserva online con código promocional o llama indicando que eres empleado público',
          limitaciones: ['Sujeto a disponibilidad', 'No válido en temporada alta']
        },
        eu: {
          titulo: 'Landa-ihesa - 2 gau gosariarekin',
          descripcion: 'Deskonektatu gure landa hotelean spa barne. Naturan atseden hartzeko ihes ezin hobea.',
          instrucciones: 'Egin erreserba online kode promozionalarekin edo deitu langile publikoa zarela adieraziz',
          limitaciones: ['Eskuragarritasunaren araberakoa', 'Ez da baliozkoa denboraldirik onena']
        },
        gl: {
          titulo: 'Escapada rural - 2 noites con almorzo',
          descripcion: 'Desconecta no noso hotel rural con spa incluído. Perfecto para unha escapada relaxante na natureza.',
          instrucciones: 'Reserva online con código promocional ou chama indicando que es empregado público',
          limitaciones: ['Suxeito a dispoñibilidade', 'Non válido en tempada alta']
        }
      }
    },
    {
      id: '3',
      categoria: 'TECNOLOGIA' as const,
      imagen: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=250&fit=crop',
      empresa: {
        id: '3',
        nombre: 'TechStore Pro',
        logo: 'https://ui-avatars.com/api/?name=TechStore&background=3b82f6&color=fff',
        sector: 'Tecnología',
        verificada: true
      },
      tipoDescuento: 'PORCENTAJE' as const,
      descuento: {
        valor: 15,
        valorOriginal: 1199,
        valorFinal: 1019,
        moneda: 'EUR'
      },
      modalidad: 'AMBAS' as const,
      ubicaciones: ['Barcelona', 'Madrid', 'Valencia'],
      codigoDescuento: 'PUBLICO15',
      enlaceExterno: 'https://techstore.es/empleados',
      fechaPublicacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      destacada: true,
      exclusiva: true,
      estado: 'ACTIVA' as const,
      vistas: 456,
      canjes: 12,
      favoritos: 89,
      stockDisponible: 15,
      contenido: {
        ca: {
          titulo: 'MacBook Air M2 - 15% descompte',
          descripcion: 'Potencia la teva productivitat amb l\'última generació de MacBook Air. Ideal per a treball i ús personal.',
          instrucciones: 'Compra online amb codi o visita botiga física amb acreditació',
          limitaciones: []
        },
        es: {
          titulo: 'MacBook Air M2 - 15% descuento',
          descripcion: 'Potencia tu productividad con la última generación de MacBook Air. Ideal para trabajo y uso personal.',
          instrucciones: 'Compra online con código o visita tienda física con acreditación',
          limitaciones: []
        },
        eu: {
          titulo: 'MacBook Air M2 - %15 deskontua',
          descripcion: 'Indartu zure produktibitatea MacBook Air-en azken belaunaldiarekin. Lanekin eta erabilera pertsonalarekin.',
          instrucciones: 'Erosi online kodearekin edo bisitatu denda fisikoa akreditazioarekin',
          limitaciones: []
        },
        gl: {
          titulo: 'MacBook Air M2 - 15% desconto',
          descripcion: 'Potencia a túa produtividade coa última xeración de MacBook Air. Ideal para traballo e uso persoal.',
          instrucciones: 'Compra online con código ou visita tenda física con acreditación',
          limitaciones: []
        }
      }
    },
    {
      id: '4',
      categoria: 'SALUD_BIENESTAR' as const,
      imagen: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=250&fit=crop',
      empresa: {
        id: '4',
        nombre: 'Clinica Dental Sonrisa',
        logo: 'https://ui-avatars.com/api/?name=Dental+Sonrisa&background=10b981&color=fff',
        sector: 'Salud',
        verificada: false
      },
      tipoDescuento: 'REGALO' as const,
      descuento: {
        valor: 100,
        valorOriginal: 85,
        valorFinal: 0,
        moneda: 'EUR'
      },
      modalidad: 'PRESENCIAL' as const,
      ubicaciones: ['Barcelona', 'Sabadell'],
      fechaPublicacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      destacada: false,
      exclusiva: true,
      estado: 'ACTIVA' as const,
      vistas: 234,
      canjes: 67,
      favoritos: 134,
      contenido: {
        ca: {
          titulo: 'Revisió dental completa + neteja GRATIS',
          descripcion: 'Cuida la teva salut bucal amb la nostra revisió completa i neteja dental professional sense cost addicional.',
          instrucciones: 'Sol·licita cita telefònica mencionant l\'oferta per a empleats públics',
          limitaciones: ['Una vegada per persona', 'Cita prèvia obligatòria']
        },
        es: {
          titulo: 'Revisión dental completa + limpieza GRATIS',
          descripcion: 'Cuida tu salud bucal con nuestra revisión completa y limpieza dental profesional sin coste adicional.',
          instrucciones: 'Solicita cita telefónica mencionando la oferta para empleados públicos',
          limitaciones: ['Una vez por persona', 'Cita previa obligatoria']
        },
        eu: {
          titulo: 'Hortz-azterketa osoa + garbiketa DOAN',
          descripcion: 'Zaindu zure ahoko osasuna gure azterketa osoarekin eta hortz-garbiketa profesionalarekin kostu gehigarririk gabe.',
          instrucciones: 'Eskatu telefonikoki hitzordua langile publikoentzako eskaintza aipatuz',
          limitaciones: ['Pertsonako behin', 'Aurrez hitzordua hartu behar da']
        },
        gl: {
          titulo: 'Revisión dental completa + limpeza GRATIS',
          descripcion: 'Coida a túa saúde bucal coa nosa revisión completa e limpeza dental profesional sen custo adicional.',
          instrucciones: 'Solicita cita telefónica mencionando a oferta para empregados públicos',
          limitaciones: ['Unha vez por persoa', 'Cita previa obrigatoria']
        }
      }
    },
    {
      id: '5',
      categoria: 'EDUCACION' as const,
      imagen: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
      empresa: {
        id: '5',
        nombre: 'FormaPro Academy',
        logo: 'https://ui-avatars.com/api/?name=FormaPro&background=8b5cf6&color=fff',
        sector: 'Educación',
        verificada: true
      },
      tipoDescuento: 'PORCENTAJE' as const,
      descuento: {
        valor: 50,
        valorOriginal: 180,
        valorFinal: 90,
        moneda: 'EUR'
      },
      modalidad: 'ONLINE' as const,
      codigoDescuento: 'EXCEL50PUBL',
      enlaceExterno: 'https://formapro.es/empleados-publicos',
      fechaPublicacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      destacada: true,
      exclusiva: true,
      estado: 'ACTIVA' as const,
      vistas: 167,
      canjes: 34,
      favoritos: 78,
      contenido: {
        ca: {
          titulo: 'Curs online d\'Excel avançat - 50% descompte',
          descripcion: 'Millora les teves habilitats professionals amb el nostre curs certificat d\'Excel avançat. 40 hores lectives.',
          instrucciones: 'Registra\'t a la plataforma i introdueix el codi de descompte',
          limitaciones: ['Accés durant 6 mesos', 'Certificat inclòs']
        },
        es: {
          titulo: 'Curso online de Excel avanzado - 50% descuento',
          descripcion: 'Mejora tus habilidades profesionales con nuestro curso certificado de Excel avanzado. 40 horas lectivas.',
          instrucciones: 'Regístrate en la plataforma e introduce el código de descuento',
          limitaciones: ['Acceso durante 6 meses', 'Certificado incluido']
        },
        eu: {
          titulo: 'Excel aurreratuaren online ikastaroa - %50 deskontua',
          descripcion: 'Hobetu zure gaitasun profesionalak gure Excel aurreratuaren ziurtagiri ikastaroarekin. 40 ordu lektibo.',
          instrucciones: 'Erregistratu plataforman eta sartu deskontu kodea',
          limitaciones: ['6 hilabetez sarbidea', 'Ziurtagiria barne']
        },
        gl: {
          titulo: 'Curso online de Excel avanzado - 50% desconto',
          descripcion: 'Mellora as túas habilidades profesionais co noso curso certificado de Excel avanzado. 40 horas lectivas.',
          instrucciones: 'Rexístrate na plataforma e introduce o código de desconto',
          limitaciones: ['Acceso durante 6 meses', 'Certificado incluído']
        }
      }
    },
    {
      id: '6',
      categoria: 'HOGAR' as const,
      imagen: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop',
      empresa: {
        id: '6',
        nombre: 'HomeCenter Plus',
        logo: 'https://ui-avatars.com/api/?name=HomeCenter&background=f59e0b&color=fff',
        sector: 'Hogar',
        verificada: true
      },
      tipoDescuento: 'PORCENTAJE' as const,
      descuento: {
        valor: 25,
        valorOriginal: 150,
        valorFinal: 112.5,
        moneda: 'EUR'
      },
      modalidad: 'AMBAS' as const,
      ubicaciones: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'],
      codigoDescuento: 'HOGAR25',
      enlaceExterno: 'https://homecenter.es/empleados',
      fechaPublicacion: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      destacada: false,
      exclusiva: true,
      estado: 'ACTIVA' as const,
      vistas: 298,
      canjes: 19,
      favoritos: 42,
      stockDisponible: 25,
      contenido: {
        ca: {
          titulo: 'Kit complet per a la llar - Descompte 25%',
          descripcion: 'Tot el que necessites per millorar la teva llar: eines, decoració i productes de neteja ecològics.',
          instrucciones: 'Presenta DNI i justificant laboral a botiga o compra online',
          limitaciones: ['Stock limitat', 'No acumulable amb altres ofertes']
        },
        es: {
          titulo: 'Kit completo para el hogar - Descuento 25%',
          descripcion: 'Todo lo que necesitas para mejorar tu hogar: herramientas, decoración y productos de limpieza ecológicos.',
          instrucciones: 'Presenta DNI y justificante laboral en tienda o compra online',
          limitaciones: ['Stock limitado', 'No acumulable con otras ofertas']
        },
        eu: {
          titulo: 'Etxearen kit osoa - %25 deskontua',
          descripcion: 'Zure etxea hobetzeko behar duzun guztia: tresnak, dekorazioa eta garbiketa-produktu ekologikoak.',
          instrucciones: 'Aurkeztu NAN eta lan justifikazioa dendan edo erosi online',
          limitaciones: ['Stock mugatua', 'Ezin da beste eskaintzekin metatuta']
        },
        gl: {
          titulo: 'Kit completo para o fogar - Desconto 25%',
          descripcion: 'Todo o que necesitas para mellorar o teu fogar: ferramentas, decoración e produtos de limpeza ecolóxicos.',
          instrucciones: 'Presenta DNI e xustificante laboral na tenda ou compra online',
          limitaciones: ['Stock limitado', 'Non acumulable con outras ofertas']
        }
      }
    }
  ];

  return baseDatos.map(oferta => {
    const contenido = oferta.contenido[idioma as keyof typeof oferta.contenido] || oferta.contenido.es;
    return {
      ...oferta,
      titulo: contenido.titulo,
      descripcion: contenido.descripcion,
      instrucciones: contenido.instrucciones,
      limitaciones: contenido.limitaciones
    };
  });
};


const categorias = ['GASTRONOMIA', 'VIAJES', 'TECNOLOGIA', 'SALUD_BIENESTAR', 'EDUCACION', 'HOGAR', 'MODA', 'OCIO_CULTURA', 'DEPORTES', 'SERVICIOS_PROFESIONALES'];
const modalidades = ['ONLINE', 'PRESENCIAL', 'AMBAS'];
const ubicaciones = ['Barcelona', 'Madrid', 'Valencia', 'Sevilla', 'Bilbao', 'Zaragoza'];

export default function OfertesPage() {
  const { idioma } = useIdioma();
  const t = (traducciones as any)[idioma] || traducciones.es; // Fallback a español si no existe el idioma
  
  // Usar datos traducidos según el idioma actual
  const ofertas = getOfertasMock(idioma);
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState('all')
  const [selectedModalidad, setSelectedModalidad] = useState('all')
  const [selectedUbicacion, setSelectedUbicacion] = useState('all')
  const [soloDestacadas, setSoloDestacadas] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filteredOfertas, setFilteredOfertas] = useState(ofertas)

  useEffect(() => {
    let filtered = ofertas

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(oferta =>
        oferta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oferta.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oferta.empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oferta.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por categoría
    if (selectedCategoria !== 'all') {
      filtered = filtered.filter(oferta => oferta.categoria === selectedCategoria)
    }

    // Filtrar por modalidad
    if (selectedModalidad !== 'all') {
      filtered = filtered.filter(oferta => oferta.modalidad === selectedModalidad)
    }

    // Filtrar por ubicación
    if (selectedUbicacion !== 'all') {
      filtered = filtered.filter(oferta => 
        oferta.ubicaciones && oferta.ubicaciones.includes(selectedUbicacion)
      )
    }

    // Filtrar solo destacadas
    if (soloDestacadas) {
      filtered = filtered.filter(oferta => oferta.destacada)
    }

    setFilteredOfertas(filtered)
  }, [searchTerm, selectedCategoria, selectedModalidad, selectedUbicacion, soloDestacadas])

  const handleViewMore = (ofertaId: string) => {
    // Navegar a la página de detalle de la oferta comercial
    window.location.href = `/ofertes/${ofertaId}`;
  };

  const handleRedeem = (ofertaId: string) => {
    // Lógica para canjear la oferta
    console.log('Canjear oferta:', ofertaId);
    // Aquí se podría abrir un modal con las instrucciones o redirigir al enlace externo
  };

  const handleToggleFavorite = async (ofertaId: string) => {
    // Lógica para añadir/quitar favoritos
    console.log('Toggle favorito oferta comercial:', ofertaId);
  };

  return (
    <LayoutGeneral paginaActual="ofertes">
      <div className="w-full">
        <div className="px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.titulo}</h1>
                <p className="text-gray-600">{t.subtitulo}</p>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{ofertas.length}</p>
                    <p className="text-sm text-gray-500">{t.ofertes}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Percent size={20} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(ofertas.reduce((acc, o) => acc + o.descuento.valor, 0) / ofertas.length)}%
                    </p>
                    <p className="text-sm text-gray-500">{t.estalviMitja}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Gift size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {ofertas.reduce((acc, oferta) => acc + oferta.canjes, 0)}
                    </p>
                    <p className="text-sm text-gray-500">{t.canjos}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Star size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {ofertas.filter(o => o.destacada).length}
                    </p>
                    <p className="text-sm text-gray-500">{t.destacades}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t.cercarOfertes}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={selectedCategoria}
                    onChange={(e) => setSelectedCategoria(e.target.value)}
                  >
                    <option value="all">{t.totesCategories}</option>
                    {categorias.map(categoria => (
                      <option key={categoria} value={categoria}>{(t as any)[categoria]}</option>
                    ))}
                  </select>
                  
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={selectedModalidad}
                    onChange={(e) => setSelectedModalidad(e.target.value)}
                  >
                    <option value="all">{t.totesModalitats}</option>
                    {modalidades.map(modalidad => (
                      <option key={modalidad} value={modalidad}>{(t as any)[modalidad]}</option>
                    ))}
                  </select>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={selectedUbicacion}
                    onChange={(e) => setSelectedUbicacion(e.target.value)}
                  >
                    <option value="all">{t.totesUbicacions}</option>
                    {ubicaciones.map(ubicacion => (
                      <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
                    ))}
                  </select>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={soloDestacadas}
                      onChange={(e) => setSoloDestacadas(e.target.checked)}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm">{t.nomesDestacades}</span>
                  </label>

                  {/* Toggle vista */}
                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title={t.vistaGraella}
                    >
                      <LayoutGrid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title={t.vistaLlista}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{filteredOfertas.length} {t.ofertesTrobades}</span>
                {(searchTerm || selectedCategoria !== 'all' || selectedModalidad !== 'all' || selectedUbicacion !== 'all' || soloDestacadas) && (
                  <button 
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategoria('all')
                      setSelectedModalidad('all')
                      setSelectedUbicacion('all')
                      setSoloDestacadas(false)
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t.netejarFiltres}
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Lista de ofertas */}
          {filteredOfertas.length > 0 ? (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
                : 'space-y-4'
            }`}>
              {filteredOfertas.map((oferta) => (
                <div key={oferta.id} className="w-full max-w-sm mx-auto">
                  <TarjetaOferta 
                    oferta={oferta}
                    onViewMore={handleViewMore}
                    onRedeem={handleRedeem}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center">
              <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t.noOfertes}
              </h3>
              <p className="text-gray-600">
                {t.provarFiltres}
              </p>
            </div>
          )}
        </div>
      </div>
    </LayoutGeneral>
  );
}