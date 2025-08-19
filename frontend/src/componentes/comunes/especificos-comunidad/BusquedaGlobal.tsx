'use client';

import {
  Briefcase,
  Building,
  Calendar,
  EyeOff,
  Filter,
  Globe,
  Heart,
  History,
  Lock,
  MapPin,
  MessageCircle,
  MessageSquare,
  Search,
  Share,
  Star,
  Tag,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useComunidad } from '../../../../hooks/useComunidad';
import {
  CategoriaGrupo,
  EventoPost,
  Grupo,
  OfertaPost,
  Post,
  TipoGrupo,
  TipoPost,
  TipoUsuario,
  Usuario,
} from '../../../../tipos/redSocial';
import { Boton } from './ui/Boton';

interface PropiedadesBusquedaGlobal {
  abierto: boolean;
  onCerrar: () => void;
  usuario: Usuario;
  onSeleccionarResultado: (tipo: TipoResultado, item: any) => void;
}

type TipoResultado = 'usuario' | 'grupo' | 'post' | 'evento' | 'oferta' | 'empresa';

interface ResultadoBusqueda {
  tipo: TipoResultado;
  item: Usuario | Grupo | Post | EventoPost | OfertaPost;
  relevancia: number;
  razonCoincidencia: string[];
}

interface FiltrosBusqueda {
  tipo: TipoResultado | 'todos';
  fechaDesde?: Date;
  fechaHasta?: Date;
  ubicacion?: string;
  categoria?: string;
  verificado?: boolean;
  activo?: boolean;
}

interface HistorialBusqueda {
  termino: string;
  fecha: Date;
  resultados: number;
}

interface SugerenciaBusqueda {
  termino: string;
  tipo: 'trending' | 'reciente' | 'sugerida';
  popularidad?: number;
}

