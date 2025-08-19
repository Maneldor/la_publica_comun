'use client';

import React, { useState } from 'react';
import { ReaccionMensaje } from '../../../../tipos/redSocial';
import { Smile, Plus } from 'lucide-react';

interface PropiedadesReaccionesMensaje {
  reacciones: ReaccionMensaje[];
  usuarioId: string;
  messageId: string;
  onAgregarReaccion: (emoji: string) => void;
  onEliminarReaccion: () => void;
}

const EMOJIS_COMUNES = ['👍', '❤️', '😂', '😮', '😢', '😠', '🎉', '👏', '🔥', '💯'];

const ReaccionesMensaje: React.FC<PropiedadesReaccionesMensaje> = ({
  reacciones,
  usuarioId,
  messageId,
  onAgregarReaccion,
  onEliminarReaccion,
}) => {
  const [mostrarSelectorEmojis, setMostrarSelectorEmojis] = useState(false);

  // Agrupar reacciones por emoji
  const reaccionesAgrupadas = reacciones.reduce((acc, reaccion) => {
    const emoji = reaccion.emoji;
    if (!acc[emoji]) {
      acc[emoji] = {
        emoji,
        count: 0,
        users: [],
        hasUserReaction: false
      };
    }
    acc[emoji].count++;
    acc[emoji].users.push(reaccion.user?.nombre || 'Usuario');
    if (reaccion.userId === usuarioId) {
      acc[emoji].hasUserReaction = true;
    }
    return acc;
  }, {} as Record<string, { emoji: string; count: number; users: string[]; hasUserReaction: boolean }>);

  const reaccionesArray = Object.values(reaccionesAgrupadas);
  const usuarioTieneReaccion = reacciones.some(r => r.userId === usuarioId);

  const manejarClickReaccion = (emoji: string, tieneReaccion: boolean) => {
    if (tieneReaccion) {
      onEliminarReaccion();
    } else {
      onAgregarReaccion(emoji);
    }
  };

  const manejarAgregarEmoji = (emoji: string) => {
    onAgregarReaccion(emoji);
    setMostrarSelectorEmojis(false);
  };

  return (
    <div className="flex items-center space-x-1 mt-1">
      {/* Reacciones existentes */}
      {reaccionesArray.map((reaccion) => (
        <button
          key={reaccion.emoji}
          onClick={() => manejarClickReaccion(reaccion.emoji, reaccion.hasUserReaction)}
          className={`
            flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors
            ${reaccion.hasUserReaction
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
          title={`${reaccion.users.join(', ')} reaccionó con ${reaccion.emoji}`}
        >
          <span>{reaccion.emoji}</span>
          <span className="font-medium">{reaccion.count}</span>
        </button>
      ))}

      {/* Botón para agregar reacción */}
      <div className="relative">
        <button
          onClick={() => setMostrarSelectorEmojis(!mostrarSelectorEmojis)}
          className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
          title="Agregar reacción"
        >
          <Plus size={12} />
        </button>

        {/* Selector de emojis */}
        {mostrarSelectorEmojis && (
          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
            <div className="grid grid-cols-5 gap-1">
              {EMOJIS_COMUNES.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => manejarAgregarEmoji(emoji)}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-lg"
                  title={`Reaccionar con ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Overlay para cerrar selector */}
      {mostrarSelectorEmojis && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMostrarSelectorEmojis(false)}
        />
      )}
    </div>
  );
};

export default ReaccionesMensaje;