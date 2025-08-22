import React from 'react';
import { 
  ExternalLink,
  Phone, 
  Mail, 
  MapPin, 
  Eye,
  MousePointer,
  Award
} from 'lucide-react';
import { useTraduccio } from '../../contextos/TraduccioContext';
import { InstitucioEnllac, TIPUS_INSTITUCIONS_METADATA } from '../../../tipos/enllcos';
import { useComunidad } from '../../../hooks/useComunidad';
import { useState, useEffect } from 'react';

interface TarjetaInstitucioProps {
  institucio: InstitucioEnllac;
  onVisitarWeb: (institucio: InstitucioEnllac) => void;
  translations: any;
}

export default function TarjetaInstitucio({ institucio, onVisitarWeb, translations: tLegacy }: TarjetaInstitucioProps) {
  const { idioma } = useComunidad();
  const { t, tDynamic } = useTraduccio();
  
  // Estado para contenido dinámico traducido
  const [nomTraducit, setNomTraducit] = useState({ texto: institucio.nom.texto, cargando: false });
  const [descripcionTraducida, setDescripcionTraducida] = useState({ texto: institucio.descripcio.texto, cargando: false });
  
  // Efectos para traducir contenido dinámico
  useEffect(() => {
    const traducirNom = async () => {
      setNomTraducit({ texto: institucio.nom.texto, cargando: true });
      try {
        const textoTraducido = await tDynamic({
          texto: institucio.nom.texto,
          idiomaOriginal: institucio.nom.idiomaOriginal,
          tipo: 'institucional'
        });
        setNomTraducit({ texto: textoTraducido, cargando: false });
      } catch (error) {
        setNomTraducit({ texto: institucio.nom.texto, cargando: false });
      }
    };
    traducirNom();
  }, [institucio.nom.texto, institucio.nom.idiomaOriginal, tDynamic]);
  
  useEffect(() => {
    const traducirDescripcion = async () => {
      setDescripcionTraducida({ texto: institucio.descripcio.texto, cargando: true });
      try {
        const textoTraducido = await tDynamic({
          texto: institucio.descripcio.texto,
          idiomaOriginal: institucio.descripcio.idiomaOriginal,
          tipo: 'institucional'
        });
        setDescripcionTraducida({ texto: textoTraducido, cargando: false });
      } catch (error) {
        setDescripcionTraducida({ texto: institucio.descripcio.texto, cargando: false });
      }
    };
    traducirDescripcion();
  }, [institucio.descripcio.texto, institucio.descripcio.idiomaOriginal, tDynamic]);
  const tipusMetadata = TIPUS_INSTITUCIONS_METADATA[institucio.tipus];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header con logo */}
      <div className="h-32 bg-gray-100 relative">
        {institucio.logo ? (
          <img 
            src={institucio.logo} 
            alt={nomTraducit.texto || institucio.nom.texto}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-4xl">{tipusMetadata.icona}</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2">
          <span 
            className="inline-block px-2 py-1 rounded text-xs font-medium text-white"
            style={{ backgroundColor: tipusMetadata.color }}
          >
            {(tipusMetadata.nom.traducciones as any)?.[idioma] || tipusMetadata.nom.texto}
          </span>
        </div>
        
        {institucio.verificat && (
          <div className="absolute top-2 right-2">
            <div className="bg-green-500 text-white p-1 rounded-full">
              <Award className="h-3 w-3" />
            </div>
          </div>
        )}

        {institucio.destacat && (
          <div className="absolute bottom-2 right-2">
            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Destacat
            </div>
          </div>
        )}
      </div>
      
      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
          {nomTraducit.cargando ? (
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            nomTraducit.texto
          )}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {descripcionTraducida.cargando ? (
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            descripcionTraducida.texto
          )}
        </p>
        
        {/* Información de contacto */}
        <div className="space-y-1 mb-4">
          {institucio.contacte.telefon && (
            <div className="flex items-center text-xs text-gray-500">
              <Phone size={12} className="mr-2" />
              {institucio.contacte.telefon}
            </div>
          )}
          {institucio.contacte.email && (
            <div className="flex items-center text-xs text-gray-500">
              <Mail size={12} className="mr-2" />
              {institucio.contacte.email}
            </div>
          )}
          {institucio.contacte.ciutat && (
            <div className="flex items-center text-xs text-gray-500">
              <MapPin size={12} className="mr-2" />
              {institucio.contacte.ciutat}, {institucio.contacte.provincia}
            </div>
          )}
        </div>
        
        {/* Estadísticas */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
          <div className="flex items-center">
            <Eye size={12} className="mr-1" />
            {institucio.visites}
          </div>
          <div className="flex items-center">
            <MousePointer size={12} className="mr-1" />
            {institucio.clics}
          </div>
          <span>{tLegacy.ambits[institucio.ambit]}</span>
        </div>
        
        {/* Botón visitar web */}
        <button
          onClick={() => onVisitarWeb(institucio)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          {tLegacy.visitarWeb}
        </button>
      </div>
    </div>
  );
}