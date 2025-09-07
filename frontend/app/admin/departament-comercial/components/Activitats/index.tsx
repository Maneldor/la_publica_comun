'use client'

import { 
  Calendar, Clock, Plus, Filter, Search, CheckCircle, 
  AlertCircle, Users, Phone, Mail, Video, FileText,
  Edit, Eye, Trash2, Bell, Star
} from 'lucide-react'

interface ActivitatsProps {
  // Props que s'afegiran quan es desenvolupi completament
}

export default function Activitats({}: ActivitatsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-indigo-600" />
              Gestió d'Activitats
            </h2>
            <p className="text-gray-600 mt-2">
              Calendari i tasques de seguiment per optimitzar la gestió comercial
            </p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Activitat
          </button>
        </div>

        {/* Funcionalitats previstes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium text-blue-900">Calendari</h3>
            <p className="text-xs text-blue-700">Gestió visual d'events</p>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-medium text-green-900">Tasques</h3>
            <p className="text-xs text-green-700">Seguiment activitats</p>
          </div>
          
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <Bell className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-medium text-purple-900">Recordatoris</h3>
            <p className="text-xs text-purple-700">Alertes automàtiques</p>
          </div>
          
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <Users className="w-6 h-6 text-orange-600 mb-2" />
            <h3 className="font-medium text-orange-900">Seguiment</h3>
            <p className="text-xs text-orange-700">Historial clients</p>
          </div>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Funcionalitat en desenvolupament
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Aquest mòdul contindrà un calendari complet amb gestió de tasques, 
            seguiment de clients i automatització de recordatoris.
          </p>
          
          {/* Features previstes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Calendari integrat</h4>
                <p className="text-sm text-gray-600">Vista mensual/setmanal amb events</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Tasques seguiment</h4>
                <p className="text-sm text-gray-600">Checklist i prioritats</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Sincronització</h4>
                <p className="text-sm text-gray-600">Integració amb CRM</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Notificacions</h4>
                <p className="text-sm text-gray-600">Alertes automàtiques</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}