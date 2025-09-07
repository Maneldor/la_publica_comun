import { create } from 'zustand'
import { fetchEmpresaData, fetchRealTimeStats, subscribeToRealTimeUpdates, type EmpresaData } from '../services/empresaService'

interface EmpresaState {
  // Data State
  empresaData: EmpresaData | null
  realTimeStats: any
  
  // UI State
  activeSection: string
  loading: boolean
  error: string | null
  refreshing: boolean
  
  // Notifications & Chat
  notifications: number
  showAIChat: boolean
  chatMessage: string
  
  // Interactive State
  showTooltip: string
  chartPeriod: string
  hoveredMetric: string
  
  // Actions
  setActiveSection: (section: string) => void
  setShowAIChat: (show: boolean) => void
  setChatMessage: (message: string) => void
  setNotifications: (count: number) => void
  setShowTooltip: (tooltip: string) => void
  setChartPeriod: (period: string) => void
  setHoveredMetric: (metric: string) => void
  
  // Async Actions
  loadEmpresaData: () => Promise<void>
  loadRealTimeStats: () => Promise<void>
  refreshData: () => Promise<void>
  initializeRealTimeUpdates: (empresaId: string) => () => void
}

export const useEmpresaStore = create<EmpresaState>()((set, get) => ({
  // Initial State
  empresaData: null,
  realTimeStats: null,
  activeSection: 'dashboard',
  loading: false,
  error: null,
  refreshing: false,
  notifications: 3,
  showAIChat: false,
  chatMessage: '',
  showTooltip: '',
  chartPeriod: '30D',
  hoveredMetric: '',
  
  // UI Actions
  setActiveSection: (section) => set({ activeSection: section }),
  setShowAIChat: (show) => set({ showAIChat: show }),
  setChatMessage: (message) => set({ chatMessage: message }),
  setNotifications: (count) => set({ notifications: count }),
  setShowTooltip: (tooltip) => set({ showTooltip: tooltip }),
  setChartPeriod: (period) => set({ chartPeriod: period }),
  setHoveredMetric: (metric) => set({ hoveredMetric: metric }),
  
  // Data Actions
  loadEmpresaData: async () => {
    try {
      set({ loading: true, error: null })
      
      // Mock data preservando el contenido original
      const mockData: EmpresaData = {
        empresa: {
          id: 'empresa-001',
          nombre: 'TechSolutions Barcelona S.L.',
          sector: 'Tecnología',
          plan: 'Premium Enterprise',
          planExpiry: new Date(),
          billingCycle: 'yearly',
          gestorComercial: {
            id: 'gest-001',
            nombre: 'Maria González',
            email: 'maria@lapublica.cat',
            availability: 'Disponible'
          }
        },
        metrics: {
          ofertes: { actives: 47, limit: 100, progress: 47, trend: 12 },
          visualitzacions: { total: 24650, thisMonth: 8000, growth: 15, dailyAverage: 267, sources: { organic: 35, direct: 25, social: 20, referral: 20 } },
          clicks: { total: 2000, conversion: 8.5, growth: 22, bounceRate: 35 },
          comunitats: { actives: 12, total: 17, top: ['Catalunya', 'Madrid', 'Andalusia'], performance: { Catalunya: 85, Madrid: 72, Andalusia: 68 } },
          pipeline: { pending: 8, inReview: 15, approved: 32, rejected: 3 }
        },
        alerts: [],
        performance: {
          weeklyTrend: [500, 600, 750, 800, 900, 850, 950],
          monthlyTrend: Array(30).fill(0).map((_, i) => Math.floor(Math.sin(i + 1) * 1000 + 1500)),
          bestPerformingOffer: { title: 'Desenvolupador Senior React', views: 3500, clicks: 280, applications: 45 }
        }
      }
      
      set({ empresaData: mockData, notifications: 0 })
    } catch (error) {
      console.error('Error loading empresa data:', error)
      set({ error: 'Error carregant dades' })
    } finally {
      set({ loading: false })
    }
  },
  
  loadRealTimeStats: async () => {
    try {
      const stats = await fetchRealTimeStats('empresa-001')
      set({ realTimeStats: stats })
    } catch (error) {
      console.error('Error loading real-time stats:', error)
    }
  },
  
  refreshData: async () => {
    set({ refreshing: true })
    await Promise.all([get().loadEmpresaData(), get().loadRealTimeStats()])
    set({ refreshing: false })
  },
  
  initializeRealTimeUpdates: (empresaId: string) => {
    const unsubscribe = subscribeToRealTimeUpdates(empresaId, (update) => {
      console.log('Real-time update:', update)
      if (update.type === 'view' || update.type === 'click') {
        get().loadRealTimeStats()
      }
    })
    
    return unsubscribe
  }
}))