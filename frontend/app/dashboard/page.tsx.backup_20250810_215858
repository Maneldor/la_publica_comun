'use client'
// import { DashboardPrincipal } from '../../src/componentes/comunes/especificos-comunidad/DashboardPrincipal'
// import { SistemaMensajeriaConectado } from '../../src/componentes/comunes/especificos-comunidad/SistemaMensajeria'

function DashboardContent() {
  // Datos de ejemplo para el dashboard
  const usuarioEjemplo = {
    id: '1',
    nombre: 'Usuario',
    apellidos: 'Ejemplo',
    email: 'usuario@lapublica.es',
    tipo: 'miembro' as const,
    fechaRegistro: new Date(),
    perfil: {
      cargo: 'Funcionario Público',
      ubicacion: 'Madrid, España'
    },
    estadisticas: {
      conexiones: 247,
      postsCreados: 12
    }
  };

  const postsEjemplo = [
    {
      id: '1',
      autorId: '1',
      contenido: '¡Bienvenido al dashboard principal de La Pública! 🎉',
      fechaCreacion: new Date(),
      privacidad: 'publico' as const,
      estadisticas: {
        likes: 5,
        comentarios: 2,
        compartidos: 1
      },
      tags: ['bienvenida']
    }
  ];

  const gruposEjemplo = [
    {
      id: '1',
      nombre: 'Oposiciones 2024',
      descripcion: 'Grupo de estudio para oposiciones',
      fechaCreacion: new Date(),
      estadisticas: {
        totalMiembros: 150
      }
    }
  ];

  const eventosEjemplo = [
    {
      id: '1',
      titulo: 'Webinar: Empleo Público',
      fechaInicio: new Date(),
      ubicacion: 'Online'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Principal - La Pública</h1>
        
        {/* Dashboard de 3 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Columna izquierda - Perfil */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Usuario Ejemplo</h3>
                  <p className="text-sm text-gray-600">Funcionario Público</p>
                  <p className="text-xs text-gray-500">Madrid, España</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">247</p>
                    <p className="text-xs text-gray-500">Conexiones</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">12</p>
                    <p className="text-xs text-gray-500">Posts</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Acceso rápido */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Acceso Rápido</h3>
              <div className="space-y-3">
                <button className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-50 rounded-lg">
                  <span className="text-blue-600">💬</span>
                  <span className="text-sm text-gray-700">Mensajes</span>
                </button>
                <button className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-50 rounded-lg">
                  <span className="text-orange-600">🔔</span>
                  <span className="text-sm text-gray-700">Notificaciones</span>
                </button>
                <button className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-50 rounded-lg">
                  <span className="text-green-600">👥</span>
                  <span className="text-sm text-gray-700">Mis Grupos</span>
                </button>
                <button className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-50 rounded-lg">
                  <span className="text-purple-600">📅</span>
                  <span className="text-sm text-gray-700">Eventos</span>
                </button>
              </div>
            </div>
          </div>

          {/* Columna central - Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Feed de La Pública</h2>
              <button className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-500">
                ¿Qué quieres compartir con la comunidad?
              </button>
            </div>
            
            {/* Post de ejemplo */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">LG</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Laura García</h3>
                      <p className="text-sm text-gray-500">Empleada Pública - Ajuntament de Barcelona</p>
                      <p className="text-xs text-gray-400">Hace 2 horas</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-gray-800">¡Bienvenido al dashboard principal de La Pública! 🎉</p>
                    <div className="mt-3 bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">#LaPública #DashboardPrincipal</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                      <span>👍</span>
                      <span className="text-sm">Me gusta (5)</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                      <span>💬</span>
                      <span className="text-sm">Comentar (2)</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                      <span>↗️</span>
                      <span className="text-sm">Compartir</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Grupos y Eventos */}
          <div className="lg:col-span-1">
            {/* Grupos sugeridos */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Grupos Sugeridos</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600">👥</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Oposiciones 2024</p>
                      <p className="text-xs text-gray-500">150 miembros</p>
                    </div>
                  </div>
                  <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700">
                    Unirse
                  </button>
                </div>
              </div>
            </div>

            {/* Próximos eventos */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Próximos Eventos</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900">Webinar: Empleo Público</h4>
                  <p className="text-xs text-gray-500">Mañana</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botón flotante de mensajería */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
          💬
        </button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return <DashboardContent />
}