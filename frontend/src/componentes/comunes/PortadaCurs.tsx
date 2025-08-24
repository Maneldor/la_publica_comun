'use client'

import { CategoriaFormacio } from '../../tipos/formacion'

interface PortadaCursProps {
  categoria: CategoriaFormacio
  className?: string
  children?: React.ReactNode
  overlay?: boolean
  size?: 'small' | 'medium' | 'large' | 'hero'
}

export default function PortadaCurs({ 
  categoria, 
  className = '', 
  children, 
  overlay = true,
  size = 'medium' 
}: PortadaCursProps) {
  
  // URLs de imágenes reutilizables por categoría de Unsplash
  const getPortadaUrl = (categoria: CategoriaFormacio, size: string): string => {
    const dimensions = {
      small: 'w=400&h=200',
      medium: 'w=800&h=400', 
      large: 'w=1200&h=600',
      hero: 'w=1600&h=800'
    }

    const dim = dimensions[size as keyof typeof dimensions] || dimensions.medium

    const portades = {
      'DIGITAL': `https://images.unsplash.com/photo-1451187580459-43490279c0fa?${dim}&fit=crop&q=80`,
      'TECNOLOGIA': `https://images.unsplash.com/photo-1518770660439-4636190af475?${dim}&fit=crop&q=80`,
      'ADMINISTRACIO': `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?${dim}&fit=crop&q=80`,
      'GESTIO': `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?${dim}&fit=crop&q=80`,
      'JURIDIC': `https://images.unsplash.com/photo-1589829545856-d10d557cf95f?${dim}&fit=crop&q=80`,
      'FINANCES': `https://images.unsplash.com/photo-1554224155-6726b3ff858f?${dim}&fit=crop&q=80`,
      'COMUNICACIO': `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?${dim}&fit=crop&q=80`,
      'LIDERATGE': `https://images.unsplash.com/photo-1521737711867-e3b97375f902?${dim}&fit=crop&q=80`,
      'SOSTENIBILITAT': `https://images.unsplash.com/photo-1569163690920-29b4fd0c4e9c?${dim}&fit=crop&q=80`,
      'IDIOMES': `https://images.unsplash.com/photo-1434030216411-0b793f4b4173?${dim}&fit=crop&q=80`
    }

    return portades[categoria] || portades['ADMINISTRACIO']
  }

  const sizeClasses = {
    small: 'h-full',
    medium: 'h-48 md:h-56',
    large: 'h-56 md:h-64',
    hero: 'h-64 md:h-80'
  }

  const overlayClasses = overlay 
    ? 'bg-gradient-to-t from-black/60 via-black/20 to-transparent' 
    : ''

  return (
    <div 
      className={`relative ${sizeClasses[size]} bg-cover bg-center bg-gray-800 ${className}`}
      style={{
        backgroundImage: `url('${getPortadaUrl(categoria, size)}')`
      }}
    >
      {overlay && (
        <div className={`absolute inset-0 ${overlayClasses}`} />
      )}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

// Componente específico para tarjetas de curso
export function PortadaCursTarjeta({ categoria, className = '' }: { categoria: CategoriaFormacio, className?: string }) {
  return (
    <PortadaCurs 
      categoria={categoria} 
      size="small" 
      className={`rounded-t-lg w-full h-full object-cover ${className}`}
      overlay={true}
    />
  )
}

// Componente específico para headers de páginas de curso
export function PortadaCursHero({ 
  categoria, 
  children, 
  className = '' 
}: { 
  categoria: CategoriaFormacio
  children?: React.ReactNode
  className?: string 
}) {
  return (
    <PortadaCurs 
      categoria={categoria} 
      size="hero" 
      className={className}
      overlay={true}
    >
      {children}
    </PortadaCurs>
  )
}