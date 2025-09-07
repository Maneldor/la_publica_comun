'use client'

import { TrendingUp, Mail, Users, Target } from 'lucide-react'

export default function IntegracioMarketing() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-pink-600" />
          Integració Completa amb Marketing
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-pink-700">1,247</div>
            <div className="text-sm text-pink-600">Leads Generats</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">28.4%</div>
            <div className="text-sm text-blue-600">Taxa Conversió MQL</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">€187</div>
            <div className="text-sm text-green-600">ROI Marketing</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">42</div>
            <div className="text-sm text-purple-600">Dies Cicle Mitjà</div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-3">Campanyes Actives</h3>
          <div className="space-y-3">
            {[
              { nom: 'IA per Administracions', leads: 156, conversio: 32.1, cost: '€2.450', estat: 'Activa' },
              { nom: 'Automatització Empreses', leads: 89, conversio: 28.7, cost: '€1.890', estat: 'Optimitzant' },
              { nom: 'Webinar Sector Públic', leads: 234, conversio: 18.9, cost: '€890', estat: 'Finalitzada' }
            ].map((campanya, i) => (
              <div key={i} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{campanya.nom}</div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    campanya.estat === 'Activa' ? 'bg-green-100 text-green-700' :
                    campanya.estat === 'Optimitzant' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {campanya.estat}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>Leads: <strong>{campanya.leads}</strong></div>
                  <div>Conversió: <strong>{campanya.conversio}%</strong></div>
                  <div>Cost: <strong>{campanya.cost}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}