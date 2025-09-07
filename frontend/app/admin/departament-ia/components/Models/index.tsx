'use client'

import { useState } from 'react'
import { 
  GitBranch, ChevronRight, Pause, X, Database, Upload, Settings, 
  Play, GitCompare 
} from 'lucide-react'

interface Dataset {
  id: string
  nom: string
  tipus: string
  tamany: string
  samples: number
  qualitat: number
  estat: 'disponible' | 'processant' | 'error'
  etiquetes: string[]
}

interface ModelsProps {
  datasets: Dataset[]
}

export default function Models({ datasets }: ModelsProps) {
  return (
    <div className="space-y-6">
      {/* Pipeline d'Entrenament */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Pipeline d'Entrenament
        </h3>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {['Data Prep', 'Training', 'Validation', 'Testing', 'Deploy'].map((stage, idx) => (
            <div key={stage} className="relative">
              <div className={`p-3 rounded-lg text-center text-sm ${
                idx <= 2 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {stage}
              </div>
              {idx < 4 && (
                <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-medium">Model: CatGPT-4-Legal</p>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200">
                <Pause className="w-4 h-4" />
              </button>
              <button className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Època</p>
              <p className="font-medium">12/50</p>
            </div>
            <div>
              <p className="text-gray-600">Loss</p>
              <p className="font-medium">0.234</p>
            </div>
            <div>
              <p className="text-gray-600">Learning Rate</p>
              <p className="font-medium">0.0001</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gestió de Datasets */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Database className="w-5 h-5" />
            Gestió de Datasets
          </h3>
          <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center gap-1">
            <Upload className="w-4 h-4" />
            Importar Dataset
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {datasets.map(dataset => (
            <div key={dataset.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{dataset.nom}</p>
                <span className={`px-2 py-1 rounded text-xs ${
                  dataset.estat === 'disponible' ? 'bg-green-100 text-green-800' :
                  dataset.estat === 'processant' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {dataset.estat}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Tipus: {dataset.tipus} • Tamany: {dataset.tamany}</p>
                <p>Samples: {dataset.samples.toLocaleString()}</p>
                <p>Qualitat: {dataset.qualitat}%</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {dataset.etiquetes.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fine-tuning */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Fine-tuning Configuration
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Model Base</label>
            <select className="w-full p-2 border rounded-lg">
              <option>CatGPT-4</option>
              <option>Llama-3-CAT</option>
              <option>Mistral-7B-CAT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Dataset</label>
            <select className="w-full p-2 border rounded-lg">
              <option>Corpus Legal Català</option>
              <option>Documents Administratius</option>
              <option>FAQ Ciutadania</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Learning Rate</label>
            <input type="number" className="w-full p-2 border rounded-lg" defaultValue="0.0001" step="0.00001" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Batch Size</label>
            <input type="number" className="w-full p-2 border rounded-lg" defaultValue="32" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Epochs</label>
            <input type="number" className="w-full p-2 border rounded-lg" defaultValue="10" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Warmup Steps</label>
            <input type="number" className="w-full p-2 border rounded-lg" defaultValue="500" />
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2">
          <Play className="w-4 h-4" />
          Iniciar Fine-tuning
        </button>
      </div>

      {/* A/B Testing */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GitCompare className="w-5 h-5" />
          A/B Testing
        </h3>
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Test: Resposta a Consultes Legals</p>
              <p className="text-sm text-gray-600">Comparant CatGPT-4 vs CatGPT-4-Legal</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              En execució
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm font-medium mb-2">Variant A (Control)</p>
              <div className="space-y-1 text-sm">
                <p>Model: CatGPT-4</p>
                <p>Mostra: 5,000 consultes</p>
                <p>Taxa èxit: 82.3%</p>
                <p>Temps resposta: 1.2s</p>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm font-medium mb-2">Variant B (Test)</p>
              <div className="space-y-1 text-sm">
                <p>Model: CatGPT-4-Legal</p>
                <p>Mostra: 5,000 consultes</p>
                <p>Taxa èxit: 89.7%</p>
                <p>Temps resposta: 1.1s</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-100 rounded">
            <p className="text-sm font-medium text-green-800">
              ✓ Variant B mostra millora significativa (+7.4% taxa èxit, -8% latència)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}