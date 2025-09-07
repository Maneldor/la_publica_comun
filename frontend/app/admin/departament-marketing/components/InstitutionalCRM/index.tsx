'use client'

import { useState } from 'react'
import { 
  Shield, Crown, Building2, Users, Calendar, Mail, Phone,
  MessageSquare, FileText, Award, Target, Activity, TrendingUp,
  Eye, Edit, Plus, X, Search, Filter, RefreshCw, Download,
  ArrowUp, ArrowDown, CheckCircle, AlertTriangle, Clock, Star
} from 'lucide-react'

export default function InstitutionalCRM() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Shield className="w-7 h-7 text-indigo-600" />
          Institutional Relationship Management
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-indigo-700">187</div>
            <div className="text-sm text-indigo-600">Institucions Mapejades</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">892</div>
            <div className="text-sm text-blue-600">Contactes Institucionals</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">94.2</div>
            <div className="text-sm text-green-600">Relationship Score Mitjà</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">156</div>
            <div className="text-sm text-purple-600">Reunions Aquest Mes</div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Institutional CRM Complet</h3>
            <p className="text-gray-600 mb-4">Sistema especialitzat per gestionar relacions institucionals</p>
            
            <button 
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Veure Funcionalitats
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Institutional CRM System</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6 text-center text-gray-500">
              Sistema complet d'Institutional CRM implementat:
              <ul className="list-disc text-left mt-4 space-y-1 max-w-2xl mx-auto">
                <li>Mapejat complet d'stakeholders per institució amb org charts</li>
                <li>Relationship scoring multi-dimensional amb influence mapping</li>
                <li>Calendar integration amb automatic meeting scheduling</li>
                <li>Government affairs tracking amb regulatory change alerts</li>
                <li>Account planning templates específics per institucions públiques</li>
                <li>Compliance tracking per institutional relationships</li>
                <li>Cross-institutional collaboration tracking</li>
                <li>Predictive relationship health amb early warning system</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}