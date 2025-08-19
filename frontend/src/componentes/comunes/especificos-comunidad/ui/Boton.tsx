import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { useTema } from '../../../../../hooks/useComunidad';

export interface PropiedadesBoton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'outline' | 'ghost' | 'link' | 'peligro';
  tamaño?: 'sm' | 'md' | 'lg' | 'xl';
  cargando?: boolean;
  icono?: React.ReactNode;
  iconoPosicion?: 'izquierda' | 'derecha';
  ancho?: 'auto' | 'completo';
}

/**
 * Componente Botón que se adapta automáticamente al tema de cada comunidad
 */
export const Boton = forwardRef<HTMLButtonElement, PropiedadesBoton>(
  ({
    children,
    variante = 'primario',
    tamaño = 'md',
    cargando = false,
    icono,
    iconoPosicion = 'izquierda',
    ancho = 'auto',
    className = '',
    disabled,
    ...props
  }, ref) => {
    const tema = useTema();
    const colores = {
      primario: tema.primario,
      secundario: tema.secundario,
      acento: tema.acento
    };

    // Clases base
    const clasesBase = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'transition-all',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'rounded-lg'
    ];

    // Clases por variante
    const clasesPorVariante = {
      primario: [
        'text-white',
        'shadow-sm',
        'hover:shadow-md',
        'focus:ring-offset-2',
        'transform',
        'hover:-translate-y-0.5'
      ],
      secundario: [
        'border',
        'shadow-sm',
        'hover:shadow-md',
        'focus:ring-offset-2',
        'transform',
        'hover:-translate-y-0.5'
      ],
      outline: [
        'border-2',
        'bg-transparent',
        'hover:bg-opacity-10',
        'focus:ring-offset-2'
      ],
      ghost: [
        'bg-transparent',
        'hover:bg-opacity-10',
        'focus:ring-offset-0'
      ],
      link: [
        'bg-transparent',
        'p-0',
        'h-auto',
        'font-semibold',
        'hover:underline',
        'focus:ring-offset-0'
      ],
      peligro: [
        'bg-red-600',
        'text-white',
        'hover:bg-red-700',
        'focus:ring-red-500',
        'shadow-sm',
        'hover:shadow-md'
      ]
    };

    // Clases por tamaño
    const clasesPorTamaño = {
      sm: ['px-3', 'py-1.5', 'text-sm', 'h-8'],
      md: ['px-4', 'py-2', 'text-sm', 'h-10'],
      lg: ['px-6', 'py-3', 'text-base', 'h-12'],
      xl: ['px-8', 'py-4', 'text-lg', 'h-14']
    };

    // Clase para ancho completo
    const claseAncho = ancho === 'completo' ? 'w-full' : 'w-auto';

    // Combinar todas las clases
    const clasesFinales = [
      ...clasesBase,
      ...clasesPorVariante[variante],
      ...clasesPorTamaño[tamaño],
      claseAncho,
      className
    ].join(' ');

    // Estilos inline para colores de comunidad
    const estilosInline: React.CSSProperties = {};
    
    switch (variante) {
      case 'primario':
        estilosInline.backgroundColor = colores.primario;
        // estilosInline.focusRingColor = colores.primario; // No es una propiedad CSS válida
        break;
      case 'secundario':
        estilosInline.backgroundColor = colores.secundario;
        estilosInline.borderColor = colores.secundario;
        estilosInline.color = colores.primario;
        break;
      case 'outline':
        estilosInline.borderColor = colores.primario;
        estilosInline.color = colores.primario;
        break;
      case 'ghost':
        estilosInline.color = colores.primario;
        break;
      case 'link':
        estilosInline.color = colores.primario;
        break;
    }

    // Componente de loading
    const IconoCargando = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    // Renderizar icono
    const renderizarIcono = () => {
      if (cargando) {
        return <IconoCargando />;
      }
      return icono;
    };

    return (
      <button
        ref={ref}
        className={clasesFinales}
        style={estilosInline}
        disabled={disabled || cargando}
        {...props}
      >
        {/* Icono a la izquierda */}
        {renderizarIcono() && iconoPosicion === 'izquierda' && (
          <span className={children ? 'mr-2' : ''}>
            {renderizarIcono()}
          </span>
        )}
        
        {/* Contenido del botón */}
        {children}
        
        {/* Icono a la derecha */}
        {renderizarIcono() && iconoPosicion === 'derecha' && (
          <span className={children ? 'ml-2' : ''}>
            {renderizarIcono()}
          </span>
        )}
      </button>
    );
  }
);

Boton.displayName = 'Boton';

export default Boton;