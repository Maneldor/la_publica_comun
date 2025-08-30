'use client'

import { useState } from 'react'
import { 
  CreditCard,
  Euro,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Mail,
  Plus,
  Filter,
  Search,
  Calendar,
  ArrowUp,
  ArrowDown,
  PieChart,
  BarChart3,
  DollarSign
} from 'lucide-react'

// Función para formatear números de manera consistente
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-ES').format(num)
}

type FacturaGeneral = {
  id: string
  numeroFactura: string
  tipus: 'ingrés' | 'despesa'
  proveidor: string
  concepte: string
  dataEmissio: string
  dataVenciment: string
  dataPagament?: string
  import: number
  estat: 'pendent' | 'pagada' | 'vencida' | 'cancel·lada'
  categoria: string
  metodePagament?: string
  observacions?: string
}

type MovimentContable = {
  id: string
  data: string
  tipus: 'ingrés' | 'despesa'
  categoria: string
  concepte: string
  import: number
  referencia?: string
  estat: 'processat' | 'pendent'
}

export default function AdminFacturacio() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'factures' | 'moviments' | 'informes'>('dashboard')
  
  // Datos mock de factures
  const [factures] = useState<FacturaGeneral[]>([
    {
      id: '1',
      numeroFactura: 'ING-2024-001',
      tipus: 'ingrés',
      proveidor: 'TechSolutions BCN',
      concepte: 'Suscripció Premium - Novembre 2024',
      dataEmissio: '2024-11-01',
      dataVenciment: '2024-11-30',
      dataPagament: '2024-11-15',
      import: 199,
      estat: 'pagada',
      categoria: 'Suscripcions',
      metodePagament: 'Domiciliació bancària'
    },
    {
      id: '2',
      numeroFactura: 'DESP-2024-001',
      tipus: 'despesa',
      proveidor: 'AWS Europe',
      concepte: 'Hosting i infraestructura - Novembre 2024',
      dataEmissio: '2024-11-01',
      dataVenciment: '2024-11-15',
      dataPagament: '2024-11-10',
      import: 2340,
      estat: 'pagada',
      categoria: 'Infraestructura',
      metodePagament: 'Transferència bancària'
    },
    {
      id: '3',
      numeroFactura: 'DESP-2024-002',
      tipus: 'despesa',
      proveidor: 'FreelanceDev S.L.',
      concepte: 'Desenvolupament frontend - Novembre 2024',
      dataEmissio: '2024-11-01',
      dataVenciment: '2024-11-30',
      import: 8500,
      estat: 'pendent',
      categoria: 'Desenvolupament',
    },
    {
      id: '4',
      numeroFactura: 'ING-2024-002',
      tipus: 'ingrés',
      proveidor: 'ConsultPro Madrid',
      concepte: 'Suscripció Professional - Novembre 2024',
      dataEmissio: '2024-11-01',
      dataVenciment: '2024-11-30',
      import: 99,
      estat: 'vencida',
      categoria: 'Suscripcions'
    }
  ])

  // Datos mock de movimientos
  const [moviments] = useState<MovimentContable[]>([
    {
      id: '1',
      data: '2024-11-15',
      tipus: 'ingrés',
      categoria: 'Suscripcions Premium',
      concepte: 'Pagament TechSolutions BCN',
      import: 199,
      referencia: 'TRF-001',
      estat: 'processat'
    },
    {
      id: '2',
      data: '2024-11-10',
      tipus: 'despesa',
      categoria: 'Infraestructura',
      concepte: 'AWS Hosting',
      import: 2340,
      referencia: 'AWS-NOV',
      estat: 'processat'
    },
    {
      id: '3',
      data: '2024-11-20',
      tipus: 'ingrés',
      categoria: 'Suscripcions Professional',
      concepte: 'Pagament múltiples empreses',
      import: 1485,
      referencia: 'BATCH-001',
      estat: 'processat'
    }
  ])

  // Estadístiques
  const stats = {
    ingressosMes: factures.filter(f => f.tipus === 'ingrés' && f.estat === 'pagada').reduce((sum, f) => sum + f.import, 0),
    despesesMes: factures.filter(f => f.tipus === 'despesa' && f.estat === 'pagada').reduce((sum, f) => sum + f.import, 0),
    facturesPendents: factures.filter(f => f.estat === 'pendent').length,
    facturesVencides: factures.filter(f => f.estat === 'vencida').length,
    beneficiNet: 0,
    taxaCobrament: 94.2
  }

  stats.beneficiNet = stats.ingressosMes - stats.despesesMes

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Facturació i Comptabilitat</h1>
              <p className="text-sm text-gray-600 mt-1">Control comptable general de la plataforma</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Nova Factura
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'factures', label: 'Factures', icon: CreditCard },
              { id: 'moviments', label: 'Moviments', icon: TrendingUp },
              { id: 'informes', label: 'Informes', icon: PieChart }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Estadístiques principals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ingressos Mensuals</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">€{formatNumber(stats.ingressosMes)}</p>
                    <p className="text-xs text-green-600 mt-2">
                      <ArrowUp className="w-3 h-3 inline" />
                      +18% vs mes anterior
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Despeses Mensuals</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">€{formatNumber(stats.despesesMes)}</p>
                    <p className="text-xs text-red-600 mt-2">
                      <ArrowUp className="w-3 h-3 inline" />
                      +5% vs mes anterior
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <ArrowDown className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Benefici Net</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      €{formatNumber(stats.beneficiNet)}
                    </p>
                    <p className="text-xs text-green-600 mt-2">Marge: 88%</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Euro className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa Cobrament</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.taxaCobrament}%</p>
                    <p className="text-xs text-green-600 mt-2">Excellent</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Gràfics i alertes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolució Mensual</h3>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                  <span className="ml-2 text-gray-500">Gràfic d'evolució</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes Financeres</h3>
                <div className="space-y-3">
                  {stats.facturesVencides > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-900">{stats.facturesVencides} factures vencides</p>
                        <p className="text-sm text-gray-600">Requereix atenció immediata</p>
                      </div>
                    </div>
                  )}
                  {stats.facturesPendents > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-gray-900">{stats.facturesPendents} factures pendents</p>
                        <p className="text-sm text-gray-600">Pendents de cobrament</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Sistema comptable actualitzat</p>
                      <p className="text-sm text-gray-600">Última sincronització: avui</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Factures Tab */}
        {activeTab === 'factures' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Totes les Factures</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Factura
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipus
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Proveïdor/Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Import
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Venciment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estat
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {factures.map(factura => (
                      <tr key={factura.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{factura.numeroFactura}</div>
                            <div className="text-sm text-gray-500">{factura.concepte}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            factura.tipus === 'ingrés' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {factura.tipus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{factura.proveidor}</div>
                          <div className="text-sm text-gray-500">{factura.categoria}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            factura.tipus === 'ingrés' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {factura.tipus === 'despesa' ? '-' : '+'}€{formatNumber(factura.import)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{factura.dataVenciment}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            factura.estat === 'pagada' ? 'bg-green-100 text-green-800' :
                            factura.estat === 'pendent' ? 'bg-yellow-100 text-yellow-800' :
                            factura.estat === 'vencida' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {factura.estat}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Moviments Tab */}
        {activeTab === 'moviments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Moviments Comptables</h3>
              <div className="space-y-4">
                {moviments.map(moviment => (
                  <div key={moviment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        moviment.tipus === 'ingrés' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {moviment.tipus === 'ingrés' ? (
                          <ArrowUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{moviment.concepte}</p>
                        <p className="text-sm text-gray-600">{moviment.categoria}</p>
                        <p className="text-xs text-gray-500">{moviment.referencia}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        moviment.tipus === 'ingrés' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {moviment.tipus === 'despesa' ? '-' : '+'}€{formatNumber(moviment.import)}
                      </p>
                      <p className="text-sm text-gray-500">{moviment.data}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Informes Tab */}
        {activeTab === 'informes' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informes Disponibles</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                    <div className="font-medium text-gray-900">Informe Mensual</div>
                    <div className="text-sm text-gray-500">Resum d'ingressos i despeses del mes</div>
                  </button>
                  <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                    <div className="font-medium text-gray-900">Balanç de Situació</div>
                    <div className="text-sm text-gray-500">Estat patrimonial de la plataforma</div>
                  </button>
                  <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                    <div className="font-medium text-gray-900">Cash Flow</div>
                    <div className="text-sm text-gray-500">Flux de caixa dels últims 12 mesos</div>
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exportacions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <span className="font-medium text-gray-900">Excel (.xlsx)</span>
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <span className="font-medium text-gray-900">PDF</span>
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <span className="font-medium text-gray-900">CSV</span>
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}