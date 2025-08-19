import React, { HTMLAttributes, forwardRef } from 'react';
import { useTema } from '../../../../../hooks/useComunidad';

export interface PropiedadesTarjeta extends HTMLAttributes<HTMLDivElement> {
  variante?: 'default' | 'outline' | 'filled' | 'comunidad';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  sombra?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickeable?: boolean;
  bordeDestacado?: boolean;
}

export interface PropiedadesEncabezadoTarjeta extends HTMLAttributes<HTMLDivElement> {
  conBorde?: boolean;
}

export interface PropiedadesContenidoTarjeta extends HTMLAttributes<HTMLDivElement> {}

export interface PropiedadesPieTarjeta extends HTMLAttributes<HTMLDivElement> {
  conBorde?: boolean;
}

/**
 * Componente Tarjeta principal
 */
export const Tarjeta = forwardRef<HTMLDivElement, PropiedadesTarjeta>(
  ({
    children,
    variante = 'default',
    padding = 'md',
    sombra = 'sm',
    hover = false,
    clickeable = false,
    bordeDestacado = false,
    className = '',
    ...props
  }, ref) => {
    const { colores } = useTema();

    // Clases base
    const clasesBase = [
      'bg-white',
      'rounded-lg',
      'transition-all',
      'duration-200'
    ];

    // Clases por variante
    const clasesPorVariante = {
      default: ['border', 'border-gray-200'],
      outline: ['border-2', 'border-gray-300'],
      filled: ['bg-gray-50', 'border', 'border-gray-100'],
      comunidad: ['border-2']
    };

    // Clases por padding
    const clasesPorPadding = {
      none: [],
      sm: ['p-3'],
      md: ['p-4'],
      lg: ['p-6'],
      xl: ['p-8']
    };

    // Clases por sombra
    const clasesPorSombra = {
      none: [],
      sm: ['shadow-sm'],
      md: ['shadow-md'],
      lg: ['shadow-lg'],
      xl: ['shadow-xl']
    };

    // Clases para hover
    const clasesHover = hover ? [
      'hover:shadow-lg',
      'hover:-translate-y-1',
      'transform'
    ] : [];

    // Clases para clickeable
    const clasesClickeable = clickeable ? [
      'cursor-pointer',
      'hover:shadow-md',
      'active:transform',
      'active:scale-95'
    ] : [];

    // Combinar clases
    const clasesFinales = [
      ...clasesBase,
      ...clasesPorVariante[variante],
      ...clasesPorPadding[padding],
      ...clasesPorSombra[sombra],
      ...clasesHover,
      ...clasesClickeable,
      className
    ].join(' ');

    // Estilos inline para comunidad
    const estilosInline: React.CSSProperties = {};
    
    if (variante === 'comunidad') {
      estilosInline.borderColor = colores.primario;
    }
    
    if (bordeDestacado) {
      estilosInline.borderTopColor = colores.primario;
      estilosInline.borderTopWidth = '4px';
    }

    return (
      <div
        ref={ref}
        className={clasesFinales}
        style={estilosInline}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * Componente para el encabezado de la tarjeta
 */
export const EncabezadoTarjeta = forwardRef<HTMLDivElement, PropiedadesEncabezadoTarjeta>(
  ({
    children,
    conBorde = true,
    className = '',
    ...props
  }, ref) => {
    const clasesBase = ['px-6', 'py-4'];
    const clasesBorde = conBorde ? ['border-b', 'border-gray-200'] : [];
    
    const clasesFinales = [
      ...clasesBase,
      ...clasesBorde,
      className
    ].join(' ');

    return (
      <div
        ref={ref}
        className={clasesFinales}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * Componente para el contenido de la tarjeta
 */
export const ContenidoTarjeta = forwardRef<HTMLDivElement, PropiedadesContenidoTarjeta>(
  ({
    children,
    className = '',
    ...props
  }, ref) => {
    const clasesFinales = ['px-6', 'py-4', className].join(' ');

    return (
      <div
        ref={ref}
        className={clasesFinales}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * Componente para el pie de la tarjeta
 */
export const PieTarjeta = forwardRef<HTMLDivElement, PropiedadesPieTarjeta>(
  ({
    children,
    conBorde = true,
    className = '',
    ...props
  }, ref) => {
    const clasesBase = ['px-6', 'py-4'];
    const clasesBorde = conBorde ? ['border-t', 'border-gray-200'] : [];
    
    const clasesFinales = [
      ...clasesBase,
      ...clasesBorde,
      className
    ].join(' ');

    return (
      <div
        ref={ref}
        className={clasesFinales}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * Componente especial para tarjetas de estadísticas
 */
export const TarjetaEstadistica = forwardRef<HTMLDivElement, {
  titulo: string;
  valor: string | number;
  descripcion?: string;
  icono?: React.ReactNode;
  tendencia?: {
    valor: number;
    tipo: 'positiva' | 'negativa' | 'neutral';
    periodo?: string;
  };
  onClick?: () => void;
} & Omit<PropiedadesTarjeta, 'children'>>(
  ({
    titulo,
    valor,
    descripcion,
    icono,
    tendencia,
    onClick,
    ...props
  }, ref) => {
    const { colores } = useTema();

    const iconoTendencia = tendencia ? (
      <span className={`inline-flex items-center text-sm font-medium ${
        tendencia.tipo === 'positiva' ? 'text-green-600' :
        tendencia.tipo === 'negativa' ? 'text-red-600' :
        'text-gray-600'
      }`}>
        {tendencia.tipo === 'positiva' && (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
        )}
        {tendencia.tipo === 'negativa' && (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
          </svg>
        )}
        {tendencia.valor > 0 ? '+' : ''}{tendencia.valor}%
        {tendencia.periodo && <span className="ml-1 text-gray-500">{tendencia.periodo}</span>}
      </span>
    ) : null;

    return (
      <Tarjeta
        ref={ref}
        clickeable={!!onClick}
        hover={!!onClick}
        bordeDestacado
        onClick={onClick}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{titulo}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{valor}</p>
            {descripcion && (
              <p className="text-sm text-gray-500 mt-1">{descripcion}</p>
            )}
            {iconoTendencia && (
              <div className="mt-2">{iconoTendencia}</div>
            )}
          </div>
          {icono && (
            <div 
              className="p-3 rounded-lg"
              style={{ 
                backgroundColor: `${colores.primario}15`,
                color: colores.primario 
              }}
            >
              {icono}
            </div>
          )}
        </div>
      </Tarjeta>
    );
  }
);

// Asignar display names
Tarjeta.displayName = 'Tarjeta';
EncabezadoTarjeta.displayName = 'EncabezadoTarjeta';
ContenidoTarjeta.displayName = 'ContenidoTarjeta';
PieTarjeta.displayName = 'PieTarjeta';
TarjetaEstadistica.displayName = 'TarjetaEstadistica';

export default Tarjeta;