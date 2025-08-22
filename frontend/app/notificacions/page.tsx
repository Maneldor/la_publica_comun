'use client'

import LayoutGeneral from '../../src/componentes/comunes/LayoutGeneral'
import ModalNotificacionsGlobal from '../../src/componentes/comunes/especificos-comunidad/ModalNotificacionsGlobal'

export default function NotificacionsPage() {
  return (
    <LayoutGeneral paginaActual="notificacions">
      {/* El modal se abre automáticamente en esta página */}
      <ModalNotificacionsGlobal
        isOpen={true}
        onClose={() => {
          // Cuando se cierra el modal, volver a Xarxa Social
          window.location.href = '/xarxa-social'
        }}
      />

      {/* Contenido de respaldo si no se carga el modal */}
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white">🔔</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Notificacions</h2>
          <p className="text-gray-600">
            Carregant les teves notificacions...
          </p>
        </div>
      </div>
    </LayoutGeneral>
  )
}