'use client'

export default function FeedSocial() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo y búsqueda */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold bg-blue-500">
                  LP
                </div>
                <div>
                  <div className="font-semibold text-gray-900">La pública</div>
                  <div className="text-xs text-gray-500">Comunitat Social</div>
                </div>
              </div>
              
              <div className="relative ml-8">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar membres, grups, activitats..."
                  className="w-80 pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Acciones del header */}
            <div className="flex items-center space-x-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors">
                <span>+</span>
                <span>Crear Post</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    🔔
                  </button>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                </div>
                
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    💬
                  </button>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">7</span>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    MA
                  </div>
                  <span className="text-sm font-medium">MA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Layout principal de 4 columnas */}
      <div className="max-w-8xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-4">
          
          {/* COLUMNA 1 - Menú lateral completo */}
          <div className="col-span-2">
            <div className="sticky top-24 space-y-6">
              
              {/* Menú lateral principal */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4">
                  
                  {/* NAVEGACIÓ PRINCIPAL */}
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">NAVEGACIÓ PRINCIPAL</h3>
                    <nav className="space-y-1">
                      <a href="#" className="flex items-center space-x-3 px-3 py-2 text-white bg-blue-500 rounded-lg transition-colors">
                        <span className="text-white">🏠</span>
                        <span className="text-sm font-medium">Tauler</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-gray-600">👤</span>
                        <span className="text-sm">El Meu Perfil</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-gray-600">👥</span>
                        <span className="text-sm">Membres</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-gray-600">👥</span>
                        <span className="text-sm">Grups</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-gray-600">💬</span>
                        <span className="text-sm">Missatges</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-gray-600">💬</span>
                        <span className="text-sm">Fòrums</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-gray-600">📝</span>
                        <span className="text-sm">Blogs</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-gray-600">📄</span>
                        <span className="text-sm">Anuncis</span>
                      </a>
                    </nav>
                  </div>

                  {/* EMPRESES I NEGOCIS */}
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">EMPRESES I NEGOCIS</h3>
                    <nav className="space-y-1">
                      <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-gray-600">🏢</span>
                        <span className="text-sm">Empreses i Col·laboradors</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-gray-600">💼</span>
                        <span className="text-sm">Ofertes</span>
                      </a>
                    </nav>
                  </div>

                  {/* Perfil usuario */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        MA
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Manel Amador</div>
                        <div className="text-xs text-gray-500">plegats.cat@gmail.com</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 2 - Widgets Seguint/Grups */}
          <div className="col-span-2">
            <div className="sticky top-24 space-y-6">
              
              {/* Seguint section */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-green-600">👥</span>
                    <h3 className="font-semibold text-gray-900">Seguint</h3>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex space-x-1 mb-4">
                    <button className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      ACTIUS
                    </button>
                    <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900">
                      RECENTS
                    </button>
                  </div>
                </div>
                
                <div className="p-3">
                  {/* Usuario Roberto */}
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      RJ
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Roberto Jiménez</div>
                      <div className="text-xs text-gray-500">@roberto_marketing</div>
                    </div>
                  </div>
                  
                  {/* Usuario Carmen */}
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      CR
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Carmen Ruiz</div>
                      <div className="text-xs text-gray-500">@carmen_designer</div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-3 pt-3 border-t border-gray-100">
                    <button className="text-xs text-gray-600 hover:underline">VEURE TOT</button>
                  </div>
                </div>
              </div>

              {/* Grups section */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-blue-600">👥</span>
                    <h3 className="font-semibold text-gray-900">Grups</h3>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex space-x-1 mb-4">
                    <button className="px-3 py-1 text-xs font-medium text-gray-600">
                      NOUS
                    </button>
                    <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      ACTIUS
                    </button>
                  </div>
                </div>
                
                <div className="p-3">
                  {/* Grupo Sevilla */}
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-orange-300">
                      <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
                        SG
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Sevilla Gastronomí...</div>
                      <div className="text-xs text-gray-500">1 membres</div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-3 pt-3 border-t border-gray-100">
                    <button className="text-xs text-gray-600 hover:underline">VEURE TOT</button>
                  </div>
                </div>
              </div>

              {/* Anuncis section */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs">📄</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">Anuncis</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 3 - Feed Central */}
          <div className="col-span-6">
            <div className="space-y-6">
              
              {/* Header de Activitat */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <h1 className="text-xl font-semibold text-gray-900 mb-4">Activitat</h1>
                  
                  {/* Filtros */}
                  <div className="flex space-x-1 mb-6">
                    <button className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white">
                      Mostrar todo
                    </button>
                    <span className="text-gray-400 self-center">-</span>
                    <button className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                      por nuevos posts
                    </button>
                  </div>

                  {/* Input para crear post */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      MA
                    </div>
                    <input
                      type="text"
                      placeholder="Què estàs pensant, Manel?"
                      className="flex-1 p-3 bg-gray-100 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Posts */}
              <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-4">
                  {/* Header del post */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        GE
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Gestor Empresa</div>
                        <div className="text-sm text-gray-500">5 ago 2025</div>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <span className="text-gray-400">⋯</span>
                    </button>
                  </div>

                  {/* Contenido */}
                  <div className="mb-3">
                    <p className="text-gray-900">Haciendo pruebas con archivos</p>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <span>❤️</span>
                      <span className="text-sm">Me gusta</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <span>💬</span>
                      <span className="text-sm">Comentar</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <span>↗️</span>
                      <span className="text-sm">Compartir</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Segundo post */}
              <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        GE
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Gestor Empresa</div>
                        <div className="text-sm text-gray-500">5 ago 2025</div>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <span className="text-gray-400">⋯</span>
                    </button>
                  </div>

                  <div className="mb-3">
                    <p className="text-gray-900">Haciendo pruebas😊</p>
                    <div className="mt-3">
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">Imagen del post</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <span>❤️</span>
                      <span className="text-sm">Me gusta</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <span>💬</span>
                      <span className="text-sm">Comentar</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <span>↗️</span>
                      <span className="text-sm">Compartir</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tercer post con más interacción */}
              <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        MR
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">María Rodríguez</div>
                        <div className="text-sm text-gray-500">4 ago 2025</div>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <span className="text-gray-400">⋯</span>
                    </button>
                  </div>

                  <div className="mb-3">
                    <p className="text-gray-900">¡Excelente jornada de formación sobre administración digital! Gracias a todos los compañeros que participaron. 💪</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span>❤️ 12 me gusta</span>
                    <span>💬 5 comentarios</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <span>❤️</span>
                      <span className="text-sm">Me gusta</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <span>💬</span>
                      <span className="text-sm">Comentar</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <span>↗️</span>
                      <span className="text-sm">Compartir</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 4 - Widgets Perfil/Empreses */}
          <div className="col-span-2">
            <div className="sticky top-24 space-y-6">
              
              {/* Completar perfil */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Completa el teu Perfil</h3>
                
                {/* Progreso circular */}
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-green-500"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="20, 100"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold text-green-600">20%</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <button className="text-sm font-medium text-blue-600 hover:underline">
                    Completar Perfil
                  </button>
                </div>

                {/* Lista de tareas */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-green-600">Informació general</span>
                    </div>
                    <span className="text-green-600 font-medium">5/6</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      <span className="text-gray-600">Experiència laboral</span>
                    </div>
                    <span className="text-gray-500 font-medium">0/3</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      <span className="text-gray-600">Foto de perfil</span>
                    </div>
                    <span className="text-gray-500 font-medium">0/1</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      <span className="text-gray-600">Foto de portada</span>
                    </div>
                    <span className="text-gray-500 font-medium">0/1</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      <span className="text-gray-600">Xarxes socials</span>
                    </div>
                    <span className="text-gray-500 font-medium">0/1</span>
                  </div>
                </div>
              </div>

              {/* Widget de Empresas */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Empreses</h3>
                  <button className="text-sm text-blue-600 hover:underline">Ver totes</button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                      8
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Consultoria Empr...</div>
                      <div className="text-xs text-gray-500">
                        15 empleats • Sevilla
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                      9
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Marketing Digital ...</div>
                      <div className="text-xs text-gray-500">
                        25 empleats • Barcelona
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                      8
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">TechSolutions S.A.</div>
                      <div className="text-xs text-gray-500">
                        75 empleats • Madrid
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Widget de Sugerencias */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Persones que potser coneixes</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      AV
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Ana Vega</div>
                      <div className="text-xs text-gray-500">Funcionaria de Hacienda</div>
                    </div>
                    <button className="text-xs text-blue-600 hover:underline">Seguir</button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      JM
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">José Martín</div>
                      <div className="text-xs text-gray-500">Técnico de Sistemas</div>
                    </div>
                    <button className="text-xs text-blue-600 hover:underline">Seguir</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}