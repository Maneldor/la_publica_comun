'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Calendar, 
  Eye, 
  Heart, 
  MessageCircle,
  TrendingUp,
  Users,
  Package,
  Home,
  Briefcase,
  Repeat,
  Calendar as CalendarIcon,
  Settings,
  Grid,
  List,
  SortAsc,
  ChevronDown,
  Star,
  Clock
} from 'lucide-react';
import LayoutGeneral from '../../src/componentes/comunes/LayoutGeneral';
import { useComunidad } from '../../hooks/useComunidad';
import { useContenidoTraducido, crearContenidoMultiidioma } from '../../hooks/useContenidoTraducido';
import { CategoriaAnuncio, Anuncio, FiltrosAnuncios, EstadisticasTablon } from '../../tipos/anuncios';
import TarjetaAnuncio from '../../src/componentes/anuncios/TarjetaAnuncio';

// Traducciones
const traducciones = {
  ca: {
    titulo: 'Taulell d\'Anuncis',
    subtitulo: 'Compra, ven, intercanvia i troba el que necessites',
    publicarAnuncio: 'Publicar Anunci',
    buscar: 'Cercar anuncis...',
    filtros: 'Filtres',
    ordenar: 'Ordenar per',
    vista: 'Vista',
    categorias: {
      TRABAJO: 'Feina',
      VIVIENDA: 'Habitatge',
      VENTA: 'Venda',
      SERVICIOS: 'Serveis',
      INTERCAMBIO: 'Intercanvi',
      EVENTOS: 'Esdeveniments'
    },
    estadisticas: {
      total: 'Total anuncis',
      activos: 'Anuncis actius',
      nuevosHoy: 'Nous avui',
      masVistos: 'Més vistos'
    },
    ordenPor: {
      FECHA: 'Data de publicació',
      PRECIO: 'Preu',
      VISTAS: 'Visualitzacions',
      RELEVANCIA: 'Rellevància'
    },
    estados: {
      ACTIVO: 'Actiu',
      VENDIDO: 'Venut',
      CADUCADO: 'Caducat'
    },
    desde: 'des de',
    gratis: 'Gratis',
    negociable: 'Negociable',
    contactar: 'Contactar',
    favorito: 'Afegir a favorits',
    verMas: 'Veure més',
    sinResultados: 'No s\'han trobat anuncis',
    intentaAltres: 'Prova amb altres filtres o paraules clau',
    limpiarFiltros: 'Netejar filtres'
  },
  es: {
    titulo: 'Tablón de Anuncios',
    subtitulo: 'Compra, vende, intercambia y encuentra lo que necesitas',
    publicarAnuncio: 'Publicar Anuncio',
    buscar: 'Buscar anuncios...',
    filtros: 'Filtros',
    ordenar: 'Ordenar por',
    vista: 'Vista',
    categorias: {
      TRABAJO: 'Trabajo',
      VIVIENDA: 'Vivienda',
      VENTA: 'Venta',
      SERVICIOS: 'Servicios',
      INTERCAMBIO: 'Intercambio',
      EVENTOS: 'Eventos'
    },
    estadisticas: {
      total: 'Total anuncios',
      activos: 'Anuncios activos',
      nuevosHoy: 'Nuevos hoy',
      masVistos: 'Más vistos'
    },
    ordenPor: {
      FECHA: 'Fecha de publicación',
      PRECIO: 'Precio',
      VISTAS: 'Visualizaciones',
      RELEVANCIA: 'Relevancia'
    },
    estados: {
      ACTIVO: 'Activo',
      VENDIDO: 'Vendido',
      CADUCADO: 'Caducado'
    },
    desde: 'desde',
    gratis: 'Gratis',
    negociable: 'Negociable',
    contactar: 'Contactar',
    favorito: 'Añadir a favoritos',
    verMas: 'Ver más',
    sinResultados: 'No se encontraron anuncios',
    intentaAltres: 'Prueba con otros filtros o palabras clave',
    limpiarFiltros: 'Limpiar filtros'
  },
  eu: {
    titulo: 'Iragarkien Taula',
    subtitulo: 'Erosi, saldu, trukatu eta behar duzuna aurkitu',
    publicarAnuncio: 'Iragarkia Argitaratu',
    buscar: 'Iragarkiak bilatu...',
    filtros: 'Iragazkiak',
    ordenar: 'Ordenatu',
    vista: 'Ikuspegia',
    categorias: {
      TRABAJO: 'Lana',
      VIVIENDA: 'Etxebizitza',
      VENTA: 'Salmenta',
      SERVICIOS: 'Zerbitzuak',
      INTERCAMBIO: 'Trukaketa',
      EVENTOS: 'Gertaerak'
    },
    estadisticas: {
      total: 'Iragarkiak guztira',
      activos: 'Iragarki aktiboak',
      nuevosHoy: 'Gaur berriak',
      masVistos: 'Gehien ikusiak'
    },
    ordenPor: {
      FECHA: 'Argitalpen data',
      PRECIO: 'Prezioa',
      VISTAS: 'Ikustaldiak',
      RELEVANCIA: 'Garrantzia'
    },
    estados: {
      ACTIVO: 'Aktiboa',
      VENDIDO: 'Salduta',
      CADUCADO: 'Iraungita'
    },
    desde: 'hemendik',
    gratis: 'Doan',
    negociable: 'Negozia daiteke',
    contactar: 'Harremanetan jarri',
    favorito: 'Gogokoetara gehitu',
    verMas: 'Gehiago ikusi',
    sinResultados: 'Ez da iragarkirik aurkitu',
    intentaAltres: 'Saiatu beste iragazki edo gako-hitzekin',
    limpiarFiltros: 'Iragazkiak garbitu'
  },
  gl: {
    titulo: 'Taboleiro de Anuncios',
    subtitulo: 'Compra, vende, intercambia e atopa o que necesitas',
    publicarAnuncio: 'Publicar Anuncio',
    buscar: 'Buscar anuncios...',
    filtros: 'Filtros',
    ordenar: 'Ordenar por',
    vista: 'Vista',
    categorias: {
      TRABAJO: 'Traballo',
      VIVIENDA: 'Vivenda',
      VENTA: 'Venda',
      SERVICIOS: 'Servizos',
      INTERCAMBIO: 'Intercambio',
      EVENTOS: 'Eventos'
    },
    estadisticas: {
      total: 'Total anuncios',
      activos: 'Anuncios activos',
      nuevosHoy: 'Novos hoxe',
      masVistos: 'Máis vistos'
    },
    ordenPor: {
      FECHA: 'Data de publicación',
      PRECIO: 'Prezo',
      VISTAS: 'Visualizacións',
      RELEVANCIA: 'Relevancia'
    },
    estados: {
      ACTIVO: 'Activo',
      VENDIDO: 'Vendido',
      CADUCADO: 'Caducado'
    },
    desde: 'desde',
    gratis: 'Gratis',
    negociable: 'Negociable',
    contactar: 'Contactar',
    favorito: 'Engadir a favoritos',
    verMas: 'Ver máis',
    sinResultados: 'Non se atoparon anuncios',
    intentaAltres: 'Proba con outros filtros ou palabras clave',
    limpiarFiltros: 'Limpar filtros'
  }
};

