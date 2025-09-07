'use client'

import { 
  BarChart3, TrendingUp, PieChart, Target, DollarSign,
  Calendar, Filter, Download, RefreshCw, Eye,
  ArrowUp, ArrowDown, Users, Activity, LineChart
} from 'lucide-react'

interface ReportingProps {
  // Props que s'afegiran quan es desenvolupi completament
}

export default function Reporting({}: ReportingProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-green-600" />
              Analytics i Reporting
            </h2>
            <p className="text-gray-600 mt-2">
              Analytics avançats i forecasting de vendes per optimitzar el rendiment comercial
            </p>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Actualitzar
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Informe
            </button>
          </div>
        </div>

        {/* Tipus d'analytics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <TrendingUp className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
            <h3 className="font-medium text-blue-900">Forecasting</h3>
            <p className="text-xs text-blue-700">Prediccions vendes</p>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <PieChart className="w-6 h-6 text-green-600 mb-2 mx-auto" />
            <h3 className="font-medium text-green-900">Conversions</h3>
            <p className="text-xs text-green-700">Taxa conversió</p>
          </div>
          
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
            <Target className="w-6 h-6 text-purple-600 mb-2 mx-auto" />
            <h3 className="font-medium text-purple-900">Objectius</h3>
            <p className="text-xs text-purple-700">Seguiment metes</p>
          </div>
          
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
            <DollarSign className="w-6 h-6 text-orange-600 mb-2 mx-auto" />
            <h3 className="font-medium text-orange-900">ROI</h3>
            <p className="text-xs text-orange-700">Rendiment inversió</p>
          </div>
          
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
            <Activity className="w-6 h-6 text-indigo-600 mb-2 mx-auto" />
            <h3 className="font-medium text-indigo-900">Rendiment</h3>
            <p className="text-xs text-indigo-700">KPIs comercials</p>
          </div>
        </div>
      </div>

      {/* Mètriques resum */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Ingressos mensuals</div>
              <div className="text-2xl font-bold text-gray-900">€127.540</div>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <ArrowUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-xs text-green-600 mt-1">+12.5% vs mes anterior</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Leads qualificats</div>
              <div className="text-2xl font-bold text-gray-900">342</div>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-xs text-blue-600 mt-1">+8.3% setmana actual</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Taxa conversió</div>
              <div className="text-2xl font-bold text-gray-900">18.7%</div>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-xs text-red-600 mt-1">-2.1% vs objectiu</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Temps mig tancament</div>
              <div className="text-2xl font-bold text-gray-900">23 dies</div>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="text-xs text-green-600 mt-1">-3 dies vs trimestre</div>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Sistema d'Analytics i Reporting en desenvolupament
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Plataforma completa d'analytics amb dashboards interactius, 
            forecasting amb IA i informes personalitzats automàtics.
          </p>
          
          {/* Exemple de dashboard visual */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold mb-4">Dashboard d'Analytics Comercials</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">Pipeline Vendes</h5>
                    <LineChart className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded flex items-end justify-center">
                    <span className="text-xs text-blue-700">Gràfic interactiu</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">Conversions</h5>
                    <PieChart className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="h-20 bg-gradient-to-r from-green-100 to-green-200 rounded flex items-center justify-center">
                    <span className="text-xs text-green-700">Diagrama circular</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">Rendiment Equip</h5>
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="h-20 bg-gradient-to-r from-purple-100 to-purple-200 rounded flex items-end justify-center">
                    <span className="text-xs text-purple-700">Gràfic barres</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features previstes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Forecasting IA
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Prediccions vendes</li>
                <li>• Anàlisi tendències</li>
                <li>• Alertes automàtiques</li>
                <li>• Modelat predictiu</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Dashboards Interactius
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Visualitzacions temps real</li>
                <li>• Filtres personalitzats</li>
                <li>• Comparatives període</li>
                <li>• Drill-down detallat</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Download className="w-5 h-5 text-purple-600" />
                Informes Automàtics
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Generació programada</li>
                <li>• Templates personalitzats</li>
                <li>• Distribució automàtica</li>
                <li>• Múltiples formats</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}