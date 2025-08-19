'use client';

import React from 'react';
import { ArchivoAdjunto } from '../../../../tipos/redSocial';
import { Download, File, Image as ImageIcon, FileText, FileSpreadsheet, FileImage } from 'lucide-react';

interface PropiedadesArchivoAdjunto {
  archivo: ArchivoAdjunto;
  API_BASE_URL?: string;
}

const ArchivoAdjuntoComponente: React.FC<PropiedadesArchivoAdjunto> = ({ 
  archivo, 
  API_BASE_URL = 'http://localhost:3001' 
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) {
      return <FileImage size={20} className="text-green-600" />;
    } else if (mimetype === 'application/pdf') {
      return <FileText size={20} className="text-red-600" />;
    } else if (mimetype.includes('spreadsheet') || mimetype.includes('excel')) {
      return <FileSpreadsheet size={20} className="text-green-600" />;
    } else if (mimetype.includes('document') || mimetype.includes('word')) {
      return <FileText size={20} className="text-blue-600" />;
    } else {
      return <File size={20} className="text-gray-600" />;
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `${API_BASE_URL}${archivo.url}`;
    link.download = archivo.originalName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (archivo.isImage) {
    // Para imágenes, mostrar preview
    return (
      <div className="relative group max-w-sm">
        <img
          src={`${API_BASE_URL}${archivo.url}`}
          alt={archivo.originalName}
          className="rounded-lg shadow-md max-h-64 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleDownload}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={handleDownload}
            className="bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white transition-colors"
            title="Descargar imagen"
          >
            <Download size={20} />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <span className="font-medium">{archivo.originalName}</span>
          <span className="ml-2">({formatFileSize(archivo.size)})</span>
        </div>
      </div>
    );
  }

  // Para otros archivos, mostrar como tarjeta
  return (
    <div 
      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 max-w-sm hover:bg-gray-100 transition-colors cursor-pointer"
      onClick={handleDownload}
    >
      <div className="flex-shrink-0">
        {getFileIcon(archivo.mimetype)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {archivo.originalName}
        </div>
        <div className="text-xs text-gray-500">
          {formatFileSize(archivo.size)}
        </div>
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDownload();
        }}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        title="Descargar archivo"
      >
        <Download size={16} />
      </button>
    </div>
  );
};

export default ArchivoAdjuntoComponente;