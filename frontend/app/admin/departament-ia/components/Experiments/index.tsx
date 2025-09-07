'use client'

import { useState } from 'react'
import { 
  TestTube, Activity, Plus, Target, TrendingUp, Users, BookOpen, 
  BarChart, FileText, X, Shield, CheckCircle, AlertTriangle 
} from 'lucide-react'

// Tipos para el Laboratorio R&D
interface AdvancedExperiment {
  id: string
  name: string
  type: string
  status: string
  progress: number
  hypothesis: string
  startDate: Date
  endDate: Date
  participants: number
  variants: {
    [key: string]: {
      name: string
      percentage: number
    }
  }
  metrics: {
    primary: {
      name: string
      current: string | number
      target: string | number
    }
    secondary: Array<{
      name: string
      current: string
      baseline: string
    }>
  }
  statisticalSignificance: number
  confidenceLevel: number
  collaborators: string[]
  versions: Array<{
    version: string
    date: Date
    author: string
    changes: string
  }>
  documentation: {
    methodology: string
    tools: string[]
    dataCollection: string
    qualityControls: string[]
    ethicalConsiderations: string
  }
}

interface ExperimentTemplate {
  id: string
  name: string
  category: string
  description: string
  hypothesis: string
  metrics: string[]
  duration: number
  sampleSize: number
  variants: string[]
  methodology: string
}

interface ExperimentsProps {
  advancedExperiments: AdvancedExperiment[]
  experimentTemplates: ExperimentTemplate[]
  experimentFilter: string
  setExperimentFilter: (value: string) => void
  experimentTypeFilter: string
  setExperimentTypeFilter: (value: string) => void
  selectedExperiment: AdvancedExperiment | null
  setSelectedExperiment: (exp: AdvancedExperiment | null) => void
  
  // Modal states
  setShowExperimentWizardModal: (show: boolean) => void
  setShowExperimentDetailsModal: (show: boolean) => void
  setShowStatisticalAnalysisModal: (show: boolean) => void
  setShowComparisonModal: (show: boolean) => void
  setShowCollaborationModal: (show: boolean) => void
  setShowTemplatesModal: (show: boolean) => void
  setShowDocumentationModal: (show: boolean) => void
  setShowReportsModal: (show: boolean) => void
}

