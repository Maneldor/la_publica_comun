'use client'

import { ChevronUp, ChevronDown } from 'lucide-react'

interface MonitorizacionProps {
  expandedSections: { [key: string]: boolean }
  toggleSectionExpansion: (section: string) => void
}

export default function Monitorizacion({
  expandedSections,
  toggleSectionExpansion
}: MonitorizacionProps) {
  return (
    <div className="space-y-6">
      {/* Gràfics d'evolució temporal */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">CPU Evolution</h3>
            <div className="flex items-center gap-2">
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>Última hora</option>
                <option>Últimes 24h</option>
                <option>Última setmana</option>
                <option>Últim mes</option>
              </select>
              <button
                onClick={() => toggleSectionExpansion('cpu-evolution')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {expandedSections['cpu-evolution'] ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>
          <div className="h-32 bg-gray-50 rounded flex items-center justify-center mb-4">
            <div className="text-xs text-gray-500">📈 Gràfic CPU: 32% actual vs 28% mes anterior (+14%)</div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Promig mensual</span>
            <span className="font-medium text-blue-600">28.4%</span>
          </div>
          {expandedSections['cpu-evolution'] && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">Pic màxim</h5>
                  <div className="text-2xl font-bold text-blue-700">87%</div>
                  <div className="text-sm text-blue-600">Avui 14:23</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-900 mb-2">Mínim del dia</h5>
                  <div className="text-2xl font-bold text-green-700">18%</div>
                  <div className="text-sm text-green-600">Avui 06:15</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Memory Usage</h3>
            <div className="flex items-center gap-2">
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>Última hora</option>
                <option>Últimes 24h</option>
                <option>Última setmana</option>
              </select>
            </div>
          </div>
          <div className="h-32 bg-gray-50 rounded flex items-center justify-center mb-4">
            <div className="text-xs text-gray-500">📊 Memòria: 64% utilitzada (16GB/25GB disponibles)</div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Promig setmana</span>
            <span className="font-medium text-purple-600">68.2%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Disk I/O</h3>
            <div className="flex items-center gap-2">
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>Temps real</option>
                <option>Últimes 24h</option>
              </select>
            </div>
          </div>
          <div className="h-32 bg-gray-50 rounded flex items-center justify-center mb-4">
            <div className="text-xs text-gray-500">💾 I/O: 245 MB/s reads, 89 MB/s writes</div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Load promig</span>
            <span className="font-medium text-orange-600">0.84</span>
          </div>
        </div>
      </div>

      {/* Estado actual de servidores */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Servidores</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { name: 'Web-01', status: 'online', cpu: 28, ram: 45, uptime: '45 dies' },
            { name: 'Web-02', status: 'online', cpu: 32, ram: 52, uptime: '45 dies' },
            { name: 'DB-01', status: 'online', cpu: 67, ram: 78, uptime: '32 dies' },
            { name: 'API-01', status: 'warning', cpu: 85, ram: 68, uptime: '12 dies' },
          ].map(server => (
            <div key={server.name} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{server.name}</h4>
                <div className={`w-3 h-3 rounded-full ${
                  server.status === 'online' ? 'bg-green-500' : 
                  server.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
              </div>
              <div className="space-y-2 text-xs">
                <div>CPU: <span className="font-semibold">{server.cpu}%</span></div>
                <div>RAM: <span className="font-semibold">{server.ram}%</span></div>
                <div>Uptime: <span className="font-semibold">{server.uptime}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}