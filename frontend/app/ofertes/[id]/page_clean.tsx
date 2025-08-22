// Importar tipos del componente TarjetaOferta
import { OfertaComercial } from '../../../src/componentes/ofertes/TarjetaOferta';

// Tipos adicionales
interface MetodosCanjeDisponibles {
  codigoPromocional?: {
    codigo: string;
    instrucciones: string;
  };
  reservaAcreditacion?: {
    telefono: string;
    email: string;
    instrucciones: string;
  };
}

interface OfertaComercialDetallada extends OfertaComercial {
  metodosCanjeDisponibles: MetodosCanjeDisponibles;
  galeria?: string[];
  descripcionExtendida?: string;
}

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