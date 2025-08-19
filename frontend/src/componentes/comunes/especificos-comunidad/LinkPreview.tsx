'use client';

import React from 'react';
import { ExternalLink, Globe, Image } from 'lucide-react';
import './LinkPreview.css';

interface LinkPreviewData {
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
  favicon: string;
  error?: string;
}

interface PropiedadesLinkPreview {
  previews: LinkPreviewData[];
  className?: string;
}

const LinkPreview: React.FC<PropiedadesLinkPreview> = ({ previews, className = '' }) => {
  if (!previews || previews.length === 0) {
    return null;
  }

  const handleClickPreview = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {previews.map((preview, index) => (
        <div
          key={index}
          onClick={() => handleClickPreview(preview.url)}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200 max-w-md"
        >
          {/* Imagen de preview si existe */}
          {preview.image && !preview.error && (
            <div className="relative w-full h-48 bg-gray-100">
              <img
                src={preview.image}
                alt={preview.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Ocultar imagen si falla la carga
                  const target = e.target as HTMLElement;
                  if (target.parentElement) {
                    target.parentElement.style.display = 'none';
                  }
                }}
              />
            </div>
          )}

          {/* Contenido del preview */}
          <div className="p-4">
            {/* Encabezado con favicon y siteName */}
            <div className="flex items-center space-x-2 mb-2">
              {preview.favicon && !preview.error ? (
                <img
                  src={preview.favicon}
                  alt="favicon"
                  className="w-4 h-4 rounded"
                  onError={(e) => {
                    // Reemplazar con icono genérico si falla
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const icon = target.nextElementSibling as HTMLElement;
                    if (icon) icon.style.display = 'block';
                  }}
                />
              ) : null}
              <Globe className="w-4 h-4 text-gray-400 hidden" />
              
              <span className="text-sm text-gray-500 truncate">
                {preview.siteName || new URL(preview.url).hostname}
              </span>
              
              <ExternalLink className="w-3 h-3 text-gray-400 ml-auto" />
            </div>

            {/* Título */}
            <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
              {preview.title}
            </h3>

            {/* Descripción */}
            {preview.description && (
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {preview.description}
              </p>
            )}

            {/* URL */}
            <p className="text-xs text-blue-600 truncate font-mono">
              {preview.url}
            </p>

            {/* Mensaje de error si existe */}
            {preview.error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-xs text-red-600">
                    No se pudo cargar el preview
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinkPreview;