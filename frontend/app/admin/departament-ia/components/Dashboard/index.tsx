'use client'

import { Brain, Activity, Target, Euro, TrendingUp, TrendingDown, Plus } from 'lucide-react'

// Definición de tipos para el Dashboard
interface ModelMetric {
  id: string
  nom: string
  tipus: string
  versio: string
  estat: 'actiu' | 'entrenant' | 'pausat'
  rendiment: {
    accuracy: number
    latency: number
    cost: number
  }
  errorsRate: number
}

interface Experiment {
  id: string
  nom: string
  tipus: string
  model: string
  dataset: string
  estat: string
  progres: number
  metriques: {
    baseline: number
    actual: number
    millora: number
  }
  dataInici: Date
  duracioEstimada: string
}

interface DashboardProps {
  models: ModelMetric[]
  experiments: Experiment[]
}

export default function Dashboard({ models, experiments }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Mètriques principals */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold">12</span>
          </div>
          <p className="text-sm text-gray-600">Models actius</p>
          <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +2 aquest mes
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold">1.2M</span>
          </div>
          <p className="text-sm text-gray-600">Requests diàries</p>
          <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +15% setmana passada
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold">94.5%</span>
          </div>
          <p className="text-sm text-gray-600">Precisió mitjana</p>
          <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +2.1% millora
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Euro className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold">€8.5K</span>
          </div>
          <p className="text-sm text-gray-600">Cost mensual</p>
          <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            +5% mes passat
          </div>
        </div>
      </div>

      {/* Models Personalitzats */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Models Personalitzats
          </h3>
          <button className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Nou Model
          </button>
        </div>
        <div className="space-y-3">
          {models.map(model => (
            <div key={model.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    model.estat === 'actiu' ? 'bg-green-500' :
                    model.estat === 'entrenant' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`} />
                  <div>
                    <p className="font-medium">{model.nom}</p>
                    <p className="text-sm text-gray-600">
                      v{model.versio} • {model.tipus.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Accuracy</p>
                    <p className="font-medium">{model.rendiment.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Latency</p>
                    <p className="font-medium">{model.rendiment.latency}ms</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cost</p>
                    <p className="font-medium">€{model.rendiment.cost}/1K</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Errors</p>
                    <p className={`font-medium ${model.errorsRate < 1 ? 'text-green-600' : 'text-red-600'}`}>
                      {model.errorsRate}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experiments en curs */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Experiments en Curs
        </h3>
        <div className="space-y-3">
          {experiments.map(exp => (
            <div key={exp.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">{exp.nom}</p>
                  <p className="text-sm text-gray-600">
                    {exp.tipus.replace('_', ' ')} • Model: {exp.model}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  exp.estat === 'executant' ? 'bg-blue-100 text-blue-800' :
                  exp.estat === 'completat' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {exp.estat}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${exp.progres}%` }} />
              </div>
              <div className="flex items-center justify-between text-sm pt-2">
                <span>Millora: <span className="text-green-600 font-medium">+{exp.metriques.millora}%</span></span>
                <span>Temps restant: {exp.duracioEstimada}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}