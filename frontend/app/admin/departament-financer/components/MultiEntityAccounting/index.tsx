'use client'

import { useState } from 'react'
import { 
  Building2, Users, Crown, PieChart, BarChart3, TrendingUp,
  DollarSign, CheckCircle, AlertTriangle, Clock, RefreshCw,
  ArrowUp, ArrowDown, Eye, Edit, Plus, Settings, Filter,
  Download, Activity, Award, Target, Calendar, Bot,
  FileText, Shield, Zap, Search, ChevronDown, ChevronRight
} from 'lucide-react'

export default function MultiEntityAccounting() {
  const [selectedEntity, setSelectedEntity] = useState<'all' | 'empleats' | 'empreses' | 'administracions'>('all')
  const [consolidationPeriod, setConsolidationPeriod] = useState<'monthly' | 'quarterly' | 'annual'>('monthly')
  const [showConsolidation, setShowConsolidation] = useState(true)
  const [activeJournal, setActiveJournal] = useState<string | null>(null)

  const entities = {
    empleats: {
      name: 'Empleats Públics',
      revenue: 1250000,
      expenses: 987500,
      grossMargin: 21.0,
      netIncome: 262500,
      assets: 2150000,
      liabilities: 890000,
      equity: 1260000,
      cashFlow: 315000,
      accounts: 147,
      transactions: 8924,
      taxRate: 25,
      compliance: 'compliant'
    },
    empreses: {
      name: 'Empreses Col·laboradores',
      revenue: 3200000,
      expenses: 2456000,
      grossMargin: 23.3,
      netIncome: 744000,
      assets: 5890000,
      liabilities: 2340000,
      equity: 3550000,
      cashFlow: 890000,
      accounts: 234,
      transactions: 15672,
      taxRate: 25,
      compliance: 'compliant'
    },
    administracions: {
      name: 'Administracions Públiques',
      revenue: 1530000,
      expenses: 1147500,
      grossMargin: 25.0,
      netIncome: 382500,
      assets: 3240000,
      liabilities: 1260000,
      equity: 1980000,
      cashFlow: 445000,
      accounts: 89,
      transactions: 3456,
      taxRate: 0,
      compliance: 'compliant'
    }
  }

  const consolidatedFinancials = {
    totalRevenue: 5980000,
    totalExpenses: 4591000,
    consolidatedGrossMargin: 23.2,
    consolidatedNetIncome: 1389000,
    totalAssets: 11280000,
    totalLiabilities: 4490000,
    totalEquity: 6790000,
    consolidatedCashFlow: 1650000,
    intercompanyEliminations: 156000,
    adjustments: 23000
  }

  const accountingJournals = [
    {
      id: 'JE-2024-001234',
      date: '2024-01-15',
      entity: 'Empreses',
      description: 'Monthly subscription revenue recognition',
      debitAccount: '4000-Revenue',
      creditAccount: '2400-Deferred Revenue',
      amount: 234567,
      status: 'posted',
      type: 'automated',
      reference: 'AUTO-REV-JAN24'
    },
    {
      id: 'JE-2024-001235',
      date: '2024-01-15',
      entity: 'Empleats',
      description: 'Intercompany service allocation',
      debitAccount: '5200-Operating Expenses',
      creditAccount: '1200-Intercompany Receivable',
      amount: 45000,
      status: 'posted',
      type: 'automated',
      reference: 'IC-ALLOC-JAN24'
    },
    {
      id: 'JE-2024-001236',
      date: '2024-01-16',
      entity: 'Administracions',
      description: 'Tax exempt revenue adjustment',
      debitAccount: '1100-Cash',
      creditAccount: '4100-Tax Exempt Revenue',
      amount: 78900,
      status: 'pending',
      type: 'manual',
      reference: 'TAX-EXEMPT-001'
    }
  ]

  const complianceChecks = [
    {
      entity: 'Empleats Públics',
      checks: [
        { item: 'Chart of Accounts', status: 'compliant', details: 'Aligned with Spanish GAAP' },
        { item: 'Tax Calculations', status: 'compliant', details: '25% corporate tax applied correctly' },
        { item: 'Intercompany Eliminations', status: 'compliant', details: 'All IC transactions eliminated' },
        { item: 'Revenue Recognition', status: 'warning', details: 'IFRS 15 - Minor timing differences' }
      ]
    },
    {
      entity: 'Empreses Col·laboradores',
      checks: [
        { item: 'Chart of Accounts', status: 'compliant', details: 'Standardized across all entities' },
        { item: 'Tax Calculations', status: 'compliant', details: 'VAT and corporate tax accurate' },
        { item: 'Consolidation Rules', status: 'compliant', details: 'Proper elimination entries' },
        { item: 'Audit Trail', status: 'compliant', details: 'Complete transaction history' }
      ]
    },
    {
      entity: 'Administracions Públiques',
      checks: [
        { item: 'Tax Exempt Status', status: 'compliant', details: 'Public sector exemptions applied' },
        { item: 'Special Accounting Rules', status: 'compliant', details: 'Government accounting standards' },
        { item: 'Reporting Requirements', status: 'compliant', details: 'Quarterly public reports filed' },
        { item: 'Transparency Compliance', status: 'compliant', details: 'Open data requirements met' }
      ]
    }
  ]

  const intercompanyTransactions = [
    {
      fromEntity: 'Empreses',
      toEntity: 'Empleats',
      amount: 45000,
      type: 'Service Allocation',
      description: 'Shared infrastructure costs',
      frequency: 'Monthly',
      eliminationStatus: 'auto'
    },
    {
      fromEntity: 'Administracions',
      toEntity: 'Empreses',
      amount: 23000,
      type: 'License Fees',
      description: 'Platform usage rights',
      frequency: 'Quarterly',
      eliminationStatus: 'auto'
    },
    {
      fromEntity: 'Empleats',
      toEntity: 'Administracions',
      amount: 12000,
      type: 'Support Services',
      description: 'Technical support provided',
      frequency: 'Monthly',
      eliminationStatus: 'manual'
    }
  ]

  const getEntityColor = (entity: string) => {
    switch(entity.toLowerCase()) {
      case 'empleats': return 'blue'
      case 'empreses': return 'green'
      case 'administracions': return 'purple'
      default: return 'gray'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'compliant': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'posted': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Multi-Entity Accounting</h2>
            <p className="text-gray-600">Comptabilitat separada per tipus de client amb consolidació automàtica</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowConsolidation(!showConsolidation)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showConsolidation ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <PieChart className="w-4 h-4" />
              Consolidated View
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Financials
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Entitat</label>
            <select 
              value={selectedEntity} 
              onChange={(e) => setSelectedEntity(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Totes les entitats</option>
              <option value="empleats">Empleats Públics</option>
              <option value="empreses">Empreses Col·laboradores</option>
              <option value="administracions">Administracions Públiques</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Període Consolidació</label>
            <select 
              value={consolidationPeriod} 
              onChange={(e) => setConsolidationPeriod(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="annual">Anual</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Update Consolidation
            </button>
          </div>
        </div>
      </div>

      {/* Entity Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(entities).map(([key, entity]) => {
          const color = getEntityColor(key)
          const Icon = key === 'empleats' ? Users : key === 'empreses' ? Building2 : Crown
          
          if (selectedEntity !== 'all' && selectedEntity !== key) return null
          
          return (
            <div key={key} className="bg-white rounded-lg border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <div>
                  <h3 className="font-semibold">{entity.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(entity.compliance)}`}>
                      {entity.compliance}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm text-gray-600">Revenue</div>
                    <div className="text-lg font-bold">€{(entity.revenue / 1000).toFixed(0)}K</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Net Income</div>
                    <div className="text-lg font-bold text-green-600">€{(entity.netIncome / 1000).toFixed(0)}K</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm text-gray-600">Gross Margin</div>
                    <div className="text-sm font-semibold">{entity.grossMargin}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Tax Rate</div>
                    <div className="text-sm font-semibold">{entity.taxRate}%</div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">€{(entity.assets / 1000).toFixed(0)}K</div>
                      <div className="text-gray-600">Assets</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">€{(entity.liabilities / 1000).toFixed(0)}K</div>
                      <div className="text-gray-600">Liabilities</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">€{(entity.equity / 1000).toFixed(0)}K</div>
                      <div className="text-gray-600">Equity</div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-600 flex justify-between">
                  <span>{entity.accounts} Accounts</span>
                  <span>{entity.transactions} Transactions</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Consolidated View */}
      {showConsolidation && selectedEntity === 'all' && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Consolidated Financials</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Auto-consolidated
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">€{(consolidatedFinancials.totalRevenue / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">€{(consolidatedFinancials.consolidatedNetIncome / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-gray-600">Net Income</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{consolidatedFinancials.consolidatedGrossMargin}%</div>
              <div className="text-sm text-gray-600">Gross Margin</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">€{(consolidatedFinancials.consolidatedCashFlow / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-gray-600">Cash Flow</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium mb-3">Balance Sheet Consolidation</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Assets</div>
                <div className="text-xl font-bold">€{(consolidatedFinancials.totalAssets / 1000000).toFixed(1)}M</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Liabilities</div>
                <div className="text-xl font-bold">€{(consolidatedFinancials.totalLiabilities / 1000000).toFixed(1)}M</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Equity</div>
                <div className="text-xl font-bold text-green-600">€{(consolidatedFinancials.totalEquity / 1000000).toFixed(1)}M</div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t text-sm text-gray-600 flex justify-between">
              <span>Intercompany Eliminations: €{(consolidatedFinancials.intercompanyEliminations / 1000).toFixed(0)}K</span>
              <span>Consolidation Adjustments: €{(consolidatedFinancials.adjustments / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>
      )}

      {/* Journal Entries */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold">Recent Journal Entries</h3>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            Automated Posting
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Entity</th>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-right py-3 px-4">Amount</th>
                <th className="text-center py-3 px-4">Type</th>
                <th className="text-center py-3 px-4">Status</th>
                <th className="text-center py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accountingJournals.map((journal) => (
                <tr 
                  key={journal.id} 
                  className={`border-b hover:bg-gray-50 cursor-pointer ${
                    activeJournal === journal.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setActiveJournal(activeJournal === journal.id ? null : journal.id)}
                >
                  <td className="py-3 px-4 font-mono text-sm">{journal.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full bg-${getEntityColor(journal.entity.toLowerCase())}-100 text-${getEntityColor(journal.entity.toLowerCase())}-700`}>
                      {journal.entity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{journal.description}</td>
                  <td className="py-3 px-4 text-right font-semibold">€{journal.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      journal.type === 'automated' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {journal.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(journal.status)}`}>
                      {journal.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      {journal.status === 'pending' && (
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {activeJournal && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            {(() => {
              const journal = accountingJournals.find(j => j.id === activeJournal)
              if (!journal) return null
              return (
                <div>
                  <div className="font-medium mb-2">Journal Entry Details: {journal.id}</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700">Debit Account:</div>
                      <div>{journal.debitAccount}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">Credit Account:</div>
                      <div>{journal.creditAccount}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="font-medium text-gray-700">Reference:</div>
                    <div>{journal.reference}</div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* Intercompany Transactions */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold">Intercompany Transactions</h3>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
            Auto Elimination
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {intercompanyTransactions.map((transaction, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium">{transaction.type}</div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  transaction.eliminationStatus === 'auto' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {transaction.eliminationStatus}
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className={`px-2 py-1 rounded bg-${getEntityColor(transaction.fromEntity.toLowerCase())}-100 text-${getEntityColor(transaction.fromEntity.toLowerCase())}-700`}>
                  {transaction.fromEntity}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className={`px-2 py-1 rounded bg-${getEntityColor(transaction.toEntity.toLowerCase())}-100 text-${getEntityColor(transaction.toEntity.toLowerCase())}-700`}>
                  {transaction.toEntity}
                </span>
              </div>

              <div className="text-lg font-bold text-center mb-2">
                €{transaction.amount.toLocaleString()}
              </div>
              
              <div className="text-xs text-gray-600 text-center mb-2">
                {transaction.description}
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                {transaction.frequency}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Dashboard */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Compliance Dashboard</h3>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            All Entities Compliant
          </span>
        </div>

        <div className="space-y-4">
          {complianceChecks.map((entity, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">{entity.entity}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {entity.checks.map((check, checkIdx) => (
                  <div key={checkIdx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(check.status)}`}>
                        {check.status === 'compliant' ? <CheckCircle className="w-3 h-3" /> :
                         check.status === 'warning' ? <AlertTriangle className="w-3 h-3" /> :
                         <XCircle className="w-3 h-3" />}
                      </span>
                      <span className="text-sm font-medium">{check.item}</span>
                    </div>
                    <div className="text-xs text-gray-600">{check.details}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6" />
    </svg>
  )
}

function XCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}