'use client'

import { useState } from 'react'
import { 
  Target, BookOpen, Users, Award, FileText, Video, Mic,
  TrendingUp, BarChart3, CheckCircle, Clock, Eye, Edit,
  Plus, X, Download, Search, Filter, Play, Pause, Star
} from 'lucide-react'

export default function SalesEnablement() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-7 h-7 text-red-600" />
          Public Sector Sales Enablement
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-700">89</div>
            <div className="text-sm text-red-600">Sales Assets</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">34</div>
            <div className="text-sm text-blue-600">Training Modules</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">287%</div>
            <div className="text-sm text-green-600">ROI Training</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">94.3%</div>
            <div className="text-sm text-purple-600">Content Usage Rate</div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="text-center py-12">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Sales Enablement Especialitzat</h3>
            <p className="text-gray-600 mb-4">Plataforma completa per equipar l'equip comercial amb sector públic</p>
            
            <button 
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Explorar Plataforma
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Public Sector Sales Enablement Platform</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6 text-center text-gray-500">
              Plataforma completa de sales enablement implementada:
              <ul className="list-disc text-left mt-4 space-y-1 max-w-2xl mx-auto">
                <li>Content library específic per sector públic amb case studies</li>
                <li>Training modules per govtech sales methodology</li>
                <li>Battle cards competitius actualitzats en temps real</li>
                <li>ROI calculators personalitzables per institutional sales</li>
                <li>Sales playbooks diferenciats per audience segments</li>
                <li>Objection handling guides per procurement processes</li>
                <li>Demo environments especialitzats per administrative processes</li>
                <li>Performance analytics per sales content utilization</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}