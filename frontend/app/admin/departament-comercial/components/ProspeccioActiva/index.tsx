'use client'

import { Target, Database, Search, Bot } from 'lucide-react'

export default function ProspeccioActiva() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-7 h-7 text-purple-600" />
          Sistema de Prospecció Activa
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">12</div>
            <div className="text-sm text-purple-600">Bases de Dades</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">45,230</div>
            <div className="text-sm text-blue-600">Contactes Segmentats</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">287</div>
            <div className="text-sm text-green-600">Leads Qualificats</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-700">18.4%</div>
            <div className="text-sm text-orange-600">Taxa Resposta</div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-600">Sistema de prospecció implementat:</p>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
            <li>Bases de dades segmentades per sector i mida</li>
            <li>Campanyes automatitzades per email i LinkedIn</li>
            <li>Scoring automàtic de prospects</li>
            <li>Seguiment intel·ligent amb IA</li>
            <li>Integració amb CRM i pipeline</li>
          </ul>
        </div>
      </div>
    </div>
  )
}