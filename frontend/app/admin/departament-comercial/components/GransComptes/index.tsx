'use client'

import { Building2, Star, TrendingUp, Shield } from 'lucide-react'

export default function GransComptes() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Building2 className="w-7 h-7 text-indigo-600" />
          Gestió de Grans Comptes Institucionals
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-indigo-700">28</div>
            <div className="text-sm text-indigo-600">Comptes Estratègics</div>
          </div>
          <div className="bg-gold-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-700">€4.2M</div>
            <div className="text-sm text-yellow-600">Valor Anual</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">96%</div>
            <div className="text-sm text-green-600">Retenció</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">4.8</div>
            <div className="text-sm text-purple-600">Satisfacció Mitjana</div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-3">Principals Comptes Institucionals</h3>
          <div className="space-y-3">
            {[
              { nom: 'Generalitat de Catalunya', valor: '€850K', estat: 'Actiu', health: 95 },
              { nom: 'Ajuntament de Barcelona', valor: '€420K', estat: 'Renovació', health: 88 },
              { nom: 'Diputació de Madrid', valor: '€380K', estat: 'Actiu', health: 92 },
              { nom: 'Govern Balear', valor: '€290K', estat: 'Expansió', health: 85 }
            ].map((compte, i) => (
              <div key={i} className="border rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="font-medium">{compte.nom}</div>
                    <div className="text-sm text-gray-600">{compte.valor} • {compte.estat}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm">Health Score: {compte.health}%</div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${compte.health}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}