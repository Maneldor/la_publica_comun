'use client'

import { 
  Workflow, Zap, Play, Pause, Plus, Settings, 
  Mail, Calendar, Users, Target, Bell, Bot,
  ArrowRight, CheckCircle, Clock, AlertTriangle,
  Edit, Eye, Copy, Trash2, BarChart3
} from 'lucide-react'

interface AutomatitzacionsProps {
  // Props que s'afegiran quan es desenvolupi completament
}

export default function Automatitzacions({}: AutomatitzacionsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Workflow className="w-8 h-8 text-purple-600" />
              Automatitzacions
            </h2>
            <p className="text-gray-600 mt-2">
              Workflows i seqüències automàtiques d'email per optimitzar el procés comercial
            </p>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nou Workflow
          </button>
        </div>

        {/* Tipus d'automatitzacions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <Mail className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
            <h3 className="font-medium text-blue-900">Email Sequences</h3>
            <p className="text-xs text-blue-700">Nurturing automàtic</p>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <Target className="w-6 h-6 text-green-600 mb-2 mx-auto" />
            <h3 className="font-medium text-green-900">Lead Scoring</h3>
            <p className="text-xs text-green-700">Qualificació automàtica</p>
          </div>
          
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
            <Bell className="w-6 h-6 text-orange-600 mb-2 mx-auto" />
            <h3 className="font-medium text-orange-900">Notifications</h3>
            <p className="text-xs text-orange-700">Alertes intel·ligents</p>
          </div>
          
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
            <Calendar className="w-6 h-6 text-indigo-600 mb-2 mx-auto" />
            <h3 className="font-medium text-indigo-900">Follow-ups</h3>
            <p className="text-xs text-indigo-700">Seguiment automàtic</p>
          </div>
        </div>
      </div>

      {/* Estats dels workflows */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Play className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">8</div>
          <div className="text-sm text-gray-600">Actius</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Pause className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">3</div>
          <div className="text-sm text-gray-600">Pausats</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">2</div>
          <div className="text-sm text-gray-600">Esborranys</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">89%</div>
          <div className="text-sm text-gray-600">Taxa èxit</div>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <Workflow className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Sistema d'Automatitzacions en desenvolupament
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Constructor visual de workflows amb triggers intel·ligents, 
            seqüències d'email personalizades i automatització completa del procés comercial.
          </p>
          
          {/* Workflow exemple visual */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold mb-4">Exemple de Workflow: Nurturing Lead Nou</h4>
              <div className="flex items-center justify-center space-x-4 overflow-x-auto">
                <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg text-center min-w-[120px]">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-xs font-medium">Lead Nou</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                
                <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg text-center min-w-[120px]">
                  <Mail className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <div className="text-xs font-medium">Email Benvinguda</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                
                <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg text-center min-w-[120px]">
                  <Clock className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-xs font-medium">Esperar 3 dies</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                
                <div className="flex-shrink-0 p-3 bg-orange-100 rounded-lg text-center min-w-[120px]">
                  <Bell className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                  <div className="text-xs font-medium">Follow-up</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features previstes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Constructor Visual
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Drag & drop interface</li>
                <li>• Triggers configurables</li>
                <li>• Branching condicional</li>
                <li>• Templates predefinits</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Email Marketing
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Seqüències automàtiques</li>
                <li>• Personalització dinàmica</li>
                <li>• A/B testing</li>
                <li>• Tracking complet</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Analytics
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mètriques en temps real</li>
                <li>• Taxa conversió</li>
                <li>• ROI per workflow</li>
                <li>• Optimitzacions IA</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}