'use client'

import { MapPin, Users, Target, TrendingUp } from 'lucide-react'

export default function GestioTerritorial() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MapPin className="w-7 h-7 text-blue-600" />
          Gestió Territorial Enterprise
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">17</div>
            <div className="text-sm text-blue-600">Comunitats Autònomes</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">34</div>
            <div className="text-sm text-green-600">Gestors Especialitzats</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">98.5%</div>
            <div className="text-sm text-purple-600">Cobertura Territorial</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-700">€8.2M</div>
            <div className="text-sm text-orange-600">Pipeline Regional</div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-600">
            Sistema territorial implementat amb:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
            <li>Organització per territoris amb gestors especialitzats</li>
            <li>Assignació automàtica per comunitat autònoma</li>
            <li>Cobertura completa de les 17 CCAA</li>
            <li>Especialització sector públic vs privat</li>
          </ul>
        </div>
      </div>
    </div>
  )
}