// Hook personalizado para búsqueda con debounce
const useBusquedaDebounce = (termino: string, delay: number = 300) => {
  const [terminoDebounce, setTermino] = useState(termino);

  useEffect(() => {
    const handler = setTimeout(() => {
      setTermino(termino);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [termino, delay]);

  return terminoDebounce;
};

// Componente de filtros avanzados
const FiltrosAvanzados: React.FC<{
  filtros: FiltrosBusqueda;
  onCambiarFiltros: (filtros: FiltrosBusqueda) => void;
  abierto: boolean;
  onCerrar: () => void;
}> = ({ filtros, onCambiarFiltros, abierto, onCerrar }) => {
  const { configuracion } = useComunidad();

  const actualizarFiltro = (campo: keyof FiltrosBusqueda, valor: any) => {
    onCambiarFiltros({ ...filtros, [campo]: valor });
  };

  if (!abierto) return null;

  return (
    <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-6 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtros Avanzados</h3>
        <button onClick={onCerrar} className="p-1 hover:bg-gray-100 rounded">
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tipo de contenido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de contenido</label>
          <select
            value={filtros.tipo}
            onChange={(e) => actualizarFiltro('tipo', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos</option>
            <option value="usuario">Usuarios</option>
            <option value="grupo">Grupos</option>
            <option value="post">Publicaciones</option>
            <option value="evento">Eventos</option>
            <option value="oferta">Ofertas de trabajo</option>
            <option value="empresa">Empresas</option>
          </select>
        </div>

        {/* Fecha desde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
          <input
            type="date"
            value={filtros.fechaDesde?.toISOString().split('T')[0] || ''}
            onChange={(e) =>
              actualizarFiltro('fechaDesde', e.target.value ? new Date(e.target.value) : undefined)
            }
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Fecha hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
          <input
            type="date"
            value={filtros.fechaHasta?.toISOString().split('T')[0] || ''}
            onChange={(e) =>
              actualizarFiltro('fechaHasta', e.target.value ? new Date(e.target.value) : undefined)
            }
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
          <select
            value={filtros.ubicacion || ''}
            onChange={(e) => actualizarFiltro('ubicacion', e.target.value || undefined)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las ubicaciones</option>
            {configuracion.provincias?.map((provincia) => (
              <option key={provincia} value={provincia}>
                {provincia}
              </option>
            ))}
          </select>
        </div>

        {/* Verificado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filtros.verificado || false}
                onChange={(e) => actualizarFiltro('verificado', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Solo verificados</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filtros.activo !== false}
                onChange={(e) => actualizarFiltro('activo', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Solo activos</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
        <Boton
          variante="secundario"
          onClick={() => {
            onCambiarFiltros({ tipo: 'todos' });
            onCerrar();
          }}
        >
          Limpiar filtros
        </Boton>
        <Boton variante="primario" onClick={onCerrar}>
          Aplicar filtros
        </Boton>
      </div>
    </div>
  );
};

// Componente para mostrar sugerencias
const SugerenciasBusqueda: React.FC<{
  sugerencias: SugerenciaBusqueda[];
  onSeleccionarSugerencia: (termino: string) => void;
  historial: HistorialBusqueda[];
}> = ({ sugerencias, onSeleccionarSugerencia, historial }) => {
  return (
    <div className="p-4 space-y-4">
      {/* Búsquedas recientes */}
      {historial.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <History size={16} className="mr-2" />
            Búsquedas recientes
          </h4>
          <div className="space-y-1">
            {historial.slice(0, 3).map((busqueda, indice) => (
              <button
                key={indice}
                onClick={() => onSeleccionarSugerencia(busqueda.termino)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between"
              >
                <span className="text-sm text-gray-700">{busqueda.termino}</span>
                <span className="text-xs text-gray-500">{busqueda.resultados} resultados</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tendencias */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <TrendingUp size={16} className="mr-2" />
          Tendencias
        </h4>
        <div className="space-y-1">
          {sugerencias
            .filter((s) => s.tipo === 'trending')
            .slice(0, 4)
            .map((sugerencia, indice) => (
              <button
                key={indice}
                onClick={() => onSeleccionarSugerencia(sugerencia.termino)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between"
              >
                <span className="text-sm text-gray-700">{sugerencia.termino}</span>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp size={12} className="mr-1" />
                  {sugerencia.popularidad}
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Sugerencias */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Zap size={16} className="mr-2" />
          Sugerencias
        </h4>
        <div className="space-y-1">
          {sugerencias
            .filter((s) => s.tipo === 'sugerida')
            .slice(0, 3)
            .map((sugerencia, indice) => (
              <button
                key={indice}
                onClick={() => onSeleccionarSugerencia(sugerencia.termino)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-700">{sugerencia.termino}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar un resultado individual
const ResultadoItem: React.FC<{
  resultado: ResultadoBusqueda;
  onSeleccionar: () => void;
  resaltarTermino: string;
}> = ({ resultado, onSeleccionar, resaltarTermino }) => {
  const resaltarTexto = (texto: string, termino: string) => {
    if (!termino) return texto;

    const regex = new RegExp(`(${termino})`, 'gi');
    const partes = texto.split(regex);

    return partes.map((parte, indice) =>
      regex.test(parte) ? (
        <mark key={indice} className="bg-yellow-200 px-1 rounded">
          {parte}
        </mark>
      ) : (
        parte
      ),
    );
  };

  const obtenerIconoTipo = (tipo: TipoResultado) => {
    switch (tipo) {
      case 'usuario':
        return <Users size={16} className="text-blue-500" />;
      case 'grupo':
        return <Users size={16} className="text-green-500" />;
      case 'post':
        return <MessageSquare size={16} className="text-purple-500" />;
      case 'evento':
        return <Calendar size={16} className="text-orange-500" />;
      case 'oferta':
        return <Briefcase size={16} className="text-indigo-500" />;
      case 'empresa':
        return <Building size={16} className="text-red-500" />;
      default:
        return <Search size={16} className="text-gray-500" />;
    }
  };

  const renderizarContenido = () => {
    switch (resultado.tipo) {
      case 'usuario':
        const usuario = resultado.item as Usuario;
        return (
          <div className="flex items-center space-x-3">
            <img
              src={
                usuario.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre + ' ' + usuario.apellidos)}&background=random`
              }
              alt={`${usuario.nombre} ${usuario.apellidos}`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900 truncate">
                  {resaltarTexto(`${usuario.nombre} ${usuario.apellidos}`, resaltarTermino)}
                </h3>
                {usuario.verificado && <Star size={14} className="text-yellow-500" />}
              </div>
              <p className="text-sm text-gray-600 truncate">
                {usuario.perfil?.cargo || usuario.tipo.replace('-', ' ')}
              </p>
              <p className="text-xs text-gray-500">
                {usuario.perfil?.ubicacion && (
                  <>
                    <MapPin size={12} className="inline mr-1" />
                    {usuario.perfil.ubicacion}
                  </>
                )}
              </p>
            </div>
          </div>
        );

      case 'grupo':
        const grupo = resultado.item as Grupo;
        return (
          <div className="flex items-center space-x-3">
            <img
              src={
                grupo.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(grupo.nombre)}&background=random`
              }
              alt={grupo.nombre}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900 truncate">
                  {resaltarTexto(grupo.nombre, resaltarTermino)}
                </h3>
                {grupo.tipo === 'publico' && <Globe size={12} className="text-green-500" />}
                {grupo.tipo === 'privado' && <Lock size={12} className="text-yellow-500" />}
                {grupo.tipo === 'oculto' && <EyeOff size={12} className="text-red-500" />}
              </div>
              <p className="text-sm text-gray-600 truncate">
                {resaltarTexto(grupo.descripcion, resaltarTermino)}
              </p>
              <p className="text-xs text-gray-500">
                {grupo.miembros?.length || 0} miembros • {grupo.categoria}
              </p>
            </div>
          </div>
        );

      case 'post':
        const post = resultado.item as Post;
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <img
                src={`https://ui-avatars.com/api/?name=Usuario&background=random`}
                alt="Usuario"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-900">Usuario</span>
              <span className="text-xs text-gray-500">
                {post.fechaCreacion.toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {resaltarTexto(post.contenido, resaltarTermino)}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <Heart size={12} className="mr-1" /> {post.estadisticas?.reacciones?.like || 0}
              </span>
              <span className="flex items-center">
                <MessageCircle size={12} className="mr-1" /> {post.estadisticas?.comentarios || 0}
              </span>
              <span className="flex items-center">
                <Share size={12} className="mr-1" /> {post.estadisticas?.compartidos || 0}
              </span>
            </div>
          </div>
        );

      case 'evento':
        const evento = resultado.item as EventoPost;
        return (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">
              {resaltarTexto(evento.titulo, resaltarTermino)}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {resaltarTexto(evento.descripcion || '', resaltarTermino)}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <Calendar size={12} className="mr-1" />
                {evento.fechaInicio.toLocaleDateString()}
              </span>
              {evento.ubicacion && (
                <span className="flex items-center">
                  <MapPin size={12} className="mr-1" />
                  {evento.ubicacion}
                </span>
              )}
              <span>{evento.maxParticipantes || 0} participantes</span>
            </div>
          </div>
        );

      case 'oferta':
        const oferta = resultado.item as OfertaPost;
        return (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">
              {resaltarTexto(oferta.titulo, resaltarTermino)}
            </h3>
            <p className="text-sm text-gray-600">
              {oferta.organizacion} • {oferta.ubicacion}
            </p>
            <p className="text-sm text-gray-700 line-clamp-2">
              {resaltarTexto(oferta.descripcion, resaltarTermino)}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>{oferta.categoria}</span>
              {oferta.fechaLimite && <span>Hasta: {oferta.fechaLimite.toLocaleDateString()}</span>}
              {oferta.salario && (
                <span>
                  {oferta.salario.minimo}€ - {oferta.salario.maximo}€
                </span>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h3 className="font-medium text-gray-900">Resultado desconocido</h3>
          </div>
        );
    }
  };

  return (
    <button
      onClick={onSeleccionar}
      className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">{obtenerIconoTipo(resultado.tipo)}</div>
        <div className="flex-1 min-w-0">
          {renderizarContenido()}

          {/* Razones de coincidencia */}
          {resultado.razonCoincidencia.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {resultado.razonCoincidencia.map((razon, indice) => (
                <span
                  key={indice}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
                >
                  <Tag size={10} className="mr-1" />
                  {razon}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Score de relevancia */}
        <div className="flex-shrink-0 text-right">
          <div className="text-xs text-gray-500">
            Relevancia: {Math.round(resultado.relevancia * 100)}%
          </div>
        </div>
      </div>
    </button>
  );
};

// Componente principal de búsqueda
export const BusquedaGlobal: React.FC<PropiedadesBusquedaGlobal> = ({
  abierto,
  onCerrar,
  usuario,
  onSeleccionarResultado,
}) => {
  const { configuracion } = useComunidad();
  const [termino, setTermino] = useState('');
  const [filtros, setFiltros] = useState<FiltrosBusqueda>({ tipo: 'todos' });
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [cargando, setCargando] = useState(false);
  const [historial, setHistorial] = useState<HistorialBusqueda[]>([]);
  const [sugerencias] = useState<SugerenciaBusqueda[]>([
    { termino: 'oposiciones educación', tipo: 'trending', popularidad: 145 },
    { termino: 'grupo programadores', tipo: 'trending', popularidad: 89 },
    { termino: 'eventos formación', tipo: 'trending', popularidad: 67 },
    { termino: 'ofertas sanidad', tipo: 'sugerida' },
    { termino: 'networking', tipo: 'sugerida' },
    { termino: 'mentoring', tipo: 'sugerida' },
  ]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const terminoDebounce = useBusquedaDebounce(termino, 300);

  // Foco automático al abrir
  useEffect(() => {
    if (abierto && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [abierto]);

  // Búsqueda automática con debounce
  useEffect(() => {
    if (terminoDebounce && terminoDebounce.length >= 2) {
      realizarBusqueda(terminoDebounce);
    } else {
      setResultados([]);
    }
  }, [terminoDebounce, filtros]);

  // Cargar historial desde localStorage
  useEffect(() => {
    try {
      const historialGuardado = localStorage.getItem('historial-busqueda');
      if (historialGuardado) {
        const historialParsed = JSON.parse(historialGuardado).map((item: any) => ({
          ...item,
          fecha: new Date(item.fecha),
        }));
        setHistorial(historialParsed);
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
    }
  }, []);

  const realizarBusqueda = async (terminoBusqueda: string) => {
    setCargando(true);

    try {
      // Simular API call - en producción haría una llamada real
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Datos de ejemplo más realistas
      const resultadosEjemplo: ResultadoBusqueda[] = [
        {
          tipo: 'usuario',
          item: {
            id: '1',
            nombre: 'María',
            apellidos: 'García López',
            email: 'maria@example.com',
            tipo: 'miembro' as TipoUsuario,
            verificado: true,
            activo: true,
            avatar: '',
            fechaRegistro: new Date(),
            comunidadId: configuracion.codigo,
            perfil: {
              biografia: 'Profesora de Matemáticas con experiencia en educación secundaria',
              ubicacion: 'Barcelona',
              cargo: 'Profesora de Matemáticas',
              organizacion: 'IES Barcelona',
              porcentajeCompletado: 90,
              configuracionPrivacidad: {
                perfilPublico: true,
                mostrarEmail: false,
                mostrarUbicacion: true,
                mostrarOrganizacion: true,
                permitirMensajes: true,
                permitirInvitacionesGrupos: true,
              },
            },
            configuracion: {
              idioma: 'es',
              tema: 'claro',
              notificaciones: {
                email: {
                  mensajes: true,
                  grupoNuevoPost: true,
                  invitacionGrupo: true,
                  tablonAnuncios: true,
                  eventos: true,
                },
                push: {
                  mensajes: true,
                  grupoNuevoPost: true,
                  invitacionGrupo: true,
                  menciones: true,
                },
              },
            },
            estadisticas: {
              gruposCreados: 2,
              gruposUnido: 15,
              postsCreados: 45,
              comentarios: 120,
              conexiones: 85,
              puntuacionReputacion: 750,
            },
          } as Usuario,
          relevancia: 0.95,
          razonCoincidencia: ['Nombre coincide', 'Profesión relacionada'],
        },
        {
          tipo: 'grupo',
          item: {
            id: '2',
            nombre: 'Oposiciones Educación 2024',
            descripcion: 'Grupo de estudio para oposiciones de educación secundaria',
            categoria: 'profesional' as CategoriaGrupo,
            tipo: 'publico' as TipoGrupo,
            subcategoria: 'educacion',
            creadorId: '1',
            administradores: ['1'],
            moderadores: [],
            miembros: Array.from({ length: 247 }, (_, i) => ({
              usuarioId: `user-${i}`,
              rol: i === 0 ? ('administrador' as const) : ('miembro' as const),
              fechaUnion: new Date(),
              activo: true,
            })),
            fechaCreacion: new Date(),
            comunidadId: configuracion.codigo,
            configuracion: {
              requiereAprobacion: false,
              limiteMiembros: 1000,
              permitirInvitaciones: true,
              moderacionPosts: false,
            },
            estadisticas: {
              totalMiembros: 247,
              miembrosActivos: 203,
              postsEstesMes: 45,
              crecimientoMensual: 12,
            },
            etiquetas: ['oposiciones', 'educacion', 'secundaria'],
          } as Grupo,
          relevancia: 0.88,
          razonCoincidencia: ['Título coincide', 'Categoría: Profesional'],
        },
        {
          tipo: 'post',
          item: {
            id: '3',
            contenido:
              'Compartiendo recursos para preparar oposiciones de educación. ¿Alguien tiene experiencia con el temario de historia?',
            autorId: '1',
            fechaCreacion: new Date(Date.now() - 2 * 60 * 60 * 1000),
            tipo: 'texto' as TipoPost,
            etiquetas: ['educacion', 'oposiciones', 'historia'],
            visibilidad: 'publico',
            moderado: true,
            fijado: false,
            comentarios: [],
            reacciones: Array.from({ length: 24 }, (_, i) => ({
              usuarioId: `user-${i}`,
              tipo: 'like' as const,
              fechaCreacion: new Date(),
            })),
            estadisticas: {
              visualizaciones: 156,
              comentarios: 18,
              reacciones: { like: 24, love: 3, wow: 2, angry: 0, sad: 0 },
              compartidos: 5,
            },
          } as Post,
          relevancia: 0.82,
          razonCoincidencia: ['Contenido relacionado', 'Etiquetas: educación'],
        },
      ];

      // Filtrar resultados según filtros activos
      let resultadosFiltrados = resultadosEjemplo;

      if (filtros.tipo !== 'todos') {
        resultadosFiltrados = resultadosFiltrados.filter((r) => r.tipo === filtros.tipo);
      }

      if (filtros.verificado) {
        resultadosFiltrados = resultadosFiltrados.filter((r) => {
          if (r.tipo === 'usuario') {
            return (r.item as Usuario).verificado;
          }
          return true;
        });
      }

      setResultados(resultadosFiltrados);

      // Guardar en historial
      const nuevaBusqueda: HistorialBusqueda = {
        termino: terminoBusqueda,
        fecha: new Date(),
        resultados: resultadosFiltrados.length,
      };

      const nuevoHistorial = [nuevaBusqueda, ...historial.slice(0, 9)]; // Máximo 10 entradas
      setHistorial(nuevoHistorial);

      try {
        localStorage.setItem('historial-busqueda', JSON.stringify(nuevoHistorial));
      } catch (error) {
        console.error('Error guardando historial:', error);
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setResultados([]);
    } finally {
      setCargando(false);
    }
  };

  const manejarSeleccionSugerencia = (terminoSugerencia: string) => {
    setTermino(terminoSugerencia);
  };

  const manejarSeleccionResultado = (resultado: ResultadoBusqueda) => {
    onSeleccionarResultado(resultado.tipo, resultado.item);
    onCerrar();
  };

  const limpiarBusqueda = () => {
    setTermino('');
    setResultados([]);
    setFiltros({ tipo: 'todos' });
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header de búsqueda */}
        <div className="relative p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={`Buscar en ${configuracion.nombre}...`}
                value={termino}
                onChange={(e) => setTermino(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              {termino && (
                <button
                  onClick={limpiarBusqueda}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
                className={`flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors ${
                  filtrosAbiertos ||
                  filtros.tipo !== 'todos' ||
                  filtros.verificado ||
                  filtros.ubicacion
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter size={18} />
                <span>Filtros</span>
              </button>

              <FiltrosAvanzados
                filtros={filtros}
                onCambiarFiltros={setFiltros}
                abierto={filtrosAbiertos}
                onCerrar={() => setFiltrosAbiertos(false)}
              />
            </div>

            <button onClick={onCerrar} className="p-3 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex h-96">
          {/* Resultados */}
          <div className="flex-1 overflow-y-auto">
            {cargando ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Buscando...</p>
                </div>
              </div>
            ) : termino.length >= 2 ? (
              resultados.length > 0 ? (
                <div>
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm text-gray-600">
                      {resultados.length} resultados para "<strong>{termino}</strong>"
                    </p>
                  </div>
                  {resultados.map((resultado, indice) => (
                    <ResultadoItem
                      key={`${resultado.tipo}-${indice}`}
                      resultado={resultado}
                      onSeleccionar={() => manejarSeleccionResultado(resultado)}
                      resaltarTermino={termino}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Search size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sin resultados</h3>
                    <p className="text-gray-600 mb-4">
                      No encontramos nada para "<strong>{termino}</strong>"
                    </p>
                    <Boton
                      variante="secundario"
                      onClick={() => setFiltrosAbiertos(true)}
                      icono={<Filter size={16} />}
                    >
                      Ajustar filtros
                    </Boton>
                  </div>
                </div>
              )
            ) : (
              <SugerenciasBusqueda
                sugerencias={sugerencias}
                onSeleccionarSugerencia={manejarSeleccionSugerencia}
                historial={historial}
              />
            )}
          </div>

          {/* Sidebar con información adicional */}
          {termino.length >= 2 && resultados.length > 0 && (
            <div className="w-80 border-l border-gray-200 bg-gray-50 p-4">
              <h3 className="font-medium text-gray-900 mb-4">Refinar búsqueda</h3>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Por tipo</h4>
                  <div className="space-y-1">
                    {['usuario', 'grupo', 'post', 'evento', 'oferta'].map((tipo) => {
                      const count = resultados.filter((r) => r.tipo === tipo).length;
                      if (count === 0) return null;

                      return (
                        <button
                          key={tipo}
                          onClick={() => setFiltros({ ...filtros, tipo: tipo as TipoResultado })}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                            filtros.tipo === tipo
                              ? 'bg-blue-100 text-blue-700'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <span className="capitalize">{tipo}s</span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Búsquedas relacionadas</h4>
                  <div className="space-y-1">
                    {['oposiciones', 'formación', 'networking', 'eventos'].map((termino) => (
                      <button
                        key={termino}
                        onClick={() => manejarSeleccionSugerencia(termino)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-blue-600"
                      >
                        {termino}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer con atajos de teclado */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>
                Presiona <kbd className="px-2 py-1 bg-gray-200 rounded">Enter</kbd> para buscar
              </span>
              <span>
                Presiona <kbd className="px-2 py-1 bg-gray-200 rounded">Esc</kbd> para cerrar
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target size={12} />
              <span>Búsqueda avanzada disponible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusquedaGlobal;
