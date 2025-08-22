import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle,
  Calendar,
  MessageCircle,
  Video,
  DollarSign,
  Gift
} from 'lucide-react';
import { useTraduccio } from '../../contextos/TraduccioContext';
import { ServeiAsesorament, ModalitatiAsesorament } from '../../../tipos/asesorament';
import { useState, useEffect } from 'react';

interface TarjetaServeiProps {
  servei: ServeiAsesorament;
  onSolicitar: (serveiId: string) => void;
  translations: any;
}

const iconosModalitat = {
  TELEFONIC: Phone,
  PRESENCIAL: MapPin,
  EMAIL: Mail,
  VIDEOCONFERENCIA: Video,
  CHAT: MessageCircle
};

export default function TarjetaServei({ servei, onSolicitar, translations: tLegacy }: TarjetaServeiProps) {
  const { t, tDynamic } = useTraduccio();
  
  // Estado para contenido dinámico traducido
  const [tituloTraducido, setTituloTraducido] = useState({ texto: servei.titol.texto, cargando: false });
  const [descripcionTraducida, setDescripcionTraducida] = useState({ texto: servei.descripcio.texto, cargando: false });
  
  // Efectos para traducir contenido dinámico
  useEffect(() => {
    const traducirTitulo = async () => {
      setTituloTraducido({ texto: servei.titol.texto, cargando: true });
      try {
        const textoTraducido = await tDynamic({
          texto: servei.titol.texto,
          idiomaOriginal: servei.titol.idiomaOriginal,
          tipo: 'institucional'
        });
        setTituloTraducido({ texto: textoTraducido, cargando: false });
      } catch (error) {
        setTituloTraducido({ texto: servei.titol.texto, cargando: false });
      }
    };
    traducirTitulo();
  }, [servei.titol.texto, servei.titol.idiomaOriginal, tDynamic]);
  
  useEffect(() => {
    const traducirDescripcion = async () => {
      setDescripcionTraducida({ texto: servei.descripcio.texto, cargando: true });
      try {
        const textoTraducido = await tDynamic({
          texto: servei.descripcio.texto,
          idiomaOriginal: servei.descripcio.idiomaOriginal,
          tipo: 'institucional'
        });
        setDescripcionTraducida({ texto: textoTraducido, cargando: false });
      } catch (error) {
        setDescripcionTraducida({ texto: servei.descripcio.texto, cargando: false });
      }
    };
    traducirDescripcion();
  }, [servei.descripcio.texto, servei.descripcio.idiomaOriginal, tDynamic]);

  const handleVerDetalle = () => {
    window.location.href = `/assessorament/${servei.id}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      {/* Imagen/Logo de la empresa */}
      <div className="h-48 bg-gray-100 relative">
        {servei.empresa.logo ? (
          <img 
            src={servei.empresa.logo} 
            alt={servei.empresa.nom}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">⚖️</span>
          </div>
        )}
        
        {/* Badge de tipo */}
        <div className="absolute top-2 left-2">
          <span className="inline-block px-2 py-1 rounded text-xs font-medium text-white bg-blue-600">
            {tLegacy.tipusAssessorament?.[servei.tipus] || servei.tipus}
          </span>
        </div>
        
        {/* Badge gratuito */}
        {servei.primeraConsultaGratuita && (
          <div className="absolute top-2 right-2">
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <Gift className="h-3 w-3 mr-1" />
              Gratuït
            </div>
          </div>
        )}
      </div>
      
      {/* Contenido */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {tituloTraducido.cargando ? (
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              tituloTraducido.texto
            )}
          </h3>
        </div>
        
        {/* Empresa */}
        <p className="text-sm text-gray-600 mb-2 font-medium">{servei.empresa.nom}</p>
        
        {/* Descripción corta */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {descripcionTraducida.cargando ? (
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            descripcionTraducida.texto
          )}
        </p>
        
        {/* Ubicación */}
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <MapPin size={12} className="mr-1" />
          {servei.empresa.ubicacio.ciutat}, {servei.empresa.ubicacio.provincia}
        </div>
        
        {/* Puntuación y modalidades */}
        <div className="flex items-center justify-between mb-4">
          {servei.puntuacioMitjana && (
            <div className="flex items-center">
              <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
              <span className="text-xs font-medium text-gray-900">{servei.puntuacioMitjana}</span>
              <span className="text-xs text-gray-500 ml-1">({servei.totalRessenyes})</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            {servei.modalitats.slice(0, 2).map(modalitat => {
              const Icon = iconosModalitat[modalitat];
              return <Icon key={modalitat} size={12} className="text-blue-600" />;
            })}
            {servei.modalitats.length > 2 && (
              <span className="text-xs text-gray-500">+{servei.modalitats.length - 2}</span>
            )}
          </div>
        </div>
        
        {/* Verificación */}
        {servei.empresa.verificada && (
          <div className="flex items-center text-green-600 text-xs mb-3">
            <CheckCircle className="h-3 w-3 mr-1" />
            Empresa verificada
          </div>
        )}
        
        {/* Botones */}
        <div className="flex space-x-2">
          <button
            onClick={handleVerDetalle}
            className="flex-1 px-3 py-2 border border-gray-300 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors"
          >
            Veure detall
          </button>
          <button
            onClick={() => onSolicitar(servei.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          >
            Sol·licitar
          </button>
        </div>
      </div>
    </div>
  );
}