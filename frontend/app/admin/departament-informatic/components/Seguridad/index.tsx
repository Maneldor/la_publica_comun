'use client'

import { Shield, CheckCircle, AlertTriangle, Clock } from 'lucide-react'

export default function Seguridad() {
  return (
    <div className="space-y-6">
      {/* Resumen de seguridad */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-700">100%</span>
          </div>
          <p className="text-sm text-green-700 font-medium">SSL Certificates</p>
          <p className="text-xs text-green-600">47/47 vàlids</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-700">0</span>
          </div>
          <p className="text-sm text-blue-700 font-medium">Vulnerabilitats</p>
          <p className="text-xs text-blue-600">Actuals detectades</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-700">3</span>
          </div>
          <p className="text-sm text-yellow-700 font-medium">Advertències</p>
          <p className="text-xs text-yellow-600">Updates pendents</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-700">15min</span>
          </div>
          <p className="text-sm text-purple-700 font-medium">Últim Scan</p>
          <p className="text-xs text-purple-600">Complet exitós</p>
        </div>
      </div>

      {/* Scans de seguridad */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scans de Seguretat</h3>
        <div className="space-y-4">
          {[
            { type: 'Vulnerability Scan', status: 'completed', time: '15min', issues: 0 },
            { type: 'SSL Certificate Check', status: 'completed', time: '1h', issues: 0 },
            { type: 'Port Scan', status: 'running', time: 'En curs', issues: '-' },
            { type: 'Malware Scan', status: 'completed', time: '2h', issues: 0 }
          ].map((scan, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  scan.status === 'completed' ? 'bg-green-500' :
                  scan.status === 'running' ? 'bg-blue-500 animate-pulse' :
                  'bg-gray-400'
                }`} />
                <div>
                  <p className="font-medium">{scan.type}</p>
                  <p className="text-sm text-gray-600">Fa {scan.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{scan.issues === 0 ? 'Cap problema' : `${scan.issues} problemes`}</p>
                <p className="text-sm text-gray-600">{scan.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}