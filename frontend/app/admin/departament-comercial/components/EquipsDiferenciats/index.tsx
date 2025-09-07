'use client'

import { Users, Building2, MapPin, Target } from 'lucide-react'

export default function EquipsDiferenciats() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Users className="w-7 h-7 text-green-600" />
          Equips Diferenciats Administracions vs Empreses
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Equip Administracions Públiques
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-xl font-bold text-blue-700">18</div>
                <div className="text-sm text-blue-600">Membres Equip</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-xl font-bold text-green-700">€2.45M</div>
                <div className="text-sm text-green-600">Pipeline</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="text-xl font-bold text-purple-700">15.2%</div>
                <div className="text-sm text-purple-600">Taxa Conversió</div>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-orange-600" />
              Equip Empreses Privades
            </h3>
            <div className="space-y-3">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="text-xl font-bold text-orange-700">23</div>
                <div className="text-sm text-orange-600">Membres Equip</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-xl font-bold text-green-700">€5.68M</div>
                <div className="text-sm text-green-600">Pipeline</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="text-xl font-bold text-purple-700">22.8%</div>
                <div className="text-sm text-purple-600">Taxa Conversió</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-600">Especialització implementada:</p>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
            <li>Equips diferenciats per administracions públiques vs empreses privades</li>
            <li>Formació especialitzada per cada tipus de client</li>
            <li>Processos de venda adaptats</li>
            <li>KPIs específics per segment</li>
          </ul>
        </div>
      </div>
    </div>
  )
}