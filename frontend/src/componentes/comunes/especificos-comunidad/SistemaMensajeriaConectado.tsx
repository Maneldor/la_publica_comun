'use client';

import React from 'react';
import SistemaMensajeriaSimple from './SistemaMensajeriaSimple';

// Re-exportar el componente simple (sin llamadas por ahora) como el componente conectado principal
const SistemaMensajeriaConectado: React.FC = () => {
  return <SistemaMensajeriaSimple />;
};

export default SistemaMensajeriaConectado;