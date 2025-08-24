'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LayoutGeneral from '../../../src/componentes/comunes/LayoutGeneral';
import { useIdioma } from '../../../hooks/useComunidad';
import { useFavoritos } from '../../../src/contextos/FavoritosContext';
import { 
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Clock,
  Users,
  Eye,
  Gift,
  CheckCircle,
  Copy,
  ExternalLink,
  QrCode,
  Phone,
  Mail,
  Star,
  AlertTriangle,
  Info
} from 'lucide-react';

// Importar tipos del componente TarjetaOferta
import { OfertaComercial } from '../../../src/componentes/ofertes/TarjetaOferta';

// Traducciones para la página de detalle
const traducciones = {
  ca: {
    tornar: 'Tornar a ofertes',
    verificada: 'Verificada',
    exclusiva: 'Exclusiva',
    destacada: 'Destacada',
    canjear: 'Bescanviar Oferta',
    afavoritos: 'Afegir a favorits',
    compartir: 'Compartir',
    vistas: 'visualitzacions',
    canjes: 'bescanvis',
    favoritos: 'favorits',
    instrucciones: 'Com bescanviar',
    condicions: 'Condicions i limitacions',
    vencimiento: 'Data de venciment',
    stock: 'Stock disponible',
    empresa: 'Sobre l\'empresa',
    relacionadas: 'Ofertes relacionades',
    // Métodos de canje
    metodos: 'Mètodes de bescanvi disponibles',
    codigoPromocional: 'Codi Promocional',
    copiarCodigo: 'Copiar codi',
    codigoCopiado: 'Codi copiat!',
    enlaceDirecto: 'Comprar amb descompte',
    cashback: 'Comprar i rebre punts',
    qrTienda: 'Mostra a la botiga',
    reservaTelefono: 'Reservar per telèfon',
    reservaEmail: 'Reservar per email',
    puntosVip: 'punts VIP',
    expiraHoy: 'Expira avui',
    expiraEn: 'Expira en {dias} dies',
    soloQuedan: 'Només queden {cantidad}',
    ofertaNoEncontrada: 'Oferta no trobada',
    masOfertas: 'Més ofertes de',
    verTodas: 'Veure totes',
    ofertasCategoria: 'Més ofertes de',
    ubicacionesDisponibles: 'Ubicacions Disponibles',
    mapaProximamente: 'Mapa interactiu properament',
    estadisticas: 'Estadístiques',
    ofertasActivas: 'Ofertes actives',
    canjesTotales: 'Bescanvis totals',
    valoracion: 'Valoració',
    empresaColaboradora: 'Empresa col·laboradora des de 2020. Més de 50 ofertes exclusives per a empleats públics.',
    descripcion: 'Descripció',
    precio: 'Preu',
    ahorras: 'Estalvies',
    modalidad: 'Modalitat',
    vencimientoCorto: 'Venciment',
    ofertaEspecial: 'Oferta especial',
    verMas: 'Veure més',
    ofertaSimilar: 'Oferta similar',
    ver: 'Veure',
    redirigeDescuento: 'Et redirigirà al lloc web amb el descompte ja aplicat',
    compraGanarPuntos: 'Comprar i Guanyar Punts',
    recibirias: 'En una compra de 100€ rebries',
    enPuntos: 'en punts',
    mostrarTienda: 'Mostra aquest codi en qualsevol de les nostres botigues físiques',
    desde: 'des de',
    contactoDirecto: 'Contacte Directe',
    introduceCodigo: 'Introdueix aquest codi en fer la teva reserva online o menciona\'l en trucar per telèfon',
    telefonoEmail: 'Truca o envia un email mencionant que ets empleat públic i proporciona el teu número d\'empleat',
    compraDctoAplicado: 'Comprar amb Descompte Aplicat',
    comprarDescuento: 'Comprar amb 15% Descompte'
  },
  es: {
    tornar: 'Volver a ofertas',
    verificada: 'Verificada',
    exclusiva: 'Exclusiva',
    destacada: 'Destacada',
    canjear: 'Canjear Oferta',
    afavoritos: 'Añadir a favoritos',
    compartir: 'Compartir',
    vistas: 'visualizaciones',
    canjes: 'canjes',
    favoritos: 'favoritos',
    instrucciones: 'Cómo canjear',
    condicions: 'Condiciones y limitaciones',
    vencimiento: 'Fecha de vencimiento',
    stock: 'Stock disponible',
    empresa: 'Sobre la empresa',
    relacionadas: 'Ofertas relacionadas',
    // Métodos de canje
    metodos: 'Métodos de canje disponibles',
    codigoPromocional: 'Código Promocional',
    copiarCodigo: 'Copiar código',
    codigoCopiado: '¡Código copiado!',
    enlaceDirecto: 'Comprar con descuento',
    cashback: 'Comprar y recibir puntos',
    qrTienda: 'Mostrar en tienda',
    reservaTelefono: 'Reservar por teléfono',
    reservaEmail: 'Reservar por email',
    puntosVip: 'puntos VIP',
    expiraHoy: 'Expira hoy',
    expiraEn: 'Expira en {dias} días',
    soloQuedan: 'Solo quedan {cantidad}',
    ofertaNoEncontrada: 'Oferta no encontrada',
    masOfertas: 'Más ofertas de',
    verTodas: 'Ver todas',
    ofertasCategoria: 'Más ofertas de',
    ubicacionesDisponibles: 'Ubicaciones Disponibles',
    mapaProximamente: 'Mapa interactivo próximamente',
    estadisticas: 'Estadísticas',
    ofertasActivas: 'Ofertas activas',
    canjesTotales: 'Canjes totales',
    valoracion: 'Valoración',
    empresaColaboradora: 'Empresa colaboradora desde 2020. Más de 50 ofertas exclusivas para empleados públicos.',
    descripcion: 'Descripción',
    precio: 'Precio',
    ahorras: 'Ahorras',
    modalidad: 'Modalidad',
    vencimientoCorto: 'Vencimiento',
    ofertaEspecial: 'Oferta especial',
    verMas: 'Ver más',
    ofertaSimilar: 'Oferta similar',
    ver: 'Ver',
    redirigeDescuento: 'Te redirigirá al sitio web con el descuento ya aplicado',
    compraGanarPuntos: 'Comprar y Ganar Puntos',
    recibirias: 'En una compra de 100€ recibirías',
    enPuntos: 'en puntos',
    mostrarTienda: 'Muestra este código en cualquiera de nuestras tiendas físicas',
    desde: 'desde',
    contactoDirecto: 'Contacto Directo',
    introduceCodigo: 'Introduce este código al hacer tu reserva online o menciónalo al llamar por teléfono',
    telefonoEmail: 'Llama o envía un email mencionando que eres empleado público y proporciona tu número de empleado',
    compraDctoAplicado: 'Reservar con Descuento Aplicado',
    comprarDescuento: 'Comprar con 15% Descuento'
  },
  eu: {
    tornar: 'Eskaintzetara itzuli',
    verificada: 'Egiaztatuta',
    exclusiva: 'Esklusibo',
    destacada: 'Nabarmenduta',
    canjear: 'Eskaintza trukatu',
    afavoritos: 'Gogokoetara gehitu',
    compartir: 'Partekatu',
    vistas: 'ikustaldi',
    canjes: 'trukatutako',
    favoritos: 'gogokoak',
    instrucciones: 'Nola trukatu',
    condicions: 'Baldintzak eta mugak',
    vencimiento: 'Iraungitze data',
    stock: 'Stock eskuragarria',
    empresa: 'Enpresari buruz',
    relacionadas: 'Lotutako eskaintzak',
    // Métodos de canje
    metodos: 'Eskuragarri dauden truke metodoak',
    codigoPromocional: 'Promocio kodea',
    copiarCodigo: 'Kodea kopiatu',
    codigoCopiado: 'Kodea kopiatuta!',
    enlaceDirecto: 'Deskontuarekin erosi',
    cashback: 'Erosi eta puntuak jaso',
    qrTienda: 'Dendan erakutsi',
    reservaTelefono: 'Telefonoz erreserba',
    reservaEmail: 'Emailez erreserba',
    puntosVip: 'VIP puntu',
    expiraHoy: 'Gaur iraungitzen da',
    expiraEn: '{dias} egunetan iraungitzen da',
    soloQuedan: '{cantidad} bakarrik geratzen dira',
    ofertaNoEncontrada: 'Ez da eskaintza aurkitu',
    masOfertas: 'Gehiago eskaintza',
    verTodas: 'Denak ikusi',
    ofertasCategoria: 'Gehiago eskaintza',
    ubicacionesDisponibles: 'Kokaleku Eskuragarriak',
    mapaProximamente: 'Mapa interaktiboa laster',
    estadisticas: 'Estatistikak',
    ofertasActivas: 'Eskaintza aktiboak',
    canjesTotales: 'Truke osoak',
    valoracion: 'Balorazioa',
    empresaColaboradora: '2020tik enpresa kolaboratzailea. Langile publikoentzako 50 eskaintza esklusibo baino gehiago.',
    descripcion: 'Deskripzioa',
    precio: 'Prezioa',
    ahorras: 'Aurrezten',
    modalidad: 'Modalitatea',
    vencimientoCorto: 'Iraungitzea',
    ofertaEspecial: 'Eskaintza berezia',
    verMas: 'Gehiago ikusi',
    ofertaSimilar: 'Antzeko eskaintza',
    ver: 'Ikusi',
    redirigeDescuento: 'Deskontua aplikatuta dagoen webgunera bideratuko zaitu',
    compraGanarPuntos: 'Erosi eta Puntuak Irabazi',
    recibirias: '100€ko erosketa batean jasoko zenituzke',
    enPuntos: 'puntuetan',
    mostrarTienda: 'Erakutsi kode hau gure denda fisiko guztietan',
    desde: 'hemendik',
    contactoDirecto: 'Zuzeneko Kontaktua',
    introduceCodigo: 'Sartu kode hau zure online erreserba egitean edo aipatu deitzean',
    telefonoEmail: 'Deitu edo bidali email langile publikoa zarela esanez eta zure langile zenbakia emanez',
    compraDctoAplicado: 'Deskontua Aplikatuta Erosi',
    comprarDescuento: '%15 Deskontuarekin Erosi'
  },
  gl: {
    tornar: 'Volver a ofertas',
    verificada: 'Verificada',
    exclusiva: 'Exclusiva',
    destacada: 'Destacada',
    canjear: 'Canxear Oferta',
    afavoritos: 'Engadir a favoritos',
    compartir: 'Compartir',
    vistas: 'visualizacións',
    canjes: 'canxes',
    favoritos: 'favoritos',
    instrucciones: 'Como canxear',
    condicions: 'Condicións e limitacións',
    vencimiento: 'Data de vencemento',
    stock: 'Stock dispoñible',
    empresa: 'Sobre a empresa',
    relacionadas: 'Ofertas relacionadas',
    // Métodos de canje
    metodos: 'Métodos de canxe dispoñibles',
    codigoPromocional: 'Código Promocional',
    copiarCodigo: 'Copiar código',
    codigoCopiado: 'Código copiado!',
    enlaceDirecto: 'Comprar con desconto',
    cashback: 'Comprar e recibir puntos',
    qrTienda: 'Mostrar na tenda',
    reservaTelefono: 'Reservar por teléfono',
    reservaEmail: 'Reservar por email',
    puntosVip: 'puntos VIP',
    expiraHoy: 'Expira hoxe',
    expiraEn: 'Expira en {dias} días',
    soloQuedan: 'Só quedan {cantidad}',
    ofertaNoEncontrada: 'Oferta non atopada',
    masOfertas: 'Máis ofertas de',
    verTodas: 'Ver todas',
    ofertasCategoria: 'Máis ofertas de',
    ubicacionesDisponibles: 'Ubicacións Dispoñibles',
    mapaProximamente: 'Mapa interactivo proximamente',
    estadisticas: 'Estatísticas',
    ofertasActivas: 'Ofertas activas',
    canjesTotales: 'Canxes totais',
    valoracion: 'Valoración',
    empresaColaboradora: 'Empresa colaboradora desde 2020. Máis de 50 ofertas exclusivas para empregados públicos.',
    descripcion: 'Descrición',
    precio: 'Prezo',
    ahorras: 'Aforras',
    modalidad: 'Modalidade',
    vencimientoCorto: 'Vencemento',
    ofertaEspecial: 'Oferta especial',
    verMas: 'Ver máis',
    ofertaSimilar: 'Oferta similar',
    ver: 'Ver',
    redirigeDescuento: 'Redirixit ao sitio web co desconto xa aplicado',
    compraGanarPuntos: 'Comprar e Ganar Puntos',
    recibirias: 'Nunha compra de 100€ recibirías',
    enPuntos: 'en puntos',
    mostrarTienda: 'Mostra este código en calquera das nosas tendas físicas',
    desde: 'desde',
    contactoDirecto: 'Contacto Directo',
    introduceCodigo: 'Introduce este código ao facer a túa reserva online ou menciónao ao chamar por teléfono',
    telefonoEmail: 'Chama ou envía un email mencionando que es empregado público e proporciona o teu número de empregado',
    compraDctoAplicado: 'Comprar con Desconto Aplicado',
    comprarDescuento: 'Comprar con 15% Desconto'
  }
};

