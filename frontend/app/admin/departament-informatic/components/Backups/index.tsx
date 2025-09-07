'use client'

import { HardDrive, CheckCircle, Clock, Database } from 'lucide-react'

export default function Backups() {
  return (
    <div className="space-y-6">
      {/* Estado general de backups */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-700">100%</span>
          </div>
          <p className="text-sm text-green-700 font-medium">Taxa d'Èxit</p>
          <p className="text-xs text-green-600">Últimes 24h</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <HardDrive className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-700">2.3TB</span>
          </div>
          <p className="text-sm text-blue-700 font-medium">Espai Utilitzat</p>
          <p className="text-xs text-blue-600">de 10TB disponibles</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-700">47</span>
          </div>
          <p className="text-sm text-purple-700 font-medium">Backups Avui</p>
          <p className="text-xs text-purple-600">Tots completats</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-700">02:00</span>
          </div>
          <p className="text-sm text-orange-700 font-medium">Pròxim Backup</p>
          <p className="text-xs text-orange-600">Programat</p>
        </div>
      </div>

      {/* Lista de backups recientes */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Backups Recents</h3>
        <div className="space-y-3">
          {[
            { name: 'Database Principal', time: '02:00', size: '450MB', status: 'success' },
            { name: 'Files Web', time: '02:15', size: '1.2GB', status: 'success' },
            { name: 'Logs Sistema', time: '02:30', size: '156MB', status: 'success' },
            { name: 'Configuracions', time: '02:45', size: '23MB', status: 'success' }
          ].map((backup, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">{backup.name}</p>
                  <p className="text-sm text-gray-600">{backup.time} • {backup.size}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  Completat
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}