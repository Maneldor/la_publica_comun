'use client'

import { useState } from 'react'
import { 
  FileText, Archive, Target, GitBranch, Globe, Package, Settings, Plus, 
  BarChart, Users, Zap, Shield, Activity, AlertTriangle, ChevronRight 
} from 'lucide-react'

interface PromptCategory {
  id: string
  name: string
  community: string
  prompts: number
  avgEffectiveness: number
  useCases: string[]
  color: string
}

interface AbTest {
  id: string
  name: string
  status: 'running' | 'completed' | 'paused'
  sampleSize: number
  confidenceLevel: number
  community: string
  results: {
    variantA: { effectiveness: number }
    variantB: { effectiveness: number }
    winner: string
    statisticalSignificance: number
  }
}

interface PromptVariant {
  id: string
  testingStatus: 'draft' | 'testing' | 'production'
}

interface PromptAnalytics {
  usagePatterns: any[]
  lowPerformance: any[]
  multilingual: {
    languages: string[]
    translationQuality: { [key: string]: number }
  }
}

interface UserProfile {
  id: string
  name: string
}

interface PromptsProps {
  promptCategories: PromptCategory[]
  abTests: AbTest[]
  promptVariants: PromptVariant[]
  promptAnalytics: PromptAnalytics
  userProfiles: UserProfile[]
  
  // Modal state setters
  setShowPromptCategoriesModal: (show: boolean) => void
  setShowAbTestingModal: (show: boolean) => void
  setShowPromptAnalyticsModal: (show: boolean) => void
  setShowAdaptivePromptsModal: (show: boolean) => void
  setShowVariantGeneratorModal: (show: boolean) => void
  setShowRobustnessTestModal: (show: boolean) => void
  setShowUsagePatternsModal: (show: boolean) => void
  setShowLowPerformanceModal: (show: boolean) => void
  setShowMultilingualModal: (show: boolean) => void
  setShowCollaborativeModal: (show: boolean) => void
  
  // Selected items setters
  setSelectedPromptCategory: (category: PromptCategory | null) => void
  setSelectedAbTest: (test: AbTest | null) => void
}

