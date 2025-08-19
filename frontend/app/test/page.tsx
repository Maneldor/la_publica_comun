'use client'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test - Sistema de Missatges</h1>
        
        <div className="grid gap-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Pàgines Disponibles:</h2>
            <div className="space-y-2">
              <a href="/dashboard" className="block text-blue-600 hover:underline">
                /dashboard - Dashboard principal
              </a>
              <a href="/miembros" className="block text-blue-600 hover:underline">
                /miembros - Directori de membres
              </a>
              <a href="/grupos" className="block text-blue-600 hover:underline">
                /grupos - Gestió de grups
              </a>
              <a href="/perfil" className="block text-blue-600 hover:underline">
                /perfil - Perfil d'usuari
              </a>
              <a href="/auth" className="block text-blue-600 hover:underline">
                /auth - Autenticació
              </a>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Sistema de Missatges:</h2>
            <div className="space-y-2">
              <p><strong>✅ Context de Notificacions:</strong> Implementat</p>
              <p><strong>✅ Context de Missatges:</strong> Implementat</p>
              <p><strong>✅ Component TarjetaMiembro:</strong> Unificat</p>
              <p><strong>✅ Connexions Mock:</strong> user-2 i user-4 connectats</p>
              <p><strong>✅ Interfície de Xat:</strong> Implementada</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Connexions Configurades:</h2>
            <div className="space-y-2">
              <p><strong>user-2 (Laura García):</strong> 🟢 Connectada - Hauria de mostrar botó "Missatge"</p>
              <p><strong>user-4 (Ana Ruiz):</strong> 🟢 Connectada - Hauria de mostrar botó "Missatge"</p>
              <p><strong>user-3 (Joan Martí):</strong> 🟡 Sol·licitud pendent</p>
              <p><strong>Altres:</strong> ⚪ Botó "Connectar"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}