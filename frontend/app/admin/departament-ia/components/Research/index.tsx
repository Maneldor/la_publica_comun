'use client'

import { FlaskConical, Atom, Dna, Microscope, BarChart } from 'lucide-react'

export default function Research() {
  return (
    <div className="space-y-6">
      {/* Laboratori d'Experimentació */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FlaskConical className="w-5 h-5" />
          Laboratori d'Experimentació
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <Atom className="w-6 h-6 text-purple-500 mb-2" />
            <p className="font-medium">Nova Arquitectura</p>
            <p className="text-sm text-gray-600">Provar arquitectures experimentals</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <Dna className="w-6 h-6 text-blue-500 mb-2" />
            <p className="font-medium">Híbrids Multimodals</p>
            <p className="text-sm text-gray-600">Combinar text, imatge i àudio</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <Microscope className="w-6 h-6 text-green-500 mb-2" />
            <p className="font-medium">Anàlisi de Components</p>
            <p className="text-sm text-gray-600">Estudiar capes i atenció</p>
          </button>
        </div>
        <div className="border rounded-lg p-4">
          <p className="font-medium mb-3">Experiment Actiu: Atenció Dispersa</p>
          <div className="grid grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-gray-600">Paràmetres</p>
              <p className="font-medium">125M</p>
            </div>
            <div>
              <p className="text-gray-600">FLOPs</p>
              <p className="font-medium">-45%</p>
            </div>
            <div>
              <p className="text-gray-600">Memòria</p>
              <p className="font-medium">-60%</p>
            </div>
            <div>
              <p className="text-gray-600">Precisió</p>
              <p className="font-medium">92.1%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmarking */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Benchmarking
        </h3>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium">MMLU (Català)</p>
              <span className="text-sm text-gray-600">Actualitzat fa 2h</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">CatGPT-4</span>
                <div className="flex items-center gap-2">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94%' }} />
                  </div>
                  <span className="text-sm font-medium">94%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">GPT-4</span>
                <div className="flex items-center gap-2">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Claude-3</span>
                <div className="flex items-center gap-2">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '90%' }} />
                  </div>
                  <span className="text-sm font-medium">90%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium">HumanEval (Codi)</p>
              <span className="text-sm text-gray-600">Actualitzat fa 1d</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">CatGPT-4-Code</span>
                <div className="flex items-center gap-2">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '87%' }} />
                  </div>
                  <span className="text-sm font-medium">87%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Codex</span>
                <div className="flex items-center gap-2">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}