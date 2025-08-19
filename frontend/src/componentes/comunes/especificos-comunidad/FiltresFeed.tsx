'use client'

interface FiltresFeedProps {
  filtreActiu: 'tots' | 'nous'
  onCanviarFiltre: (filtre: 'tots' | 'nous') => void
}

export default function FiltresFeed({ filtreActiu, onCanviarFiltre }: FiltresFeedProps) {
  return (
    <div className="flex space-x-1 mb-4 md:mb-6">
      <button 
        onClick={() => onCanviarFiltre('tots')}
        className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-lg transition-colors ${
          filtreActiu === 'tots' 
            ? 'bg-gray-900 text-white' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Mostrar tot
      </button>
      
      <span className="text-gray-400 self-center">-</span>
      
      <button 
        onClick={() => onCanviarFiltre('nous')}
        className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-lg transition-colors ${
          filtreActiu === 'nous' 
            ? 'bg-gray-900 text-white' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        per nous posts
      </button>
    </div>
  )
}