export default function Experiments({
  advancedExperiments,
  experimentTemplates,
  experimentFilter,
  setExperimentFilter,
  experimentTypeFilter,
  setExperimentTypeFilter,
  selectedExperiment,
  setSelectedExperiment,
  setShowExperimentWizardModal,
  setShowExperimentDetailsModal,
  setShowStatisticalAnalysisModal,
  setShowComparisonModal,
  setShowCollaborationModal,
  setShowTemplatesModal,
  setShowDocumentationModal,
  setShowReportsModal
}: ExperimentsProps) {
  
  return (
    <div className="space-y-6">
      {/* Header del Laboratorio R&D */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-3">
              <TestTube className="w-7 h-7" />
              Laboratori Complet de R&D
            </h3>
            <p className="text-blue-100 mt-1">
              Gestió avançada d'experiments amb control en temps real i anàlisi estadístic
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                <span className="font-semibold">{advancedExperiments.filter(e => e.status === 'running').length} Actius</span>
              </div>
            </div>
            <button
              onClick={() => setShowExperimentWizardModal(true)}
              className="bg-white/20 backdrop-blur rounded-lg px-4 py-2 hover:bg-white/30 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nou Experiment
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Target className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-blue-600">
              {advancedExperiments.length}
            </span>
          </div>
          <p className="font-medium">Experiments Totals</p>
          <p className="text-sm text-gray-600">+2 aquest mes</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-green-600">87%</span>
          </div>
          <p className="font-medium">Significància Mitjana</p>
          <p className="text-sm text-gray-600">Confiança estadística</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-purple-600">12</span>
          </div>
          <p className="font-medium">Col·laboradors</p>
          <p className="text-sm text-gray-600">Equip multidisciplinar</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <BookOpen className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-orange-600">156</span>
          </div>
          <p className="font-medium">Templates</p>
          <p className="text-sm text-gray-600">Sector públic</p>
        </div>
      </div>

      {/* Filtros y Acciones Principales */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estat</label>
              <select 
                className="p-2 border border-gray-300 rounded-lg"
                value={experimentFilter}
                onChange={(e) => setExperimentFilter(e.target.value)}
              >
                <option value="all">Tots els experiments</option>
                <option value="running">En execució</option>
                <option value="completed">Completats</option>
                <option value="paused">Pausats</option>
                <option value="draft">Esborradors</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipus</label>
              <select 
                className="p-2 border border-gray-300 rounded-lg"
                value={experimentTypeFilter}
                onChange={(e) => setExperimentTypeFilter(e.target.value)}
              >
                <option value="all">Tots els tipus</option>
                <option value="ab">A/B Testing</option>
                <option value="multivariate">Multivariat</option>
                <option value="factorial">Factorial</option>
                <option value="sequential">Seqüencial</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTemplatesModal(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Templates
            </button>
            <button
              onClick={() => setShowComparisonModal(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <BarChart className="w-4 h-4" />
              Comparar
            </button>
            <button
              onClick={() => setShowCollaborationModal(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Equip
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Experimentos Avanzados */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Experiments Actius
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {advancedExperiments.map(experiment => (
            <div key={experiment.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-lg">{experiment.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      experiment.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      experiment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      experiment.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Confiança: {experiment.confidenceLevel}%
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{experiment.hypothesis}</p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Participants</p>
                      <p className="font-semibold">{experiment.participants.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Progrés</p>
                      <p className="font-semibold">{experiment.progress}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Significància</p>
                      <p className="font-semibold">{(experiment.statisticalSignificance * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Mètrica Primària</p>
                      <p className="font-semibold">{experiment.metrics.primary.current}</p>
                    </div>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${experiment.progress}%` }}
                    />
                  </div>
                  
                  {/* Variantes */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-600">Variantes:</span>
                    {Object.entries(experiment.variants).map(([key, variant]: [string, any]) => (
                      <div key={key} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">{variant.name}</span>
                        <span className="text-xs text-gray-500">({variant.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-6">
                  <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    onClick={() => {
                      setSelectedExperiment(experiment);
                      setShowExperimentDetailsModal(true);
                    }}
                  >
                    Detalls
                  </button>
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    onClick={() => {
                      setSelectedExperiment(experiment);
                      setShowStatisticalAnalysisModal(true);
                    }}
                  >
                    Anàlisi
                  </button>
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    onClick={() => {
                      setSelectedExperiment(experiment);
                      setShowDocumentationModal(true);
                    }}
                  >
                    Docs
                  </button>
                </div>
              </div>
              
              {/* Métricas secundarias */}
              <div className="grid grid-cols-3 gap-4">
                {experiment.metrics.secondary.map((metric: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600 capitalize">
                        {metric.name.replace('_', ' ')}
                      </p>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-semibold">{metric.current}</span>
                      <span className="text-xs text-gray-500">vs {metric.baseline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setShowExperimentWizardModal(true)}
          className="bg-white border-2 border-dashed border-blue-300 rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
        >
          <Plus className="w-8 h-8 text-blue-400 group-hover:text-blue-500 mx-auto mb-2" />
          <p className="font-medium text-blue-600">Crear Experiment</p>
          <p className="text-sm text-gray-500 mt-1">Wizard guiat A/B/C</p>
        </button>
        
        <button
          onClick={() => setShowTemplatesModal(true)}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="font-medium">Templates</p>
          <p className="text-sm text-gray-500 mt-1">Sector públic</p>
        </button>
        
        <button
          onClick={() => setShowStatisticalAnalysisModal(true)}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <BarChart className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="font-medium">Anàlisi Estadístic</p>
          <p className="text-sm text-gray-500 mt-1">Visualització avançada</p>
        </button>
        
        <button
          onClick={() => setShowReportsModal(true)}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <FileText className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="font-medium">Reportes</p>
          <p className="text-sm text-gray-500 mt-1">Recomanacions IA</p>
        </button>
      </div>
    </div>
  )
}