'use client'

import { useState } from 'react'
import { 
  Globe, Database, Users, Building2, Crown, Star, Activity,
  Zap, Shield, Brain, Target, TrendingUp, BarChart3, Eye,
  Edit, Plus, X, RefreshCw, Download, Search, Filter, Settings
} from 'lucide-react'

export default function CDPUnificat() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Globe className="w-7 h-7 text-teal-600" />
          Customer Data Platform Unificat
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-teal-700">4</div>
            <div className="text-sm text-teal-600">Ecosistemes Unificats</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">247K</div>
            <div className="text-sm text-blue-600">Profiles Unificats</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">156</div>
            <div className="text-sm text-green-600">Data Sources</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">99.7%</div>
            <div className="text-sm text-purple-600">Data Quality Score</div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="text-center py-12">
            <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">CDP Enterprise Multi-Stakeholder</h3>
            <p className="text-gray-600 mb-4">Plataforma unificada per gestionar tot l'ecosistema de stakeholders</p>
            
            <button 
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Veure Arquitectura
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Customer Data Platform Unificat</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6 text-center text-gray-500">
              CDP unificat per tot l'ecosistema implementat:
              <ul className="list-disc text-left mt-4 space-y-1 max-w-2xl mx-auto">
                <li>Unified customer profiles dels 4 segments (Empleats, Empreses, Administracions, Branding)</li>
                <li>Real-time data ingestion amb 150+ data sources</li>
                <li>Identity resolution cross-device i cross-platform</li>
                <li>Audience segmentation dinàmica amb ML predictions</li>
                <li>Journey orchestration unificada per tots els stakeholders</li>
                <li>Privacy-first architecture amb consent management</li>
                <li>Real-time personalization engine per cada audience</li>
                <li>Cross-stakeholder analytics i attribution modeling</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}