// Tipos para métodos de canje
interface MetodosCanjeDisponibles {
  codigoPromocional?: { 
    codigo: string; 
    instrucciones: string;
  };
  enlaceDirecto?: { 
    url: string; 
    textoBoton: string;
  };
  cashback?: { 
    porcentaje: number; 
    condiciones: string;
  };
  qrCode?: { 
    activo: boolean; 
    contenido: string;
  };
  reservaAcreditacion?: { 
    telefono?: string; 
    email?: string; 
    instrucciones: string;
  };
}

// Extender la interfaz OfertaComercial
interface OfertaComercialDetallada extends OfertaComercial {
  metodosCanjeDisponibles: MetodosCanjeDisponibles;
  galeria?: string[];
  descripcionExtendida?: string;
}

export default function OfertaDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { idioma } = useIdioma();
  const { agregarFavorito, eliminarFavorito, esFavorito } = useFavoritos();
  const t = (traducciones as any)[idioma] || traducciones.es;
  
  const [oferta, setOferta] = useState<OfertaComercialDetallada | null>(null);
  const [loading, setLoading] = useState(true);
  const [codigoCopiado, setCodigoCopiado] = useState(false);
  const [imagenActual, setImagenActual] = useState(0);
  
  // Determinar si es favorito usando el contexto
  const esFavorita = oferta ? esFavorito('oferta', oferta.id) : false;

  // Mock data - En producción esto vendría de la API
  // Función para obtener datos de ofertas detalladas según idioma
  const getAllMockOfertas = (idioma: string): OfertaComercialDetallada[] => {
    const baseDatos = [
      {
        id: '1',
        imagen: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop',
        galeria: [
          'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=400&fit=crop'
        ],
        empresa: {
          id: '1',
          nombre: 'RestaurantGroup Barcelona',
          logo: 'https://ui-avatars.com/api/?name=RestaurantGroup&background=f59e0b&color=fff',
          sector: 'Gastronomía',
          verificada: true
        },
        categoria: 'GASTRONOMIA' as const,
        tipoDescuento: 'PORCENTAJE' as const,
        descuento: {
          valor: 40,
          valorOriginal: 85,
          valorFinal: 51,
          moneda: 'EUR'
        },
        modalidad: 'PRESENCIAL' as const,
        ubicaciones: ['Barcelona', 'Hospitalet', 'Badalona'],
        fechaPublicacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        destacada: true,
        exclusiva: true,
        estado: 'ACTIVA' as const,
        vistas: 342,
        canjes: 48,
        favoritos: 67,
        stockDisponible: 15,
        metodosCanjeDisponibles: {
          codigoPromocional: {
            codigo: 'EMPLEADOS40',
            instrucciones: ''
          },
          reservaAcreditacion: {
            telefono: '+34 93 123 45 67',
            email: 'reservas@restaurantgroup.com',
            instrucciones: ''
          }
        },
        contenido: {
          ca: {
            titulo: 'Menú complet per a 2 persones - 40% descompte',
            descripcion: 'Gaudeix d\'un excel·lent sopar per a dues persones amb entrant, principal i postre. Vàlid a tots els nostres restaurants.',
            descripcionExtendida: 'Una experiència gastronòmica única al cor de Barcelona. El nostre menú degustació inclou productes de temporada, preparats pels nostres xefs amb més de 15 anys d\'experiència. Perfecte per a un sopar romàntic o una celebració especial.',
            instrucciones: 'Presenta la teva targeta d\'empleat públic en fer la reserva',
            limitaciones: ['No vàlid caps de setmana', 'Màxim 2 usos per persona', 'Reserva prèvia obligatòria']
          },
          es: {
            titulo: 'Menú completo para 2 personas - 40% descuento',
            descripcion: 'Disfruta de una excelente cena para dos personas con entrante, principal y postre. Válido en todos nuestros restaurantes.',
            descripcionExtendida: 'Una experiencia gastronómica única en el corazón de Barcelona. Nuestro menú degustación incluye productos de temporada, preparados por nuestros chefs con más de 15 años de experiencia. Perfecto para una cena romántica o una celebración especial.',
            instrucciones: 'Presenta tu tarjeta de empleado público al hacer la reserva',
            limitaciones: ['No válido fines de semana', 'Máximo 2 usos por persona', 'Reserva previa obligatoria']
          },
          eu: {
            titulo: '2 pertsonentzako menu osoa - %40 deskontua',
            descripcion: 'Gozatu bi pertsonentzako afari bikain batekin sarrera, nagusia eta postrea. Gure jatetxe guztietan baliozkoa.',
            descripcionExtendida: 'Bartzelonako bihotzean esperientzia gastronomiko bakarra. Gure degustazio menuak denboraldiko produktuak ditu, 15 urte baino gehiagoko esperientzia duten gure sukaldariek prestatuak. Afari erromantiko edo ospakizun berezi baterako ezin hobea.',
            instrucciones: 'Aurkeztu zure langile publikoaren txartela erreserba egitean',
            limitaciones: ['Ez da baliozkoa asteburuetan', 'Gehienez 2 erabilera pertsonako', 'Aurrez erreserba hartu behar da']
          },
          gl: {
            titulo: 'Menú completo para 2 persoas - 40% desconto',
            descripcion: 'Goza dunha excelente cea para dúas persoas con entrante, principal e postre. Válido en todos os nosos restaurantes.',
            descripcionExtendida: 'Unha experiencia gastronómica única no corazón de Barcelona. O noso menú degustación inclúe produtos de tempada, preparados polos nosos chefs con máis de 15 anos de experiencia. Perfecto para unha cea romántica ou unha celebración especial.',
            instrucciones: 'Presenta a túa tarxeta de empregado público ao facer a reserva',
            limitaciones: ['Non válido fins de semana', 'Máximo 2 usos por persoa', 'Reserva previa obrigatoria']
          }
        }
      },
      {
        id: '3',
        imagen: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=400&fit=crop',
        galeria: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=400&fit=crop'
        ],
        empresa: {
          id: '3',
          nombre: 'TechStore Pro',
          logo: 'https://ui-avatars.com/api/?name=TechStore&background=3b82f6&color=fff',
          sector: 'Tecnología',
          verificada: true
        },
        categoria: 'TECNOLOGIA' as const,
        tipoDescuento: 'PORCENTAJE' as const,
        descuento: {
          valor: 15,
          valorOriginal: 1199,
          valorFinal: 1019,
          moneda: 'EUR'
        },
        modalidad: 'AMBAS' as const,
        ubicaciones: ['Barcelona', 'Madrid', 'Valencia'],
        fechaPublicacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        fechaVencimiento: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        destacada: true,
        exclusiva: true,
        estado: 'ACTIVA' as const,
        vistas: 456,
        canjes: 12,
        favoritos: 89,
        stockDisponible: 15,
        metodosCanjeDisponibles: {
          enlaceDirecto: {
            url: 'https://techstore.es/macbook-air-m2?promo=PUBLICO15&utm_source=lapublica&utm_campaign=empleados',
            textoBoton: ''
          }
        },
        contenido: {
          ca: {
            titulo: 'MacBook Air M2 - 15% descompte',
            descripcion: 'Potencia la teva productivitat amb l\'última generació de MacBook Air. Ideal per a treball i ús personal.',
            descripcionExtendida: 'El nou MacBook Air amb xip M2 d\'Apple combina un rendiment increïble amb una bateria de fins a 18 hores. Perfecte per a professionals que necessiten potència i portabilitat. Inclou 256GB SSD i 8GB RAM unificada.',
            instrucciones: 'Compra online amb codi o visita botiga física amb acreditació',
            limitaciones: []
          },
          es: {
            titulo: 'MacBook Air M2 - 15% descuento',
            descripcion: 'Potencia tu productividad con la última generación de MacBook Air. Ideal para trabajo y uso personal.',
            descripcionExtendida: 'El nuevo MacBook Air con chip M2 de Apple combina un rendimiento increíble con una batería de hasta 18 horas. Perfecto para profesionales que necesitan potencia y portabilidad. Incluye 256GB SSD y 8GB RAM unificada.',
            instrucciones: 'Compra online con código o visita tienda física con acreditación',
            limitaciones: []
          },
          eu: {
            titulo: 'MacBook Air M2 - %15 deskontua',
            descripcion: 'Indartu zure produktibitatea MacBook Air-en azken belaunaldiarekin. Lanekin eta erabilera pertsonalarekin.',
            descripcionExtendida: 'Apple-ren M2 txiparekin MacBook Air berriak errendimendu ikaragarria konbinatzen du 18 ordutako bateria batekin. Potentzia eta eramangarritasuna behar duten profesionalentzako ezin hobea. 256GB SSD eta 8GB RAM bateratua barne.',
            instrucciones: 'Erosi online kodearekin edo bisitatu denda fisikoa akreditazioarekin',
            limitaciones: []
          },
          gl: {
            titulo: 'MacBook Air M2 - 15% desconto',
            descripcion: 'Potencia a túa produtividade coa última xeración de MacBook Air. Ideal para traballo e uso persoal.',
            descripcionExtendida: 'O novo MacBook Air con chip M2 de Apple combina un rendemento incrível cunha batería de ata 18 horas. Perfecto para profesionais que necesitan potencia e portabilidade. Inclúe 256GB SSD e 8GB RAM unificada.',
            instrucciones: 'Compra online con código ou visita tenda física con acreditación',
            limitaciones: []
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
        descripcionExtendida: contenido.descripcionExtendida,
        instrucciones: contenido.instrucciones,
        limitaciones: contenido.limitaciones
      };
    });
  };

  const mockOfertaDetallada = getAllMockOfertas(idioma).find(o => o.id === params.id as string);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      if (mockOfertaDetallada) {
        setOferta(mockOfertaDetallada);
      } else {
        setOferta(null);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [params.id, mockOfertaDetallada]);

  const handleCopyCode = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    setCodigoCopiado(true);
    setTimeout(() => setCodigoCopiado(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share && oferta) {
      try {
        await navigator.share({
          title: oferta.titulo,
          text: oferta.descripcion,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback - copiar URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleToggleFavorite = async () => {
    if (!oferta) return;
    
    try {
      if (esFavorita) {
        await eliminarFavorito('oferta', oferta.id);
      } else {
        await agregarFavorito('oferta', oferta.id, {
          titulo: oferta.titulo,
          descripcion: oferta.descripcion,
          imagen: oferta.imagen,
          empresa: oferta.empresa.nombre,
          categoria: oferta.categoria,
          descuento: `${oferta.descuento.valor}%`,
          fechaVencimiento: oferta.fechaVencimiento
        });
      }
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
    }
  };

  const formatearVencimiento = () => {
    if (!oferta?.fechaVencimiento) return null;
    
    const fechaVenc = typeof oferta.fechaVencimiento === 'string' 
      ? new Date(oferta.fechaVencimiento) 
      : oferta.fechaVencimiento;
    
    const diasParaVencer = Math.floor((fechaVenc.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (diasParaVencer <= 0) {
      return t.expiraHoy;
    } else {
      return t.expiraEn.replace('{dias}', diasParaVencer.toString());
    }
  };

  if (loading) {
    return (
      <LayoutGeneral paginaActual="ofertes">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </LayoutGeneral>
    );
  }

  if (!oferta) {
    return (
      <LayoutGeneral paginaActual="ofertes">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.ofertaNoEncontrada}</h1>
            <button 
              onClick={() => router.push('/ofertes')}
              className="text-blue-600 hover:text-blue-700"
            >
              {t.tornar}
            </button>
          </div>
        </div>
      </LayoutGeneral>
    );
  }

  return (
    <LayoutGeneral paginaActual="ofertes">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <button 
            onClick={() => router.push('/ofertes')}
            className="flex items-center hover:text-blue-600"
          >
            <ArrowLeft size={16} className="mr-1" />
            {t.tornar}
          </button>
          <span>/</span>
          <span className="text-gray-900">{oferta.titulo}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Principal */}
          <div className="lg:col-span-2">
            
            {/* Hero Section */}
            <div className="relative mb-8">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src={oferta.galeria ? oferta.galeria[imagenActual] : oferta.imagen} 
                  alt={oferta.titulo}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges superiores */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-white shadow-lg">
                    {oferta.descuento.valor}% OFF
                  </span>
                </div>
                
                <div className="absolute top-4 right-4 space-y-2">
                  {oferta.exclusiva && (
                    <span className="block px-2 py-1 rounded text-xs font-medium bg-purple-500 text-white">
                      {t.exclusiva}
                    </span>
                  )}
                  {oferta.destacada && (
                    <span className="block px-2 py-1 rounded text-xs font-medium bg-yellow-500 text-white">
                      <Star size={12} className="inline mr-1" />
                      {t.destacada}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Galería miniatura */}
              {oferta.galeria && oferta.galeria.length > 1 && (
                <div className="flex space-x-2 mt-4">
                  {oferta.galeria.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setImagenActual(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        imagenActual === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información Principal */}
            <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{oferta.titulo}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Eye size={16} className="mr-1" />
                      {oferta.vistas} {t.vistas}
                    </span>
                    <span className="flex items-center">
                      <Gift size={16} className="mr-1" />
                      {oferta.canjes} {t.canjes}
                    </span>
                    <span className="flex items-center">
                      <Heart size={16} className="mr-1" />
                      {oferta.favoritos} {t.favoritos}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-lg border transition-colors ${
                      esFavorita ? 'bg-red-50 border-red-200' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Heart size={20} className={esFavorita ? 'text-red-500 fill-current' : 'text-gray-400'} />
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    <Share2 size={20} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Empresa */}
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src={oferta.empresa.logo} 
                  alt={oferta.empresa.nombre}
                  className="w-12 h-12 rounded-lg object-cover border"
                />
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-900">{oferta.empresa.nombre}</h3>
                    {oferta.empresa.verificada && (
                      <CheckCircle size={16} className="text-green-500 ml-2" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{oferta.empresa.sector}</p>
                </div>
              </div>

              {/* Precio */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-green-600">
                      {oferta.descuento.valorFinal}€
                    </span>
                    <span className="text-lg text-gray-500 line-through ml-2">
                      {oferta.descuento.valorOriginal}€
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{t.ahorras}</div>
                    <div className="text-lg font-bold text-red-600">
                      {(oferta.descuento.valorOriginal || 0) - (oferta.descuento.valorFinal || 0)}€
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{t.descripcion}</h3>
                <p className="text-gray-700">{oferta.descripcionExtendida || oferta.descripcion}</p>
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Modalidad */}
                <div className="flex items-center text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span>💻</span>
                  </div>
                  <div>
                    <div className="font-medium">{t.modalidad}</div>
                    <div className="text-gray-600">{oferta.modalidad}</div>
                  </div>
                </div>
                
                {/* Ubicaciones */}
                {oferta.ubicaciones && (
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <MapPin size={16} className="text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Ubicaciones</div>
                      <div className="text-gray-600">{oferta.ubicaciones.join(', ')}</div>
                    </div>
                  </div>
                )}
                
                {/* Vencimiento */}
                <div className="flex items-center text-sm">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <Clock size={16} className="text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium">{t.vencimiento}</div>
                    <div className="text-red-600">{formatearVencimiento()}</div>
                  </div>
                </div>
              </div>

              {/* Stock disponible */}
              {oferta.stockDisponible && oferta.stockDisponible <= 10 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
                  <div className="flex items-center">
                    <AlertTriangle size={16} className="text-orange-500 mr-2" />
                    <span className="text-sm font-medium text-orange-800">
                      {t.soloQuedan.replace('{cantidad}', oferta.stockDisponible.toString())}
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Métodos de Canje */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Gift size={20} className="mr-2 text-blue-600" />
                {t.metodos}
              </h3>
              
              <div className="space-y-4">
                
                {/* Código Promocional */}
                {oferta.metodosCanjeDisponibles.codigoPromocional && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mr-2">
                        🏷️
                      </div>
                      {t.codigoPromocional}
                    </h4>
                    
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <code className="font-mono text-lg font-bold">
                          {oferta.metodosCanjeDisponibles.codigoPromocional.codigo}
                        </code>
                        <button
                          onClick={() => handleCopyCode(oferta.metodosCanjeDisponibles.codigoPromocional!.codigo)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <Copy size={14} />
                          <span>{codigoCopiado ? t.codigoCopiado : t.copiarCodigo}</span>
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600">
                      {t.introduceCodigo}
                    </p>
                  </div>
                )}

                {/* Enlace Directo */}
                {oferta.metodosCanjeDisponibles.enlaceDirecto && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mr-2">
                        <ExternalLink size={14} className="text-blue-600" />
                      </div>
                      {t.enlaceDirecto}
                    </h4>
                    
                    <a
                      href={oferta.metodosCanjeDisponibles.enlaceDirecto.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      {oferta.id === '1' ? t.compraDctoAplicado : t.comprarDescuento}
                    </a>
                    
                    <p className="text-xs text-gray-600 mt-2">
                      {t.redirigeDescuento}
                    </p>
                  </div>
                )}

                {/* Cashback */}
                {oferta.metodosCanjeDisponibles.cashback && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center mr-2">
                        💰
                      </div>
                      {t.cashback}
                    </h4>
                    
                    <div className="bg-yellow-50 rounded-lg p-4 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Cashback:</span>
                        <span className="text-lg font-bold text-yellow-700">
                          {oferta.metodosCanjeDisponibles.cashback.porcentaje}% {t.puntosVip}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {t.recibirias} {oferta.metodosCanjeDisponibles.cashback.porcentaje}€ {t.enPuntos}
                      </div>
                    </div>
                    
                    <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors mb-3">
                      <Gift size={16} className="mr-2" />
                      {t.compraGanarPuntos}
                    </button>
                    
                    <p className="text-xs text-gray-600">
                      {oferta.metodosCanjeDisponibles.cashback.condiciones}
                    </p>
                  </div>
                )}

                {/* QR Code */}
                {oferta.metodosCanjeDisponibles.qrCode?.activo && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center mr-2">
                        <QrCode size={14} className="text-purple-600" />
                      </div>
                      {t.qrTienda}
                    </h4>
                    
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="w-24 h-24 bg-white border-2 border-gray-300 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <QrCode size={40} className="text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-600">
                        {t.mostrarTienda}
                      </p>
                    </div>
                  </div>
                )}

                {/* Reserva con Acreditación */}
                {oferta.metodosCanjeDisponibles.reservaAcreditacion && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center mr-2">
                        📞
                      </div>
                      {t.contactoDirecto}
                    </h4>
                    
                    <div className="space-y-3">
                      {oferta.metodosCanjeDisponibles.reservaAcreditacion.telefono && (
                        <a
                          href={`tel:${oferta.metodosCanjeDisponibles.reservaAcreditacion.telefono}`}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <Phone size={16} className="text-green-600 mr-2" />
                            <span className="text-sm font-medium">
                              {oferta.metodosCanjeDisponibles.reservaAcreditacion.telefono}
                            </span>
                          </div>
                          <ExternalLink size={14} className="text-green-600" />
                        </a>
                      )}
                      
                      {oferta.metodosCanjeDisponibles.reservaAcreditacion.email && (
                        <a
                          href={`mailto:${oferta.metodosCanjeDisponibles.reservaAcreditacion.email}`}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <Mail size={16} className="text-blue-600 mr-2" />
                            <span className="text-sm font-medium">
                              {oferta.metodosCanjeDisponibles.reservaAcreditacion.email}
                            </span>
                          </div>
                          <ExternalLink size={14} className="text-blue-600" />
                        </a>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-3">
                      {t.telefonoEmail}
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* Instrucciones */}
            {(oferta.instrucciones || oferta.limitaciones) && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Info size={18} className="mr-2 text-blue-600" />
                  {t.instrucciones}
                </h3>
                
                {oferta.instrucciones && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-700">{oferta.instrucciones}</p>
                  </div>
                )}
                
                {oferta.limitaciones && oferta.limitaciones.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t.condicions}</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {oferta.limitaciones.map((limitacion, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          {limitacion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

          </div>
          
        </div>

        {/* Sección Información de la Empresa */}
        <div className="mt-12">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                🏢
              </div>
              {t.empresa}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Info de la empresa */}
              <div className="lg:col-span-2">
                <div className="flex items-start space-x-4 mb-4">
                  <img 
                    src={oferta.empresa.logo} 
                    alt={oferta.empresa.nombre}
                    className="w-16 h-16 rounded-lg object-cover border"
                  />
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{oferta.empresa.nombre}</h3>
                      {oferta.empresa.verificada && (
                        <div className="ml-2 flex items-center text-sm text-green-600">
                          <CheckCircle size={16} className="mr-1" />
                          {t.verificada}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600">{oferta.empresa.sector}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {t.empresaColaboradora}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Estadísticas de la empresa */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{t.estadisticas}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.ofertasActivas}:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.canjesTotales}:</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.valoracion}:</span>
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="font-medium ml-1">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa de Ubicaciones */}
        {oferta.ubicaciones && oferta.ubicaciones.length > 0 && oferta.modalidad !== 'ONLINE' && (
          <div className="mt-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin size={24} className="mr-3 text-blue-600" />
                {t.ubicacionesDisponibles}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {oferta.ubicaciones.map((ubicacion, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <MapPin size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-700">{ubicacion}</span>
                  </div>
                ))}
              </div>
              
              {/* Placeholder para mapa */}
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">{t.mapaProximamente}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ofertas de la Misma Empresa */}
        <div className="mt-12">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  🏢
                </div>
{t.masOfertas} {oferta.empresa.nombre}
              </h2>
              <button 
                onClick={() => router.push(`/ofertes?empresa=${oferta.empresa.id}`)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
{t.verTodas}
                <ExternalLink size={14} className="ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Mock ofertas de la misma empresa */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <img 
                    src={`https://images.unsplash.com/photo-${1500000000000 + item}?w=300&h=160&fit=crop`}
                    alt=""
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=160&fit=crop';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 text-sm mb-2">
                      {t.ofertaEspecial} {item}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-bold text-sm">-{20 + item * 5}%</span>
                      <button className="text-blue-600 text-xs hover:text-blue-700">
                        {t.verMas}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ofertas de la Misma Categoría */}
        <div className="mt-8 mb-12">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  🏷️
                </div>
{t.ofertasCategoria} {(t as any)[oferta.categoria] || oferta.categoria}
              </h2>
              <button 
                onClick={() => router.push(`/ofertes?categoria=${oferta.categoria}`)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
{t.verTodas}
                <ExternalLink size={14} className="ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Mock ofertas de la misma categoría */}
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <img 
                    src={`https://images.unsplash.com/photo-${1600000000000 + item}?w=300&h=120&fit=crop`}
                    alt=""
                    className="w-full h-24 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=120&fit=crop';
                    }}
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm mb-1">
                      {t.ofertaSimilar} {item}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-bold text-xs">-{15 + item * 3}%</span>
                      <button className="text-blue-600 text-xs hover:text-blue-700">
                        {t.ver}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </LayoutGeneral>
  );
}