// Iconos para categorías
const iconosCategoria = {
  TRABAJO: Briefcase,
  VIVIENDA: Home,
  VENTA: Package,
  SERVICIOS: Settings,
  INTERCAMBIO: Repeat,
  EVENTOS: CalendarIcon
};

// Ubicaciones disponibles (extraídas dinámicamente de los anuncios)
const obtenerUbicacionesDisponibles = (anuncios: Anuncio[]) => {
  const ubicaciones = new Set<string>();
  anuncios.forEach(anuncio => {
    ubicaciones.add(anuncio.ubicacion.provincia);
    ubicaciones.add(anuncio.ubicacion.ciudad);
  });
  return Array.from(ubicaciones).sort();
};

// Mock data para estadísticas
const mockEstadisticas: EstadisticasTablon = {
  totalAnuncios: 1358,
  anunciosActivos: 1203,
  anunciosHoy: 8,
  categorias: {
    TRABAJO: 1,
    VIVIENDA: 1,
    VENTA: 2,
    SERVICIOS: 2,
    INTERCAMBIO: 1,
    EVENTOS: 1
  },
  ubicaciones: [
    { provincia: 'Barcelona', cantidad: 4 },
    { provincia: 'Madrid', cantidad: 2 },
    { provincia: 'Bizkaia', cantidad: 1 },
    { provincia: 'Ourense', cantidad: 1 },
    { provincia: 'Valencia', cantidad: 1 }
  ],
  tendencias: []
};

