'use client'

import { Bot, Zap, RefreshCw, Settings } from 'lucide-react'

export default function AutomatitzacioComercial() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Bot className="w-7 h-7 text-cyan-600" />
          Eines d'Automatització Comercial Avançades
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-cyan-700">24</div>
            <div className="text-sm text-cyan-600">Workflows Actius</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">1,847</div>
            <div className="text-sm text-blue-600">Accions Automatitzades</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">67%</div>
            <div className="text-sm text-green-600">Temps Estalviat</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">€45K</div>
            <div className="text-sm text-purple-600">Valor Generat</div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-3">Automatitzacions Actives</h3>
          <div className="space-y-3">
            {[
              { nom: 'Qualificació Automàtica Leads', triggers: 234, eficiencia: 89, estat: 'Actiu' },
              { nom: 'Seguiment Email Seqüencial', triggers: 156, eficiencia: 76, estat: 'Actiu' },
              { nom: 'Assignació Intel·ligent Gestors', triggers: 89, eficiencia: 94, estat: 'Actiu' },
              { nom: 'Alerts Pipeline Estancat', triggers: 45, eficiencia: 87, estat: 'Pausa' }
            ].map((auto, i) => (
              <div key={i} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{auto.nom}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    auto.estat === 'Actiu' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {auto.estat}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Triggers: <strong>{auto.triggers}</strong></div>
                  <div>Eficiència: <strong>{auto.eficiencia}%</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}