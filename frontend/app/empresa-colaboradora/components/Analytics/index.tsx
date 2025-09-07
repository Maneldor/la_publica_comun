'use client'

import { useState, useEffect } from 'react'
import { useTema, useIdioma } from '../../../../hooks/useComunidad'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  MousePointer,
  MapPin,
  Calendar,
  FileBarChart,
  LineChart,
  Filter,
  Download,
  Settings
} from 'lucide-react'

interface MetricaAnalytics {
  nom: string
  valor: number
  canvi: number
  format: 'number' | 'percentage' | 'currency' | 'decimal'
  periode: string
  icon: any
  color: string
}

interface ChartData {
  label: string
  value: number
  change?: number
}

interface AnalyticsData {
  metriquesGeneral: MetricaAnalytics[]
  tendenciesSetmanals: ChartData[]
  tendenciesMensuals: ChartData[]
  rendimentOfertes: {
    id: string
    titol: string
    visualitzacions: number
    aplicacions: number
    ctr: number
    conversion: number
    qualityScore: number
  }[]
  demografiques: {
    ubicacions: { nom: string, percentatge: number }[]
    edats: { rang: string, percentatge: number }[]
    sectors: { nom: string, percentatge: number }[]
  }
  comparatiuCompetencia: {
    metrica: string
    nosaltres: number
    mitjanaMercad: number
    millors: number
  }[]
}