// Mock data para anuncios - Variedad de idiomas originales
const mockAnuncios: Anuncio[] = [
  // Anuncio creado en catalán (desde Barcelona)
  {
    id: '1',
    titulo: crearContenidoMultiidioma('Pis de 3 habitacions - Zona Eixample', 'ca'),
    descripcion: crearContenidoMultiidioma('Llogue pis de 3 habitacions, 2 banys, menjador i cuina equipada. Molt lluminós, acabat de reformar. Metro a 2 minuts. Ideal per a famílies de funcionaris.', 'ca'),
    categoria: 'VIVIENDA',
    subcategoria: 'ALQUILER',
    precio: {
      tipo: 'FIJO',
      valor: 1200,
      moneda: 'EUR',
      negociable: false
    },
    ubicacion: {
      provincia: 'Barcelona',
      ciudad: 'Barcelona'
    },
    contacto: {
      preferencia: 'WHATSAPP',
      horarioContacto: 'Matins i vesprades'
    },
    imagenes: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
    ],
    tags: ['pis', 'eixample', 'reformat', 'funcionaris'],
    autor: {
      id: 'user1',
      nombre: 'Montse',
      apellidos: 'Vila',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4b0?w=100&h=100&fit=crop',
      organizacion: 'Ajuntament de Barcelona',
      provincia: 'Barcelona',
      verificado: true,
      valoracion: 4.8,
      fechaRegistro: new Date('2023-01-15')
    },
    fechaCreacion: new Date('2024-01-20T10:00:00'),
    fechaModificacion: new Date('2024-01-20T10:00:00'),
    fechaExpiracion: new Date('2024-04-20T23:59:59'),
    estado: 'ACTIVO',
    vistas: 156,
    favoritos: 23,
    contactos: 8,
    reportes: 0,
    verificado: true,
    destacado: true
  } as Anuncio,

  // Anuncio creado en español (desde Madrid)
  {
    id: '2',
    titulo: crearContenidoMultiidioma('MacBook Pro 13" M2 - Como nuevo', 'es'),
    descripcion: crearContenidoMultiidioma('Vendo MacBook Pro de 13 pulgadas con chip M2, apenas 3 meses de uso. Incluye cargador original, funda y ratón Apple. Estado impecable, garantía vigente.', 'es'),
    categoria: 'VENTA',
    subcategoria: 'ELECTRONICA',
    precio: {
      tipo: 'NEGOCIABLE',
      valor: 1400,
      moneda: 'EUR',
      negociable: true
    },
    ubicacion: {
      provincia: 'Madrid',
      ciudad: 'Madrid'
    },
    contacto: {
      preferencia: 'TELEFONO',
      telefono: '+34 600 123 456'
    },
    imagenes: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop'
    ],
    tags: ['macbook', 'apple', 'ordenador', 'como nuevo'],
    autor: {
      id: 'user2',
      nombre: 'Carlos',
      apellidos: 'Ruiz',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      organizacion: 'Comunidad de Madrid',
      provincia: 'Madrid',
      verificado: true,
      valoracion: 4.9,
      fechaRegistro: new Date('2023-05-10')
    },
    fechaCreacion: new Date('2024-01-19T14:30:00'),
    fechaModificacion: new Date('2024-01-19T14:30:00'),
    fechaExpiracion: new Date('2024-03-19T23:59:59'),
    estado: 'ACTIVO',
    vistas: 234,
    favoritos: 45,
    contactos: 12,
    reportes: 0,
    verificado: true,
    destacado: false
  } as Anuncio,

  // Anuncio creado en euskera (desde País Vasco)
  {
    id: '3',
    titulo: crearContenidoMultiidioma('Ingelesa eskolak - B2/C1 prestaketa', 'eu'),
    descripcion: crearContenidoMultiidioma('Irakasle jatorrak funtzionarientzako ingelesa eskolak eskaintzen ditu. 10 urteko esperientzia ziurtagiri ofizialak prestatzen. Talde txikiak edo banakako eskolak.', 'eu'),
    categoria: 'SERVICIOS',
    subcategoria: 'CLASES',
    precio: {
      tipo: 'FIJO',
      valor: 30,
      moneda: 'EUR',
      negociable: false
    },
    ubicacion: {
      provincia: 'Bizkaia',
      ciudad: 'Bilbao'
    },
    contacto: {
      preferencia: 'EMAIL',
      email: 'ingelesa@ejemplo.eus'
    },
    imagenes: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop'
    ],
    tags: ['ingelesa', 'eskolak', 'B2', 'C1', 'funtzionarioak'],
    autor: {
      id: 'user3',
      nombre: 'Amaia',
      apellidos: 'Etxebarria',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      organizacion: 'Eusko Jaurlaritza',
      provincia: 'Bizkaia',
      verificado: true,
      valoracion: 4.9,
      fechaRegistro: new Date('2022-09-20')
    },
    fechaCreacion: new Date('2024-01-18T09:15:00'),
    fechaModificacion: new Date('2024-01-18T09:15:00'),
    fechaExpiracion: new Date('2024-07-18T23:59:59'),
    estado: 'ACTIVO',
    vistas: 187,
    favoritos: 28,
    contactos: 9,
    reportes: 0,
    verificado: true,
    destacado: false
  } as Anuncio,

  // Anuncio creado en catalán (intercambio desde Barcelona)
  {
    id: '4',
    titulo: crearContenidoMultiidioma('Intercanvi de torns - Cap de setmana', 'ca'),
    descripcion: crearContenidoMultiidioma('Busco intercanviar els meus torns de cap de setmana per torns entre setmana. Soc policia local amb 5 anys d\'experiència. Flexibilitat total d\'horaris.', 'ca'),
    categoria: 'INTERCAMBIO',
    subcategoria: 'TURNOS',
    precio: {
      tipo: 'INTERCAMBIO',
      moneda: 'EUR',
      negociable: true
    },
    ubicacion: {
      provincia: 'Barcelona',
      ciudad: 'L\'Hospitalet'
    },
    contacto: {
      preferencia: 'WHATSAPP',
      telefono: '+34 666 777 888'
    },
    imagenes: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
    ],
    tags: ['intercanvi', 'torns', 'policia', 'horaris'],
    autor: {
      id: 'user4',
      nombre: 'Pere',
      apellidos: 'Soler',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      organizacion: 'Ajuntament de L\'Hospitalet',
      provincia: 'Barcelona',
      verificado: true,
      valoracion: 4.7,
      fechaRegistro: new Date('2023-03-20')
    },
    fechaCreacion: new Date('2024-01-17T16:45:00'),
    fechaModificacion: new Date('2024-01-17T16:45:00'),
    fechaExpiracion: new Date('2024-04-17T23:59:59'),
    estado: 'ACTIVO',
    vistas: 93,
    favoritos: 15,
    contactos: 6,
    reportes: 0,
    verificado: true,
    destacado: false
  } as Anuncio,

  // Anuncio creado en español (trabajo desde Madrid)
  {
    id: '5',
    titulo: crearContenidoMultiidioma('Oferta Trabajo: Administrativo Contabilidad', 'es'),
    descripcion: crearContenidoMultiidioma('Se busca administrativo/a para departamento de contabilidad. Experiencia mínima 2 años. Conocimientos de Excel avanzado y SAP. Contrato indefinido, jornada completa.', 'es'),
    categoria: 'TRABAJO',
    subcategoria: 'OFERTA_EMPLEO',
    precio: {
      tipo: 'FIJO',
      valor: 24000,
      moneda: 'EUR',
      negociable: false
    },
    ubicacion: {
      provincia: 'Madrid',
      ciudad: 'Getafe'
    },
    contacto: {
      preferencia: 'EMAIL',
      email: 'rrhh@ayuntamientogetafe.es'
    },
    imagenes: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop'
    ],
    tags: ['trabajo', 'administrativo', 'contabilidad', 'indefinido'],
    autor: {
      id: 'user5',
      nombre: 'Ana',
      apellidos: 'López',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4b0?w=100&h=100&fit=crop',
      organizacion: 'Ayuntamiento de Getafe',
      provincia: 'Madrid',
      verificado: true,
      valoracion: 4.6,
      fechaRegistro: new Date('2023-07-10')
    },
    fechaCreacion: new Date('2024-01-16T11:20:00'),
    fechaModificacion: new Date('2024-01-16T11:20:00'),
    fechaExpiracion: new Date('2024-02-16T23:59:59'),
    estado: 'ACTIVO',
    vistas: 312,
    favoritos: 67,
    contactos: 23,
    reportes: 0,
    verificado: true,
    destacado: true
  } as Anuncio,

  // Anuncio creado en gallego (evento desde Galicia)
  {
    id: '6',
    titulo: crearContenidoMultiidioma('Evento familiar - Andainas pola Ribeira Sacra', 'gl'),
    descripcion: crearContenidoMultiidioma('Organizamos andainas familiares polos Canóns do Sil. Actividade gratuíta para funcionarios e as súas familias. Incluíe transporte, guía e comida. Prazas limitadas.', 'gl'),
    categoria: 'EVENTOS',
    subcategoria: 'FAMILIAR',
    precio: {
      tipo: 'GRATUITO',
      moneda: 'EUR',
      negociable: false
    },
    ubicacion: {
      provincia: 'Ourense',
      ciudad: 'Ourense'
    },
    contacto: {
      preferencia: 'TELEFONO',
      telefono: '+34 988 123 456'
    },
    imagenes: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop'
    ],
    tags: ['evento', 'familia', 'andainas', 'ribeira sacra'],
    autor: {
      id: 'user6',
      nombre: 'Xosé',
      apellidos: 'González',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      organizacion: 'Deputación de Ourense',
      provincia: 'Ourense',
      verificado: true,
      valoracion: 4.8,
      fechaRegistro: new Date('2023-02-15')
    },
    fechaCreacion: new Date('2024-01-15T08:30:00'),
    fechaModificacion: new Date('2024-01-15T08:30:00'),
    fechaExpiracion: new Date('2024-02-15T23:59:59'),
    estado: 'ACTIVO',
    vistas: 145,
    favoritos: 34,
    contactos: 18,
    reportes: 0,
    verificado: true,
    destacado: false
  } as Anuncio,

  // Anuncio creado en catalán (venta desde Barcelona)
  {
    id: '7',
    titulo: crearContenidoMultiidioma('Bicicleta elèctrica - Poc ús', 'ca'),
    descripcion: crearContenidoMultiidioma('Venc bicicleta elèctrica marca Trek, model 2023. Només 200km d\'ús. Perfecta per anar a la feina. Bateria amb 80% de capacitat. Inclou casc i candau.', 'ca'),
    categoria: 'VENTA',
    subcategoria: 'OTROS',
    precio: {
      tipo: 'NEGOCIABLE',
      valor: 1800,
      moneda: 'EUR',
      negociable: true
    },
    ubicacion: {
      provincia: 'Barcelona',
      ciudad: 'Sant Cugat'
    },
    contacto: {
      preferencia: 'WHATSAPP',
      telefono: '+34 633 444 555'
    },
    imagenes: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop'
    ],
    tags: ['bicicleta', 'electrica', 'trek', 'poc us'],
    autor: {
      id: 'user7',
      nombre: 'Jordi',
      apellidos: 'Puig',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      organizacion: 'Generalitat de Catalunya',
      provincia: 'Barcelona',
      verificado: true,
      valoracion: 4.5,
      fechaRegistro: new Date('2023-06-05')
    },
    fechaCreacion: new Date('2024-01-14T19:15:00'),
    fechaModificacion: new Date('2024-01-14T19:15:00'),
    fechaExpiracion: new Date('2024-03-14T23:59:59'),
    estado: 'ACTIVO',
    vistas: 167,
    favoritos: 29,
    contactos: 11,
    reportes: 0,
    verificado: true,
    destacado: false
  } as Anuncio,

  // Anuncio creado en español (servicio desde Valencia)
  {
    id: '8',
    titulo: crearContenidoMultiidioma('Traducciones Oficiales - Valenciano/Castellano', 'es'),
    descripcion: crearContenidoMultiidioma('Traductora jurada ofrece servicios de traducción oficial valenciano-castellano. Especializada en documentos administrativos para funcionarios. Entrega en 24h.', 'es'),
    categoria: 'SERVICIOS',
    subcategoria: 'TRADUCCIONES',
    precio: {
      tipo: 'FIJO',
      valor: 15,
      moneda: 'EUR',
      negociable: false
    },
    ubicacion: {
      provincia: 'Valencia',
      ciudad: 'Valencia'
    },
    contacto: {
      preferencia: 'EMAIL',
      email: 'traducciones@valencia.es'
    },
    imagenes: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
    ],
    tags: ['traducciones', 'valenciano', 'jurada', 'documentos'],
    autor: {
      id: 'user8',
      nombre: 'Carmen',
      apellidos: 'Martínez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      organizacion: 'Generalitat Valenciana',
      provincia: 'Valencia',
      verificado: true,
      valoracion: 4.9,
      fechaRegistro: new Date('2023-04-12')
    },
    fechaCreacion: new Date('2024-01-13T12:00:00'),
    fechaModificacion: new Date('2024-01-13T12:00:00'),
    fechaExpiracion: new Date('2024-07-13T23:59:59'),
    estado: 'ACTIVO',
    vistas: 203,
    favoritos: 41,
    contactos: 15,
    reportes: 0,
    verificado: true,
    destacado: true
  } as Anuncio
];

