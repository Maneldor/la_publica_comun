'use client'

import { TrendingUp, Compass, Target, Shuffle, Euro } from 'lucide-react'

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Anàlisi Predictiu */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Anàlisi Predictiu d'Ús
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Predicció Setmana Vinent</p>
            <p className="text-2xl font-bold">1.45M</p>
            <p className="text-sm text-green-600">+21% vs actual</p>
            <div className="mt-2 text-xs text-gray-500">
              Confiança: 89%
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Pics d'Ús Previstos</p>
            <p className="text-lg font-bold">Dimarts 10-12h</p>
            <p className="text-sm text-blue-600">45K req/min</p>
            <div className="mt-2 text-xs text-gray-500">
              Basat en patrons històrics
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Capacitat Necessària</p>
            <p className="text-2xl font-bold">+3</p>
            <p className="text-sm">Nodes GPU addicionals</p>
            <div className="mt-2 text-xs text-gray-500">
              Per mantenir SLA 99.9%
            </div>
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <p className="font-medium mb-3">Tendències Identificades</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Consultes legals</span>
              <span className="text-sm text-green-600">↑ 34% creixement</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Generació documents</span>
              <span className="text-sm text-green-600">↑ 28% creixement</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Traduccions</span>
              <span className="text-sm text-red-600">↓ 12% decreixement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Identificació de Patrons */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Compass className="w-5 h-5" />
          Patrons d'Ús Detectats
        </h3>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <p className="font-medium">Patró: Consultes en Cascada</p>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Els usuaris fan 3-4 consultes relacionades en menys de 5 minuts
            </p>
            <div className="flex items-center justify-between text-sm">
              <span>Freqüència: 234 cops/dia</span>
              <button className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                Optimitzar
              </button>
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-yellow-50">
            <div className="flex items-center gap-2 mb-2">
              <Shuffle className="w-5 h-5 text-yellow-600" />
              <p className="font-medium">Patró: Reformulació Repetitiva</p>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              30% d'usuaris reformulen la mateixa pregunta 2+ vegades
            </p>
            <div className="flex items-center justify-between text-sm">
              <span>Impact: -15% satisfacció</span>
              <button className="px-3 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600">
                Millorar Prompts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ROI d'Inversions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Euro className="w-5 h-5" />
          ROI d'Inversions en IA
        </h3>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium">CatGPT-4 Development</p>
              <span className="text-green-600 font-medium">ROI: 285%</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Inversió</p>
                <p className="font-medium">€125,000</p>
              </div>
              <div>
                <p className="text-gray-600">Estalvis/any</p>
                <p className="font-medium">€356,250</p>
              </div>
              <div>
                <p className="text-gray-600">Payback</p>
                <p className="font-medium">4.2 mesos</p>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium">Automatització Atenció Ciutadana</p>
              <span className="text-green-600 font-medium">ROI: 420%</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Inversió</p>
                <p className="font-medium">€45,000</p>
              </div>
              <div>
                <p className="text-gray-600">Estalvis/any</p>
                <p className="font-medium">€189,000</p>
              </div>
              <div>
                <p className="text-gray-600">Payback</p>
                <p className="font-medium">2.9 mesos</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm font-medium text-green-800">
            Total ROI Portfolio IA: 342% • Estalvis anuals: €1.2M
          </p>
        </div>
      </div>
    </div>
  )
}