export default function Analytics() {
  const tema = useTema()
  const idioma = useIdioma()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [periodeSelected, setPeriodeSelected] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [metricaSelected, setMetricaSelected] = useState<string>('visualitzacions')
  const [loading, setLoading] = useState(true)
  const [showExportModal, setShowExportModal] = useState(false)

  useEffect(() => {
    // Simular càrrega de dades
    setTimeout(() => {
      setAnalyticsData(generateAnalyticsData())
      setLoading(false)
    }, 1000)
  }, [periodeSelected])

  const generateAnalyticsData = (): AnalyticsData => {
    return {
      metriquesGeneral: [
        {
          nom: 'Total Visualitzacions',
          valor: 847231,
          canvi: 12.5,
          format: 'number',
          periode: '30 dies',
          icon: Eye,
          color: 'blue'
        },
        {
          nom: 'Taxa de Conversió',
          valor: 8.4,
          canvi: -2.1,
          format: 'percentage',
          periode: '30 dies',
          icon: FunnelIcon,
          color: 'green'
        },
        {
          nom: 'Cost per Aplicació',
          valor: 45.67,
          canvi: -15.3,
          format: 'currency',
          periode: '30 dies',
          icon: MousePointer,
          color: 'purple'
        },
        {
          nom: 'CTR Promig',
          valor: 6.8,
          canvi: 23.1,
          format: 'percentage',
          periode: '30 dies',
          icon: TrendingUp,
          color: 'orange'
        },
        {
          nom: 'Qualitat Promig Ofertes',
          valor: 8.9,
          canvi: 5.2,
          format: 'decimal',
          periode: '30 dies',
          icon: BarChart3,
          color: 'indigo'
        },
        {
          nom: 'ROI Campanyes',
          valor: 156.8,
          canvi: 18.9,
          format: 'percentage',
          periode: '30 dies',
          icon: PresentationChartLineIcon,
          color: 'emerald'
        }
      ],
      tendenciesSetmanals: Array.from({ length: 7 }, (_, i) => ({
        label: ['Dl', 'Dm', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'][i],
        value: Math.floor(Math.random() * 5000 + 2000),
        change: Math.random() * 40 - 20
      })),
      tendenciesMensuals: Array.from({ length: 30 }, (_, i) => ({
        label: `${i + 1}`,
        value: Math.floor(Math.random() * 8000 + 1000)
      })),
      rendimentOfertes: Array.from({ length: 12 }, (_, i) => ({
        id: `offer-${i + 1}`,
        titol: [
          'Desenvolupador Senior React',
          'Product Manager Digital', 
          'Data Scientist',
          'DevOps Engineer',
          'UX/UI Designer',
          'Full Stack Developer',
          'Scrum Master',
          'Backend Developer Python',
          'Frontend Developer Vue.js',
          'Cloud Architect',
          'Security Engineer',
          'QA Automation Engineer'
        ][i],
        visualitzacions: Math.floor(Math.random() * 10000 + 1000),
        aplicacions: Math.floor(Math.random() * 100 + 10),
        ctr: Math.random() * 15 + 2,
        conversion: Math.random() * 25 + 5,
        qualityScore: Math.floor(Math.random() * 30 + 70)
      })),
      demografiques: {
        ubicacions: [
          { nom: 'Barcelona', percentatge: 35.2 },
          { nom: 'Madrid', percentatge: 28.7 },
          { nom: 'València', percentatge: 12.1 },
          { nom: 'Sevilla', percentatge: 8.9 },
          { nom: 'Bilbao', percentatge: 7.3 },
          { nom: 'Altres', percentatge: 7.8 }
        ],
        edats: [
          { rang: '18-25', percentatge: 15.2 },
          { rang: '26-35', percentatge: 42.8 },
          { rang: '36-45', percentatge: 28.1 },
          { rang: '46-55', percentatge: 11.3 },
          { rang: '56+', percentatge: 2.6 }
        ],
        sectors: [
          { rang: 'Tecnologia', percentatge: 45.6 },
          { rang: 'Consultoria', percentatge: 23.1 },
          { rang: 'Educació', percentatge: 12.7 },
          { rang: 'Sanitat', percentatge: 8.9 },
          { rang: 'Finances', percentatge: 6.2 },
          { rang: 'Altres', percentatge: 3.5 }
        ]
      },
      comparatiuCompetencia: [
        { metrica: 'Visualitzacions/Oferta', nosaltres: 2847, mitjanaMercad: 1923, millors: 4231 },
        { metrica: 'Taxa Conversió (%)', nosaltres: 8.4, mitjanaMercad: 6.2, millors: 12.1 },
        { metrica: 'Temps Mitjà Contractació', nosaltres: 18, mitjanaMercad: 25, millors: 12 },
        { metrica: 'Qualitat Candidats (Score)', nosaltres: 8.9, mitjanaMercad: 7.1, millors: 9.4 },
        { metrica: 'Cost per Contractació (€)', nosaltres: 1247, mitjanaMercad: 1589, millors: 892 }
      ]
    }
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return `€${value.toFixed(2)}`
      case 'percentage':
        return `${value.toFixed(1)}%`
      case 'decimal':
        return value.toFixed(1)
      default:
        return value.toLocaleString()
    }
  }

  const traduccions = {
    ca: {
      analyticsInformes: "Analytics i Informes",
      visionGeneral: "Visió General",
      rendimentOfertes: "Rendiment d'Ofertes",
      demografiques: "Demografia",
      competencia: "Anàlisi Competència",
      exportar: "Exportar Dades",
      configurar: "Configurar",
      ultims7dies: "Últims 7 dies",
      ultims30dies: "Últims 30 dies",
      ultims90dies: "Últims 90 dies",
      ultimAny: "Últim any",
      visualitzacions: "Visualitzacions",
      aplicacions: "Aplicacions",
      conversio: "Conversió",
      ctr: "CTR",
      qualityScore: "Quality Score",
      ubicacio: "Ubicació",
      edat: "Edat",
      sector: "Sector",
      nosaltres: "Nosaltres",
      mitjana: "Mitjana",
      millors: "Millors",
      tendencies: "Tendències",
      carregant: "Carregant analytics..."
    },
    es: {
      analyticsInformes: "Analytics e Informes",
      visionGeneral: "Visión General",
      rendimentOfertes: "Rendimiento de Ofertas",
      demografiques: "Demografia",
      competencia: "Análisis Competencia",
      exportar: "Exportar Datos",
      configurar: "Configurar",
      ultims7dies: "Últimos 7 días",
      ultims30dies: "Últimos 30 días",
      ultims90dies: "Últimos 90 días",
      ultimAny: "Último año",
      visualitzacions: "Visualizaciones",
      aplicacions: "Aplicaciones",
      conversio: "Conversión",
      ctr: "CTR",
      qualityScore: "Quality Score",
      ubicacio: "Ubicación",
      edat: "Edad",
      sector: "Sector",
      nosaltres: "Nosotros",
      mitjana: "Media",
      millors: "Mejores",
      tendencies: "Tendencias",
      carregant: "Cargando analytics..."
    }
  }

  const t = traduccions[idioma as keyof typeof traduccions] || traduccions.ca

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.carregant}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.analyticsInformes}</h1>
              <p className="text-gray-600">Anàlisi completa del rendiment de les teves ofertes</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={periodeSelected}
                onChange={(e) => setPeriodeSelected(e.target.value as any)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">{t.ultims7dies}</option>
                <option value="30d">{t.ultims30dies}</option>
                <option value="90d">{t.ultims90dies}</option>
                <option value="1y">{t.ultimAny}</option>
              </select>
              <button 
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                {t.exportar}
              </button>
              <button className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
                <Cog6ToothIcon className="w-5 h-5" />
                {t.configurar}
              </button>
            </div>
          </div>
        </div>

        {/* Mètriques Generals */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.visionGeneral}</h2>
          <div className="grid grid-cols-3 gap-6">
            {analyticsData?.metriquesGeneral.map((metrica, index) => (
              <div 
                key={index}
                className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${getColorClasses(metrica.color)}`}>
                    <metrica.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    {metrica.canvi > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${metrica.canvi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(metrica.canvi).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {formatValue(metrica.valor, metrica.format)}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">{metrica.nom}</p>
                  <p className="text-xs text-gray-400">{metrica.periode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gràfic de Tendències */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.tendencies}</h2>
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <select
                  value={metricaSelected}
                  onChange={(e) => setMetricaSelected(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="visualitzacions">{t.visualitzacions}</option>
                  <option value="aplicacions">{t.aplicacions}</option>
                  <option value="conversio">{t.conversio}</option>
                  <option value="ctr">{t.ctr}</option>
                </select>
              </div>
            </div>
            
            {/* Simulació de gràfic */}
            <div className="h-64 flex items-end justify-between gap-2">
              {analyticsData?.tendenciesMensuals.slice(0, 15).map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-400"
                    style={{ height: `${(data.value / 8000) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{data.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rendiment d'Ofertes */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.rendimentOfertes}</h2>
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Oferta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.visualitzacions}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.aplicacions}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CTR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.conversio}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quality Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analyticsData?.rendimentOfertes.slice(0, 8).map((oferta) => (
                    <tr key={oferta.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{oferta.titol}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {oferta.visualitzacions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {oferta.aplicacions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">
                          {oferta.ctr.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-green-600">
                          {oferta.conversion.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{oferta.qualityScore}</span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                              style={{ width: `${oferta.qualityScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Demografia + Competència */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Demografia */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.demografiques}</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">{t.ubicacio}</h4>
                <div className="space-y-2">
                  {analyticsData?.demografiques.ubicacions.map((ubicacio, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{ubicacio.nom}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${ubicacio.percentatge}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {ubicacio.percentatge}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">{t.edat}</h4>
                <div className="space-y-2">
                  {analyticsData?.demografiques.edats.map((edat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{edat.rang}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(edat.percentatge / 50) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {edat.percentatge}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Anàlisi Competència */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.competencia}</h3>
            
            <div className="space-y-4">
              {analyticsData?.comparatiuCompetencia.map((comp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">{comp.metrica}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-blue-600 font-semibold text-lg">{comp.nosaltres.toLocaleString()}</div>
                      <div className="text-gray-500">{t.nosaltres}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600 font-semibold text-lg">{comp.mitjanaMercad.toLocaleString()}</div>
                      <div className="text-gray-500">{t.mitjana}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-600 font-semibold text-lg">{comp.millors.toLocaleString()}</div>
                      <div className="text-gray-500">{t.millors}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}