export default function Prompts({
  promptCategories,
  abTests,
  promptVariants,
  promptAnalytics,
  userProfiles,
  setShowPromptCategoriesModal,
  setShowAbTestingModal,
  setShowPromptAnalyticsModal,
  setShowAdaptivePromptsModal,
  setShowVariantGeneratorModal,
  setShowRobustnessTestModal,
  setShowUsagePatternsModal,
  setShowLowPerformanceModal,
  setShowMultilingualModal,
  setShowCollaborativeModal,
  setSelectedPromptCategory,
  setSelectedAbTest
}: PromptsProps) {
  
  return (
    <div className="space-y-6">
      {/* Header del Sistema de Prompts Empresarial */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Gestión Empresarial de Prompts</h2>
            <p className="text-purple-100">Sistema avanzado de optimización y gestión de prompts para el sector público</p>
          </div>
          <FileText className="w-12 h-12 text-purple-200" />
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Prompts</p>
              <p className="text-2xl font-bold">{promptCategories.reduce((sum, cat) => sum + cat.prompts, 0)}</p>
              <p className="text-xs text-blue-200">
                Efectividad: {(promptCategories.reduce((sum, cat) => sum + cat.avgEffectiveness, 0) / promptCategories.length).toFixed(1)}%
              </p>
            </div>
            <Archive className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Tests A/B Activos</p>
              <p className="text-2xl font-bold">{abTests.filter(test => test.status === 'running').length}</p>
              <p className="text-xs text-green-200">
                {abTests.filter(test => test.status === 'completed').length} completados
              </p>
            </div>
            <Target className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Variantes Generadas</p>
              <p className="text-2xl font-bold">{promptVariants.length}</p>
              <p className="text-xs text-orange-200">
                {promptVariants.filter(v => v.testingStatus === 'production').length} en producción
              </p>
            </div>
            <GitBranch className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100">Idiomas Soportados</p>
              <p className="text-2xl font-bold">{promptAnalytics.multilingual.languages.length}</p>
              <p className="text-xs text-indigo-200">
                Calidad promedio: {(Object.values(promptAnalytics.multilingual.translationQuality).reduce((a, b) => a + b, 0) / Object.keys(promptAnalytics.multilingual.translationQuality).length).toFixed(1)}%
              </p>
            </div>
            <Globe className="w-8 h-8 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Categorización por Casos de Uso y Comunidades */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            Categorización por Casos de Uso y Comunidades Autónomas
          </h3>
          <button 
            onClick={() => setShowPromptCategoriesModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Gestionar Categorías
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {promptCategories.map(category => (
            <div key={category.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                 onClick={() => {
                   setSelectedPromptCategory(category);
                   setShowPromptCategoriesModal(true);
                 }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{category.name}</h4>
                <div className={`w-3 h-3 rounded-full bg-${category.color}-500`}></div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Comunidad:</span>
                  <span className="font-medium">{category.community}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prompts:</span>
                  <span className="font-medium">{category.prompts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Efectividad:</span>
                  <span className="text-green-600 font-medium">{category.avgEffectiveness}%</span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-1">Casos de uso:</p>
                <div className="flex flex-wrap gap-1">
                  {category.useCases.slice(0, 2).map(useCase => (
                    <span key={useCase} className="px-2 py-1 bg-gray-100 text-xs rounded">
                      {useCase}
                    </span>
                  ))}
                  {category.useCases.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                      +{category.useCases.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* A/B Testing Automático */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            A/B Testing Automático entre Variantes
          </h3>
          <button 
            onClick={() => setShowAbTestingModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Test A/B
          </button>
        </div>
        <div className="space-y-4">
          {abTests.slice(0, 2).map(test => (
            <div key={test.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                 onClick={() => {
                   setSelectedAbTest(test);
                   setShowAbTestingModal(true);
                 }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{test.name}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  test.status === 'running' ? 'bg-blue-100 text-blue-800' :
                  test.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {test.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Tamaño Muestra</p>
                  <p className="font-medium">{test.sampleSize.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Confianza</p>
                  <p className="font-medium">{test.confidenceLevel}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Comunidad</p>
                  <p className="font-medium">{test.community}</p>
                </div>
              </div>
              {test.status === 'completed' && (
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Variante A</p>
                    <p className="font-medium">{test.results.variantA.effectiveness}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Variante B</p>
                    <p className="font-medium">{test.results.variantB.effectiveness}%</p>
                  </div>
                  <div className="col-span-2 text-center">
                    <p className="text-sm font-medium text-green-600">
                      Ganador: Variante {test.results.winner} 
                      ({test.results.statisticalSignificance}% significancia)
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Grid de funcionalidades avanzadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Métricas de Efectividad */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setShowPromptAnalyticsModal(true)}>
          <div className="flex items-center justify-between mb-3">
            <BarChart className="w-8 h-8 text-blue-500" />
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <h4 className="font-medium mb-2">Métricas por Contexto</h4>
          <p className="text-sm text-gray-600 mb-3">Análisis de efectividad por contexto de uso</p>
          <div className="text-xs text-blue-600">
            {promptAnalytics.usagePatterns.length} patrones identificados
          </div>
        </div>

        {/* Prompts Adaptativos */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setShowAdaptivePromptsModal(true)}>
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-purple-500" />
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <h4 className="font-medium mb-2">Prompts Adaptativos</h4>
          <p className="text-sm text-gray-600 mb-3">Adaptación según perfil de usuario</p>
          <div className="text-xs text-purple-600">
            {userProfiles.length} perfiles configurados
          </div>
        </div>

        {/* Generador de Variantes */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setShowVariantGeneratorModal(true)}>
          <div className="flex items-center justify-between mb-3">
            <Zap className="w-8 h-8 text-yellow-500" />
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <h4 className="font-medium mb-2">Generador de Variantes</h4>
          <p className="text-sm text-gray-600 mb-3">Generación automática de variantes</p>
          <div className="text-xs text-yellow-600">
            IA optimizada para sector público
          </div>
        </div>

        {/* Testing de Robustez */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setShowRobustnessTestModal(true)}>
          <div className="flex items-center justify-between mb-3">
            <Shield className="w-8 h-8 text-red-500" />
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <h4 className="font-medium mb-2">Testing Robustez</h4>
          <p className="text-sm text-gray-600 mb-3">Pruebas contra edge cases</p>
          <div className="text-xs text-red-600">
            Protección automática habilitada
          </div>
        </div>

        {/* Analytics de Patrones */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setShowUsagePatternsModal(true)}>
          <div className="flex items-center justify-between mb-3">
            <Activity className="w-8 h-8 text-green-500" />
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <h4 className="font-medium mb-2">Patrones de Uso</h4>
          <p className="text-sm text-gray-600 mb-3">Analytics avanzados de uso</p>
          <div className="text-xs text-green-600">
            Monitoreo en tiempo real
          </div>
        </div>

        {/* Identificación Bajo Rendimiento */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setShowLowPerformanceModal(true)}>
          <div className="flex items-center justify-between mb-3">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <h4 className="font-medium mb-2">Bajo Rendimiento</h4>
          <p className="text-sm text-gray-600 mb-3">Identificación automática de problemas</p>
          <div className="text-xs text-orange-600">
            {promptAnalytics.lowPerformance.length} prompts requieren atención
          </div>
        </div>

        {/* Multiidioma */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setShowMultilingualModal(true)}>
          <div className="flex items-center justify-between mb-3">
            <Globe className="w-8 h-8 text-indigo-500" />
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <h4 className="font-medium mb-2">Sistema Multiidioma</h4>
          <p className="text-sm text-gray-600 mb-3">Traducción automática avanzada</p>
          <div className="text-xs text-indigo-600">
            {promptAnalytics.multilingual.languages.length} idiomas activos
          </div>
        </div>

        {/* Sistema Colaborativo */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => setShowCollaborativeModal(true)}>
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-teal-500" />
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <h4 className="font-medium mb-2">Sistema Colaborativo</h4>
          <p className="text-sm text-gray-600 mb-3">Aprobación para prompts críticos</p>
          <div className="text-xs text-teal-600">
            Flujo de trabajo regulado
          </div>
        </div>
      </div>
    </div>
  )
}