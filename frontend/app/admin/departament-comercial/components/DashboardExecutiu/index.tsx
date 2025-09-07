'use client'

import { useState } from 'react'
import { 
  BarChart3, TrendingUp, DollarSign, Target, MapPin, Building2,
  Users, Bot, FileText, AlertTriangle, CheckCircle, Clock,
  ArrowUp, ArrowDown, Activity, Star, Award, Calendar,
  Eye, Download, Filter, RefreshCw, Zap, Shield, Scale,
  CreditCard, TrendingDown, Brain, Briefcase, Phone
} from 'lucide-react'

interface ForecastRegional {
  regio: string
  ventesActuals: number
  objectiu: number
  forecast: number
  confiança: number
  tendencia: 'alcista' | 'baixista' | 'estable'
  factors: string[]
  risc: 'baix' | 'mitjà' | 'alt'
}

interface SegmentClient {
  segment: string
  clients: number
  pipeline: number
  conversio: number
  ticketPromig: number
  ltv: number
  churnRisk: number
  oportunitats: number
}

interface MetricaExecutiva {
  nom: string
  valor: number
  objectiu: number
  variacio: number
  tendencia: 'alcista' | 'baixista' | 'estable'
  estat: 'excel·lent' | 'bo' | 'atencio' | 'crític'
}

interface LicitacioActiva {
  id: string
  nom: string
  organisme: string
  comunitat: string
  valor: number
  dataLimit: Date
  estat: 'preparacio' | 'enviada' | 'avaluacio' | 'adjudicada' | 'perduda'
  probabilitat: number
  documentsPendents: number
}