export default function TaulerAnuncisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { idioma, configuracion } = useComunidad();
  const tema = configuracion.tema;
  const t = (traducciones as any)[idioma] || traducciones.es;
  
  // Estados
  const [anunciosOriginales] = useState<Anuncio[]>(mockAnuncios);
  const [anuncios, setAnuncios] = useState<Anuncio[]>(mockAnuncios);
  const [filtros, setFiltros] = useState<FiltrosAnuncios>({});
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaAnuncio | ''>('');
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState('');
  const [soloDestacados, setSoloDestacados] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [vista, setVista] = useState<'grid' | 'list'>('grid');
  const [ordenPor, setOrdenPor] = useState<'FECHA' | 'PRECIO' | 'VISTAS' | 'RELEVANCIA'>('FECHA');
  const [loading, setLoading] = useState(false);

  // Función para filtrar y buscar anuncios
  const filtrarAnuncios = () => {
    let resultado = [...anunciosOriginales];

    // Filtro por búsqueda de texto
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(anuncio => 
        anuncio.titulo.texto.toLowerCase().includes(termino) ||
        anuncio.descripcion.texto.toLowerCase().includes(termino) ||
        anuncio.tags.some(tag => tag.toLowerCase().includes(termino)) ||
        anuncio.ubicacion.ciudad.toLowerCase().includes(termino) ||
        anuncio.ubicacion.provincia.toLowerCase().includes(termino) ||
        anuncio.autor.nombre.toLowerCase().includes(termino) ||
        anuncio.autor.organizacion.toLowerCase().includes(termino)
      );
    }

    // Filtro por categoría
    if (categoriaSeleccionada) {
      resultado = resultado.filter(anuncio => anuncio.categoria === categoriaSeleccionada);
    }

    // Filtro por ubicación
    if (ubicacionSeleccionada) {
      resultado = resultado.filter(anuncio => 
        anuncio.ubicacion.provincia === ubicacionSeleccionada ||
        anuncio.ubicacion.ciudad === ubicacionSeleccionada
      );
    }

    // Filtro por destacados
    if (soloDestacados) {
      resultado = resultado.filter(anuncio => anuncio.destacado);
    }

    // Ordenamiento
    resultado.sort((a, b) => {
      switch (ordenPor) {
        case 'FECHA':
          return b.fechaCreacion.getTime() - a.fechaCreacion.getTime();
        case 'PRECIO':
          const precioA = a.precio.valor || 0;
          const precioB = b.precio.valor || 0;
          return precioA - precioB;
        case 'VISTAS':
          return b.vistas - a.vistas;
        case 'RELEVANCIA':
          // Priorizar destacados, luego por vistas y después por fecha
          if (a.destacado !== b.destacado) {
            return a.destacado ? -1 : 1;
          }
          if (a.vistas !== b.vistas) {
            return b.vistas - a.vistas;
          }
          return b.fechaCreacion.getTime() - a.fechaCreacion.getTime();
        default:
          return 0;
      }
    });

    return resultado;
  };

  // Efectos
  useEffect(() => {
    setLoading(true);
    // Simular delay de búsqueda
    const timer = setTimeout(() => {
      const anunciosFiltrados = filtrarAnuncios();
      setAnuncios(anunciosFiltrados);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [busqueda, categoriaSeleccionada, ubicacionSeleccionada, soloDestacados, ordenPor]);

  // Handlers
  const handleBusqueda = (texto: string) => {
    setBusqueda(texto);
  };

  const handleCategoriaChange = (categoria: CategoriaAnuncio | '') => {
    setCategoriaSeleccionada(categoria);
  };

  const handleUbicacionChange = (ubicacion: string) => {
    setUbicacionSeleccionada(ubicacion);
  };

  const handleDestacadosToggle = () => {
    setSoloDestacados(!soloDestacados);
  };

  const handleLimpiarFiltros = () => {
    setBusqueda('');
    setCategoriaSeleccionada('');
    setUbicacionSeleccionada('');
    setSoloDestacados(false);
    setOrdenPor('FECHA');
  };

  const handlePublicarAnuncio = () => {
    router.push('/tauler-anuncis/nou');
  };

  const handleContactar = (anuncioId: string) => {
    // Lógica para contactar con el anunciante
    console.log('Contactar anuncio:', anuncioId);
  };

  const handleFavorito = (anuncioId: string) => {
    // Lógica para añadir/quitar de favoritos
    console.log('Toggle favorito:', anuncioId);
  };

  const formatearPrecio = (precio: any) => {
    if (precio.tipo === 'GRATUITO') return t.gratis;
    if (precio.tipo === 'INTERCAMBIO') return t.intercambio;
    
    let texto = `${precio.valor}${precio.moneda}`;
    if (precio.negociable) texto += ` (${t.negociable})`;
    return texto;
  };

  const formatearFecha = (fecha: Date) => {
    const ahora = new Date();
    const diff = ahora.getTime() - fecha.getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Ayer';
    if (dias < 7) return `Hace ${dias} días`;
    return fecha.toLocaleDateString();
  };

  return (
    <LayoutGeneral paginaActual="tauler-anuncis">
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
            
            <div className="mt-4 sm:mt-0">
              <button
                onClick={handlePublicarAnuncio}
                className="inline-flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors"
                style={{ backgroundColor: tema.colorPrimario }}
              >
                <Plus size={20} className="mr-2" />
                {t.publicarAnuncio}
              </button>
            </div>
          </div>
        </div>

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Package size={24} style={{ color: tema.colorPrimario }} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {mockEstadisticas.totalAnuncios.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {t.estadisticas.total}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Eye size={24} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {mockEstadisticas.anunciosActivos.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {t.estadisticas.activos}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp size={24} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {mockEstadisticas.anunciosHoy}
                </div>
                <div className="text-sm text-gray-600">
                  {t.estadisticas.nuevosHoy}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Users size={24} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.max(...Object.values(mockEstadisticas.categorias))}
                </div>
                <div className="text-sm text-gray-600">
                  {t.estadisticas.masVistos}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => handleBusqueda(e.target.value)}
                placeholder={t.buscar}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Categorías */}
            <div className="min-w-48">
              <select
                value={categoriaSeleccionada}
                onChange={(e) => handleCategoriaChange(e.target.value as CategoriaAnuncio | '')}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{idioma === 'ca' ? 'Totes les categories' : 'Todas las categorías'}</option>
                {Object.entries(t.categorias).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Ubicaciones */}
            <div className="min-w-48">
              <select
                value={ubicacionSeleccionada}
                onChange={(e) => handleUbicacionChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{idioma === 'ca' ? 'Totes les ubicacions' : 'Todas las ubicaciones'}</option>
                {obtenerUbicacionesDisponibles(anunciosOriginales).map(ubicacion => (
                  <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
                ))}
              </select>
            </div>
            
            {/* Ordenar */}
            <div className="min-w-48">
              <select
                value={ordenPor}
                onChange={(e) => setOrdenPor(e.target.value as typeof ordenPor)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(t.ordenPor).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            
            {/* Vista */}
            <div className="flex border rounded-lg">
              <button
                onClick={() => setVista('grid')}
                className={`p-2 ${vista === 'grid' ? 'bg-gray-100' : ''} rounded-l-lg`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setVista('list')}
                className={`p-2 ${vista === 'list' ? 'bg-gray-100' : ''} rounded-r-lg`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Filtros adicionales */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-200">
            {/* Checkbox destacados */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={soloDestacados}
                onChange={handleDestacadosToggle}
                className="mr-2"
                style={{ accentColor: tema.colorPrimario }}
              />
              <span className="text-sm">{idioma === 'ca' ? 'Només destacats' : 'Solo destacados'}</span>
            </label>

            {/* Contador de resultados */}
            <div className="text-sm text-gray-600">
              {anuncios.length} {idioma === 'ca' ? 'anuncis trobats' : 'anuncios encontrados'}
            </div>

            {/* Botón limpiar filtros */}
            {(busqueda || categoriaSeleccionada || ubicacionSeleccionada || soloDestacados) && (
              <button
                onClick={handleLimpiarFiltros}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-gray-100"
              >
                ✕ {t.limpiarFiltros}
              </button>
            )}
          </div>
        </div>

        {/* Lista de Anuncios */}
        <div className={`grid gap-4 ${vista === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
        }`}>
          {loading ? (
            // Skeleton loading
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : anuncios.length === 0 ? (
            // Estado vacío
            <div className="col-span-full bg-white rounded-xl p-12 text-center border border-gray-200">
              <Package size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t.sinResultados}
              </h3>
              <p className="text-gray-600 mb-4">
                {t.intentaAltres}
              </p>
              <button
                onClick={handleLimpiarFiltros}
                className="text-blue-600 hover:text-blue-700"
              >
                {t.limpiarFiltros}
              </button>
            </div>
          ) : (
            // Lista de anuncios con traducción automática
            anuncios.map((anuncio) => (
              <TarjetaAnuncio
                key={anuncio.id}
                anuncio={anuncio}
                vista={vista}
                onFavorito={handleFavorito}
                onContactar={handleContactar}
              />
            ))
          )}
        </div>
        
      </div>
    </LayoutGeneral>
  );
}