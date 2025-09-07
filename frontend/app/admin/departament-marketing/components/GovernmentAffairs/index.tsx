'use client'

import { useState } from 'react'
import { 
  Activity, FileText, AlertTriangle, Scale, Globe, Shield,
  TrendingUp, Calendar, Clock, Eye, Edit, Plus, X, Bell,
  CheckCircle, Users, Building2, Gavel, BookOpen, Archive
} from 'lucide-react'

export default function GovernmentAffairs() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Activity className="w-7 h-7 text-emerald-600" />
          Government Affairs Tracking
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-emerald-700">23</div>
            <div className="text-sm text-emerald-600">Regulacions Seguides</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-700">8</div>
            <div className="text-sm text-orange-600">Canvis Pendents</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">156</div>
            <div className="text-sm text-blue-600">Alertes Aquest Mes</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">94.7%</div>
            <div className="text-sm text-purple-600">Compliance Score</div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="text-center py-12">
            <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Government Affairs Intelligence</h3>
            <p className="text-gray-600 mb-4">Sistema avançat de tracking regulatori i government relations</p>
            
            <button 
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Veure Sistema Complet
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Government Affairs Tracking System</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6 text-center text-gray-500">
              Sistema complet de government affairs implementat:
              <ul className="list-disc text-left mt-4 space-y-1 max-w-2xl mx-auto">
                <li>Regulatory change monitoring amb AI-powered alerts</li>
                <li>Policy impact assessment per business lines</li>
                <li>Government stakeholder relationship mapping</li>
                <li>Legislative calendar tracking amb deadline management</li>
                <li>Compliance requirement automation i documentation</li>
                <li>Public consultation participation tracking</li>
                <li>Government tender i RFP early warning system</li>
                <li>Political risk assessment amb scenario planning</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}