export default function DashboardExecutiu() {
  const [periodeSeleccionat, setPeriodeSeleccionat] = useState('mes_actual')
  const [vistaDetall, setVistaDetall] = useState<string | null>(null)
  const [showForecastDetall, setShowForecastDetall] = useState(false)
  const [showLicitacionsModal, setShowLicitacionsModal] = useState(false)

  const forecastsRegionals: ForecastRegional[] = [
    {
      regio: 'Catalunya',
      ventesActuals: 2450000,
      objectiu: 2800000,
      forecast: 2950000,
      confiança: 87,
      tendencia: 'alcista',
      factors: ['Noves licitacions', 'Creixement PYMES', 'IA adoption'],
      risc: 'baix'
    },
    {
      regio: 'Madrid',
      ventesActuals: 1850000,
      objectiu: 2200000,
      forecast: 2150000,
      confiança: 82,
      tendencia: 'estable',
      factors: ['Estabilitat administració', 'Competència elevada'],
      risc: 'mitjà'
    },
    {
      regio: 'Valencia',
      ventesActuals: 980000,
      objectiu: 1200000,
      forecast: 1180000,
      confiança: 79,
      tendencia: 'alcista',
      factors: ['Nous projectes digitals', 'Expansió territorial'],
      risc: 'baix'
    },
    {
      regio: 'Andalucía',
      ventesActuals: 750000,
      objectiu: 1100000,
      forecast: 890000,
      confiança: 65,
      tendencia: 'baixista',
      factors: ['Retards pressupostaris', 'Canvis polítics'],
      risc: 'alt'
    },
    {
      regio: 'País Basc',
      ventesActuals: 1200000,
      objectiu: 1400000,
      forecast: 1520000,
      confiança: 91,
      tendencia: 'alcista',
      factors: ['Digitalització accelerada', 'Pressupost elevat'],
      risc: 'baix'
    }
  ]

  const segmentsClients: SegmentClient[] = [
    {
      segment: 'Administracions Locals',
      clients: 45,
      pipeline: 3200000,
      conversio: 68,
      ticketPromig: 85000,
      ltv: 340000,
      churnRisk: 12,
      oportunitats: 23
    },
    {
      segment: 'Administracions Autonòmiques',
      clients: 12,
      pipeline: 4800000,
      conversio: 45,
      ticketPromig: 285000,
      ltv: 1200000,
      churnRisk: 8,
      oportunitats: 8
    },
    {
      segment: 'Empreses Grans (>500)',
      clients: 28,
      pipeline: 2900000,
      conversio: 72,
      ticketPromig: 125000,
      ltv: 580000,
      churnRisk: 15,
      oportunitats: 18
    },
    {
      segment: 'PYMES (50-500)',
      clients: 89,
      pipeline: 1800000,
      conversio: 85,
      ticketPromig: 45000,
      ltv: 180000,
      churnRisk: 22,
      oportunitats: 67
    },
    {
      segment: 'Startups Tech',
      clients: 34,
      pipeline: 850000,
      conversio: 78,
      ticketPromig: 25000,
      ltv: 95000,
      churnRisk: 35,
      oportunitats: 45
    }
  ]

  const metriquesExecutives: MetricaExecutiva[] = [
    { nom: 'Ingressos Totals', valor: 8130000, objectiu: 7500000, variacio: 18.4, tendencia: 'alcista', estat: 'excel·lent' },
    { nom: 'Pipeline Global', valor: 13550000, objectiu: 12000000, variacio: 12.9, tendencia: 'alcista', estat: 'bo' },
    { nom: 'Conversió Mitjana', valor: 24.8, objectiu: 22.0, variacio: 12.7, tendencia: 'alcista', estat: 'excel·lent' },
    { nom: 'Temps Cicle Venda', valor: 45, objectiu: 42, variacio: -7.1, tendencia: 'baixista', estat: 'atencio' },
    { nom: 'Customer Health Score', valor: 78, objectiu: 80, variacio: -2.5, tendencia: 'baixista', estat: 'atencio' },
    { nom: 'NPS Comercial', valor: 67, objectiu: 70, variacio: -4.3, tendencia: 'baixista', estat: 'atencio' },
    { nom: 'ROI Marketing', valor: 187, objectiu: 150, variacio: 24.7, tendencia: 'alcista', estat: 'excel·lent' },
    { nom: 'Cost Adquisició', valor: 2850, objectiu: 3200, variacio: 10.9, tendencia: 'alcista', estat: 'bo' }
  ]

  const licitacionsActives: LicitacioActiva[] = [
    {
      id: '1',
      nom: 'Modernització Administració Digital',
      organisme: 'Generalitat Catalunya',
      comunitat: 'Catalunya',
      valor: 850000,
      dataLimit: new Date('2024-02-15'),
      estat: 'preparacio',
      probabilitat: 75,
      documentsPendents: 3
    },
    {
      id: '2',
      nom: 'Sistema IA Atenció Ciutadana',
      organisme: 'Ajuntament Madrid',
      comunitat: 'Madrid',
      valor: 420000,
      dataLimit: new Date('2024-02-08'),
      estat: 'enviada',
      probabilitat: 65,
      documentsPendents: 0
    },
    {
      id: '3',
      nom: 'Automatització Tràmits',
      organisme: 'Diputació Barcelona',
      comunitat: 'Catalunya',
      valor: 320000,
      dataLimit: new Date('2024-02-20'),
      estat: 'avaluacio',
      probabilitat: 45,
      documentsPendents: 1
    }
  ]

  const alertesExecutives = [
    { tipus: 'crític', missatge: 'Andalucía: Risc alt de no assolir objectius Q1', accio: 'Revisar estratègia' },
    { tipus: 'atencio', missatge: 'Temps cicle venda augmentant 7% vs objectiu', accio: 'Optimitzar processos' },
    { tipus: 'oportunitat', missatge: '3 licitacions >€300K amb alta probabilitat', accio: 'Accelerar preparació' },
    { tipus: 'atencio', missatge: 'Customer Health Score baixant en PYMES', accio: 'Revisar onboarding' }
  ]

  const calcularForecastTotal = () => {
    return forecastsRegionals.reduce((sum, f) => sum + f.forecast, 0)
  }

  const calcularConfiancaMitjana = () => {
    return Math.round(forecastsRegionals.reduce((sum, f) => sum + f.confiança, 0) / forecastsRegionals.length)
  }

  const getColorEstat = (estat: string) => {
    switch (estat) {
      case 'excel·lent': return 'text-green-600'
      case 'bo': return 'text-blue-600'
      case 'atencio': return 'text-yellow-600'
      case 'crític': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getColorAlerta = (tipus: string) => {
    switch (tipus) {
      case 'crític': return 'bg-red-50 border-red-200 text-red-700'
      case 'atencio': return 'bg-yellow-50 border-yellow-200 text-yellow-700'
      case 'oportunitat': return 'bg-green-50 border-green-200 text-green-700'
      default: return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header executiu */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Dashboard Executiu</h2>
            <p className="text-blue-100 mt-1">Visió integral del rendiment comercial amb forecasting avançat</p>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={periodeSeleccionat}
              onChange={(e) => setPeriodeSeleccionat(e.target.value)}
              className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg text-white border-0"
            >
              <option value="mes_actual" className="text-gray-900">Mes Actual</option>
              <option value="trimestre" className="text-gray-900">Trimestre</option>
              <option value="any" className="text-gray-900">Any Complet</option>
              <option value="previsio" className="text-gray-900">Previsió 6M</option>
            </select>
            <button className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPIs principals */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+18.4%</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">€8.13M</div>
          <div className="text-gray-600 text-sm">Ingressos YTD</div>
          <div className="text-xs text-gray-500 mt-1">Objectiu: €7.5M</div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-blue-600 font-medium">+12.9%</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">€13.6M</div>
          <div className="text-gray-600 text-sm">Pipeline Total</div>
          <div className="text-xs text-gray-500 mt-1">Obj: €12M • {calcularConfiancaMitjana()}% confiança</div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">€{(calcularForecastTotal() / 1000000).toFixed(1)}M</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{calcularConfiancaMitjana()}%</div>
          <div className="text-gray-600 text-sm">Confiança Forecast</div>
          <div className="text-xs text-gray-500 mt-1">Machine Learning + Historial</div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Scale className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-orange-600 font-medium">{licitacionsActives.length} actives</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            €{(licitacionsActives.reduce((sum, l) => sum + l.valor, 0) / 1000000).toFixed(1)}M
          </div>
          <div className="text-gray-600 text-sm">Licitacions Pipeline</div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(licitacionsActives.reduce((sum, l) => sum + l.probabilitat, 0) / licitacionsActives.length)}% prob. mitjana
          </div>
        </div>
      </div>

      {/* Alertes executives */}
      {alertesExecutives.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Alertes Executives</h3>
          <div className="space-y-3">
            {alertesExecutives.map((alerta, i) => (
              <div key={i} className={`border rounded-lg p-3 ${getColorAlerta(alerta.tipus)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {alerta.tipus === 'crític' && <AlertTriangle className="w-5 h-5" />}
                    {alerta.tipus === 'atencio' && <Clock className="w-5 h-5" />}
                    {alerta.tipus === 'oportunitat' && <TrendingUp className="w-5 h-5" />}
                    <span className="font-medium">{alerta.missatge}</span>
                  </div>
                  <button className="px-3 py-1 bg-white/50 rounded text-sm hover:bg-white/70">
                    {alerta.accio}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Forecast regional i segments */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Forecasting per Regions</h3>
            <button 
              onClick={() => setShowForecastDetall(true)}
              className="text-blue-600 hover:underline text-sm"
            >
              Veure detall
            </button>
          </div>
          
          <div className="space-y-4">
            {forecastsRegionals.map(region => (
              <div key={region.regio} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{region.regio}</h4>
                  <div className="flex items-center gap-2">
                    {region.tendencia === 'alcista' && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {region.tendencia === 'baixista' && <TrendingDown className="w-4 h-4 text-red-500" />}
                    {region.tendencia === 'estable' && <Activity className="w-4 h-4 text-gray-500" />}
                    <span className={`px-2 py-1 rounded text-xs ${
                      region.risc === 'baix' ? 'bg-green-100 text-green-700' :
                      region.risc === 'mitjà' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {region.risc} risc
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Actual</div>
                    <div className="font-semibold">€{(region.ventesActuals / 1000).toFixed(0)}K</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Forecast</div>
                    <div className="font-semibold text-blue-600">€{(region.forecast / 1000).toFixed(0)}K</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Confiança</div>
                    <div className="font-semibold">{region.confiança}%</div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progrés vs objectiu</span>
                    <span>{((region.ventesActuals / region.objectiu) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        region.ventesActuals >= region.objectiu ? 'bg-green-500' : 
                        region.ventesActuals >= region.objectiu * 0.8 ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(100, (region.ventesActuals / region.objectiu) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Segments de Client</h3>
          <div className="space-y-4">
            {segmentsClients.map(segment => (
              <div key={segment.segment} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{segment.segment}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    segment.churnRisk <= 15 ? 'bg-green-100 text-green-700' :
                    segment.churnRisk <= 25 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {segment.churnRisk}% churn risk
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500">Pipeline</div>
                    <div className="font-semibold">€{(segment.pipeline / 1000).toFixed(0)}K</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Conversió</div>
                    <div className="font-semibold">{segment.conversio}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Ticket Mitjà</div>
                    <div className="font-semibold">€{(segment.ticketPromig / 1000).toFixed(0)}K</div>
                  </div>
                  <div>
                    <div className="text-gray-500">LTV</div>
                    <div className="font-semibold">€{(segment.ltv / 1000).toFixed(0)}K</div>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-gray-500">{segment.clients} clients actius</span>
                  <span className="text-blue-600">{segment.oportunitats} oportunitats</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mètriques executives detallades */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Mètriques Executives Clau</h3>
        <div className="grid grid-cols-4 gap-4">
          {metriquesExecutives.map(metrica => (
            <div key={metrica.nom} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{metrica.nom}</h4>
                <span className={`flex items-center gap-1 ${getColorEstat(metrica.estat)}`}>
                  {metrica.variacio > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  <span className="text-xs">{Math.abs(metrica.variacio)}%</span>
                </span>
              </div>
              
              <div className="text-xl font-bold text-gray-900">
                {metrica.nom.includes('€') || metrica.nom.includes('Cost') ? 
                  `€${metrica.valor.toLocaleString()}` :
                  metrica.nom.includes('%') || metrica.nom.includes('ROI') ?
                  `${metrica.valor}%` :
                  metrica.valor.toLocaleString()
                }
              </div>
              
              <div className="text-xs text-gray-500">
                Objectiu: {metrica.nom.includes('€') || metrica.nom.includes('Cost') ? 
                  `€${metrica.objectiu.toLocaleString()}` :
                  metrica.nom.includes('%') || metrica.nom.includes('ROI') ?
                  `${metrica.objectiu}%` :
                  metrica.objectiu.toLocaleString()
                }
              </div>
              
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      metrica.estat === 'excel·lent' ? 'bg-green-500' :
                      metrica.estat === 'bo' ? 'bg-blue-500' :
                      metrica.estat === 'atencio' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (metrica.valor / metrica.objectiu) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Licitacions actives resum */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Licitacions Actives Prioritàries</h3>
          <button 
            onClick={() => setShowLicitacionsModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Gestionar Totes
          </button>
        </div>
        
        <div className="space-y-3">
          {licitacionsActives.slice(0, 3).map(licitacio => {
            const diesRestants = Math.ceil((licitacio.dataLimit.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            return (
              <div key={licitacio.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{licitacio.nom}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        licitacio.estat === 'preparacio' ? 'bg-yellow-100 text-yellow-700' :
                        licitacio.estat === 'enviada' ? 'bg-blue-100 text-blue-700' :
                        licitacio.estat === 'avaluacio' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {licitacio.estat}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Organisme</div>
                        <div className="font-medium">{licitacio.organisme}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Valor</div>
                        <div className="font-medium">€{licitacio.valor.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Probabilitat</div>
                        <div className="font-medium">{licitacio.probabilitat}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Dies restants</div>
                        <div className={`font-medium ${
                          diesRestants <= 3 ? 'text-red-600' :
                          diesRestants <= 7 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {diesRestants}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Documents</div>
                        <div className={`font-medium ${
                          licitacio.documentsPendents > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {licitacio.documentsPendents === 0 ? 'Complet' : `${licitacio.documentsPendents} pendents`}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-blue-100 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal detall forecast */}
      {showForecastDetall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Detall Forecasting per Regions</h3>
              <button onClick={() => setShowForecastDetall(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {forecastsRegionals.map(region => (
                <div key={region.regio} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-4">{region.regio}</h4>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-3">Factors d'Influència:</h5>
                      <ul className="space-y-1">
                        {region.factors.map((factor, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-3">Prediccions Detallades:</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Vendes actuals:</span>
                          <span className="font-medium">€{region.ventesActuals.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Objectiu:</span>
                          <span className="font-medium">€{region.objectiu.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Forecast ML:</span>
                          <span className="font-medium text-blue-600">€{region.forecast.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Diferència:</span>
                          <span className={`font-medium ${
                            region.forecast >= region.objectiu ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {region.forecast >= region.objectiu ? '+' : ''}€{(region.forecast - region.objectiu).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}