'use client'

import { useState } from 'react'
import { 
  Building2, 
  TrendingUp, 
  Euro, 
  Users, 
  Calendar,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Settings,
  BarChart3,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Star,
  Shield,
  Award,
  Zap,
  Target,
  CreditCard,
  DollarSign,
  PieChart,
  Activity,
  Bell,
  Check,
  X,
  ChevronRight,
  Briefcase,
  ShoppingBag,
  Tag,
  Percent,
  Gift,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  Upload,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Globe,
  Hash,
  Info,
  Copy,
  MoreVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

type PlanColaboracion = {
  id: string
  nom: string
  preu: number
  durada: 'mensual' | 'trimestral' | 'anual'
  caracteristiques: string[]
  limitsOfertes: number
  destacat: boolean
  actiu: boolean
  color: string
  icona: string
  descompte?: number
  empresesActives: number
}

type Empresa = {
  id: string
  nom: string
  nif: string
  email: string
  telefon: string
  direccio: string
  comunitat: string
  pla: string
  estat: 'activa' | 'inactiva' | 'pendent' | 'suspesa'
  dataAlta: string
  dataExpiracio: string
  facturacio: number
  ofertes: number
  visualitzacions: number
  conversions: number
  gestor?: string
  sector: string
  tamany: 'petita' | 'mitjana' | 'gran'
  valoracio: number
}

type OfertaPendent = {
  id: string
  empresaId: string
  empresaNom: string
  titol: string
  categoria: string
  descripcio: string
  preu: number
  dataCreacio: string
  estat: 'pendent' | 'aprovada' | 'rebutjada'
  motiu?: string
  imatges: string[]
}

type Factura = {
  id: string
  empresaId: string
  empresaNom: string
  numeroFactura: string
  dataEmissio: string
  dataVenciment: string
  dataPagament?: string
  import: number
  concepte: string
  estat: 'pendent' | 'pagada' | 'vencida' | 'cancel·lada'
  metodePagament?: 'transferencia' | 'targeta' | 'domiciliacio'
  observacions?: string
  pla: string
  periode: string
}

type MovimentPagament = {
  id: string
  facturaId: string
  empresaId: string
  empresaNom: string
  import: number
  tipus: 'pagament' | 'devolucio' | 'ajust'
  data: string
  metodePagament: string
  referencia?: string
  estat: 'processat' | 'pendent' | 'fallit'
}

// Función para formatear números de manera consistente
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-ES').format(num)
}

export default function AdminEmpreses() {
  // Estats principals
  const [activeTab, setActiveTab] = useState<'dashboard' | 'empreses' | 'plans' | 'ofertes' | 'facturacio' | 'analytics'>('dashboard')
  const [selectedPeriod, setSelectedPeriod] = useState<'dia' | 'setmana' | 'mes' | 'any'>('mes')
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false)
  const [showEditPlanModal, setShowEditPlanModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanColaboracion | null>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null)
  const [showOfertaModal, setShowOfertaModal] = useState(false)
  const [selectedOferta, setSelectedOferta] = useState<OfertaPendent | null>(null)
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('')
  const [estatFilter, setEstatFilter] = useState<'tots' | 'activa' | 'inactiva' | 'pendent' | 'suspesa'>('tots')
  const [comunitatFilter, setComunitatFilter] = useState<string>('totes')
  const [plaFilter, setPlaFilter] = useState<string>('tots')
  
  // Plans de col·laboració
  const [plans, setPlans] = useState<PlanColaboracion[]>([
    {
      id: '1',
      nom: 'Bàsic',
      preu: 49,
      durada: 'mensual',
      caracteristiques: [
        'Fins a 5 ofertes actives',
        'Perfil bàsic d\'empresa',
        'Suport per email',
        'Estadístiques bàsiques'
      ],
      limitsOfertes: 5,
      destacat: false,
      actiu: true,
      color: 'bg-gray-100',
      icona: 'Package',
      empresesActives: 423
    },
    {
      id: '2',
      nom: 'Professional',
      preu: 99,
      durada: 'mensual',
      caracteristiques: [
        'Fins a 20 ofertes actives',
        'Perfil destacat',
        'Suport prioritari',
        'Estadístiques avançades',
        'Promocions destacades',
        'Badge de confiança'
      ],
      limitsOfertes: 20,
      destacat: true,
      actiu: true,
      color: 'bg-blue-100',
      icona: 'Briefcase',
      descompte: 15,
      empresesActives: 567
    },
    {
      id: '3',
      nom: 'Premium',
      preu: 199,
      durada: 'mensual',
      caracteristiques: [
        'Ofertes il·limitades',
        'Perfil premium amb vídeo',
        'Suport 24/7',
        'Estadístiques en temps real',
        'Promocions a portada',
        'Badge Premium',
        'Gestor de compte dedicat',
        'API d\'integració'
      ],
      limitsOfertes: -1,
      destacat: false,
      actiu: true,
      color: 'bg-purple-100',
      icona: 'Award',
      descompte: 20,
      empresesActives: 257
    }
  ])
  
  // Dades d'empreses
  const [empreses] = useState<Empresa[]>([
    {
      id: '1',
      nom: 'TechSolutions BCN',
      nif: 'B12345678',
      email: 'info@techsolutions.cat',
      telefon: '931234567',
      direccio: 'C/ Balmes 123, Barcelona',
      comunitat: 'Catalunya',
      pla: 'Premium',
      estat: 'activa',
      dataAlta: '2024-01-15',
      dataExpiracio: '2025-01-15',
      facturacio: 12300,
      ofertes: 67,
      visualitzacions: 4532,
      conversions: 234,
      gestor: 'Maria García',
      sector: 'Tecnologia',
      tamany: 'mitjana',
      valoracio: 4.8
    },
    {
      id: '2',
      nom: 'ConsultPro Madrid',
      nif: 'B87654321',
      email: 'contacto@consultpro.es',
      telefon: '915678901',
      direccio: 'Plaza Mayor 45, Madrid',
      comunitat: 'Madrid',
      pla: 'Professional',
      estat: 'activa',
      dataAlta: '2024-02-20',
      dataExpiracio: '2025-02-20',
      facturacio: 9800,
      ofertes: 54,
      visualitzacions: 3421,
      conversions: 187,
      gestor: 'Carlos López',
      sector: 'Consultoria',
      tamany: 'gran',
      valoracio: 4.6
    },
    {
      id: '3',
      nom: 'FormaciónDigital',
      nif: 'B11223344',
      email: 'hola@formaciondigital.com',
      telefon: '961234567',
      direccio: 'Av. del Puerto 78, Valencia',
      comunitat: 'València',
      pla: 'Bàsic',
      estat: 'pendent',
      dataAlta: '2024-11-01',
      dataExpiracio: '2025-11-01',
      facturacio: 0,
      ofertes: 0,
      visualitzacions: 0,
      conversions: 0,
      sector: 'Formació',
      tamany: 'petita',
      valoracio: 0
    }
  ])
  
  // Facturas
  const [factures] = useState<Factura[]>([
    {
      id: '1',
      empresaId: '1',
      empresaNom: 'TechSolutions BCN',
      numeroFactura: 'F-2024-001',
      dataEmissio: '2024-11-01',
      dataVenciment: '2024-11-30',
      dataPagament: '2024-11-15',
      import: 199,
      concepte: 'Pla Premium - Novembre 2024',
      estat: 'pagada',
      metodePagament: 'domiciliacio',
      pla: 'Premium',
      periode: 'Novembre 2024'
    },
    {
      id: '2',
      empresaId: '2',
      empresaNom: 'ConsultPro Madrid',
      numeroFactura: 'F-2024-002',
      dataEmissio: '2024-11-01',
      dataVenciment: '2024-11-30',
      import: 99,
      concepte: 'Pla Professional - Novembre 2024',
      estat: 'pendent',
      pla: 'Professional',
      periode: 'Novembre 2024'
    },
    {
      id: '3',
      empresaId: '3',
      empresaNom: 'FormaciónDigital',
      numeroFactura: 'F-2024-003',
      dataEmissio: '2024-10-01',
      dataVenciment: '2024-10-30',
      import: 49,
      concepte: 'Pla Bàsic - Octubre 2024',
      estat: 'vencida',
      pla: 'Bàsic',
      periode: 'Octubre 2024'
    },
    {
      id: '4',
      empresaId: '1',
      empresaNom: 'TechSolutions BCN',
      numeroFactura: 'F-2024-004',
      dataEmissio: '2024-12-01',
      dataVenciment: '2024-12-30',
      import: 199,
      concepte: 'Pla Premium - Desembre 2024',
      estat: 'pendent',
      pla: 'Premium',
      periode: 'Desembre 2024'
    }
  ])

  // Moviments de pagament
  const [moviments] = useState<MovimentPagament[]>([
    {
      id: '1',
      facturaId: '1',
      empresaId: '1',
      empresaNom: 'TechSolutions BCN',
      import: 199,
      tipus: 'pagament',
      data: '2024-11-15',
      metodePagament: 'Domiciliació bancària',
      referencia: 'DOM-202411-001',
      estat: 'processat'
    },
    {
      id: '2',
      facturaId: '2',
      empresaId: '2',
      empresaNom: 'ConsultPro Madrid',
      import: 99,
      tipus: 'pagament',
      data: '2024-11-25',
      metodePagament: 'Transferència bancària',
      referencia: 'TRF-202411-002',
      estat: 'pendent'
    }
  ])

  // Ofertes pendents de moderació
  const [ofertesPendents] = useState<OfertaPendent[]>([
    {
      id: '1',
      empresaId: '1',
      empresaNom: 'TechSolutions BCN',
      titol: 'Desenvolupament Web Professional',
      categoria: 'Tecnologia',
      descripcio: 'Creació de pàgines web responsives amb les últimes tecnologies',
      preu: 1500,
      dataCreacio: '2024-11-25',
      estat: 'pendent',
      imatges: ['web1.jpg', 'web2.jpg']
    },
    {
      id: '2',
      empresaId: '2',
      empresaNom: 'ConsultPro Madrid',
      titol: 'Assessoria Fiscal per PIMES',
      categoria: 'Consultoria',
      descripcio: 'Servei integral d\'assessoria fiscal i comptable',
      preu: 200,
      dataCreacio: '2024-11-26',
      estat: 'pendent',
      imatges: ['fiscal1.jpg']
    }
  ])
  
  // Nou pla en creació
  const [nouPla, setNouPla] = useState({
    nom: '',
    preu: 0,
    durada: 'mensual' as 'mensual' | 'trimestral' | 'anual',
    caracteristiques: [''],
    limitsOfertes: 5,
    destacat: false,
    actiu: true,
    color: 'bg-gray-100',
    icona: 'Package',
    descompte: 0
  })

  // Funcions de gestió
  const handleCreatePlan = () => {
    const newPlan: PlanColaboracion = {
      ...nouPla,
      id: Date.now().toString(),
      empresesActives: 0,
      caracteristiques: nouPla.caracteristiques.filter(c => c.trim() !== '')
    }
    setPlans([...plans, newPlan])
    setShowCreatePlanModal(false)
    setNouPla({
      nom: '',
      preu: 0,
      durada: 'mensual',
      caracteristiques: [''],
      limitsOfertes: 5,
      destacat: false,
      actiu: true,
      color: 'bg-gray-100',
      icona: 'Package',
      descompte: 0
    })
  }

  const handleDeletePlan = (planId: string) => {
    if (confirm('Estàs segur que vols eliminar aquest pla?')) {
      setPlans(plans.filter(p => p.id !== planId))
    }
  }

  const handleApproveEmpresa = (empresaId: string) => {
    // Lògica per aprovar empresa
    console.log('Aprovant empresa:', empresaId)
    setShowApprovalModal(false)
  }

  const handleRejectEmpresa = (empresaId: string, motiu: string) => {
    // Lògica per rebutjar empresa
    console.log('Rebutjant empresa:', empresaId, 'Motiu:', motiu)
    setShowApprovalModal(false)
  }

  const handleApproveOferta = (ofertaId: string) => {
    // Lògica per aprovar oferta
    console.log('Aprovant oferta:', ofertaId)
    setShowOfertaModal(false)
  }

  const handleRejectOferta = (ofertaId: string, motiu: string) => {
    // Lògica per rebutjar oferta
    console.log('Rebutjant oferta:', ofertaId, 'Motiu:', motiu)
    setShowOfertaModal(false)
  }
  
  // Estadístiques
  const stats = {
    totalEmpreses: empreses.length,
    empresesActives: empreses.filter(e => e.estat === 'activa').length,
    empresesPendents: empreses.filter(e => e.estat === 'pendent').length,
    ingressosMensuals: 84500,
    ingressosAnuals: 1014000,
    taxaCreixement: 12.5,
    taxaRetencio: 94.3,
    ofertesPendents: ofertesPendents.filter(o => o.estat === 'pendent').length,
    totalOfertes: 3847,
    conversioMitjana: 12.4
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestió d'Empreses Col·laboradores</h1>
              <p className="text-sm text-gray-600 mt-1">Administració del directori comercial i plans de col·laboració</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button
                onClick={() => setShowCreatePlanModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Nou Pla
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'empreses', label: 'Empreses', icon: Building2 },
              { id: 'plans', label: 'Plans', icon: Package },
              { id: 'ofertes', label: 'Ofertes', icon: ShoppingBag },
              { id: 'facturacio', label: 'Facturació', icon: CreditCard },
              { id: 'analytics', label: 'Analítiques', icon: PieChart }
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
                {tab.id === 'ofertes' && ofertesPendents.filter(o => o.estat === 'pendent').length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {ofertesPendents.filter(o => o.estat === 'pendent').length}
                  </span>
                )}
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
                    <p className="text-sm font-medium text-gray-600">Empreses Actives</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.empresesActives}</p>
                    <p className="text-xs text-green-600 mt-2">
                      <ArrowUp className="w-3 h-3 inline" />
                      +12% aquest mes
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ingressos Mensuals</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">€{formatNumber(stats.ingressosMensuals)}</p>
                    <p className="text-xs text-green-600 mt-2">
                      <ArrowUp className="w-3 h-3 inline" />
                      +{stats.taxaCreixement}%
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Euro className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa Retenció</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.taxaRetencio}%</p>
                    <p className="text-xs text-gray-600 mt-2">Mitjana sector: 85%</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pendents Aprovació</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.empresesPendents}</p>
                    <p className="text-xs text-orange-600 mt-2">Requereix atenció</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Distribució per plans */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribució per Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(pla => (
                  <div key={pla.id} className={`${pla.color} rounded-lg p-4`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{pla.nom}</h4>
                      {pla.destacat && (
                        <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Popular</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-gray-900">€{pla.preu}/mes</p>
                      <p className="text-sm text-gray-600">{pla.empresesActives} empreses</p>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">Ingressos mensuals</p>
                        <p className="text-lg font-semibold text-gray-900">
                          €{formatNumber(pla.preu * pla.empresesActives)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Activitat recent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Empreses Pendents</h3>
                <div className="space-y-3">
                  {empreses.filter(e => e.estat === 'pendent').map(empresa => (
                    <div key={empresa.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{empresa.nom}</p>
                        <p className="text-sm text-gray-600">{empresa.sector} • {empresa.comunitat}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedEmpresa(empresa)
                          setShowApprovalModal(true)
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Revisar
                      </button>
                    </div>
                  ))}
                  {empreses.filter(e => e.estat === 'pendent').length === 0 && (
                    <p className="text-gray-500 text-center py-4">No hi ha empreses pendents</p>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ofertes per Moderar</h3>
                <div className="space-y-3">
                  {ofertesPendents.filter(o => o.estat === 'pendent').slice(0, 5).map(oferta => (
                    <div key={oferta.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{oferta.titol}</p>
                        <p className="text-sm text-gray-600">{oferta.empresaNom} • €{oferta.preu}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedOferta(oferta)
                          setShowOfertaModal(true)
                        }}
                        className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                      >
                        Moderar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Alertes de facturació */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Factures Vencides
                </h3>
                <div className="space-y-3">
                  {factures.filter(f => f.estat === 'vencida').map(factura => (
                    <div key={factura.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{factura.empresaNom}</p>
                        <p className="text-sm text-gray-600">{factura.numeroFactura} • €{formatNumber(factura.import)}</p>
                        <p className="text-xs text-red-600">Vencida el {factura.dataVenciment}</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('facturacio')}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Gestionar
                      </button>
                    </div>
                  ))}
                  {factures.filter(f => f.estat === 'vencida').length === 0 && (
                    <p className="text-gray-500 text-center py-4">No hi ha factures vencides</p>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Properament Vencides
                </h3>
                <div className="space-y-3">
                  {factures
                    .filter(f => {
                      const venciment = new Date(f.dataVenciment)
                      const ara = new Date()
                      const diesRestants = Math.ceil((venciment.getTime() - ara.getTime()) / (1000 * 3600 * 24))
                      return diesRestants <= 7 && diesRestants > 0 && f.estat === 'pendent'
                    })
                    .map(factura => {
                      const venciment = new Date(factura.dataVenciment)
                      const ara = new Date()
                      const diesRestants = Math.ceil((venciment.getTime() - ara.getTime()) / (1000 * 3600 * 24))
                      return (
                        <div key={factura.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{factura.empresaNom}</p>
                            <p className="text-sm text-gray-600">{factura.numeroFactura} • €{formatNumber(factura.import)}</p>
                            <p className="text-xs text-orange-600">Vence en {diesRestants} dies</p>
                          </div>
                          <button 
                            onClick={() => setActiveTab('facturacio')}
                            className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                          >
                            Recordar
                          </button>
                        </div>
                      )
                    })}
                  {factures
                    .filter(f => {
                      const venciment = new Date(f.dataVenciment)
                      const ara = new Date()
                      const diesRestants = Math.ceil((venciment.getTime() - ara.getTime()) / (1000 * 3600 * 24))
                      return diesRestants <= 7 && diesRestants > 0 && f.estat === 'pendent'
                    }).length === 0 && (
                    <p className="text-gray-500 text-center py-4">No hi ha factures properes a vèncer</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map(pla => (
                <div key={pla.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className={`${pla.color} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{pla.nom}</h3>
                      {pla.destacat && (
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-900">€{pla.preu}</span>
                      <span className="text-gray-600">/{pla.durada}</span>
                    </div>
                    {pla.descompte && (
                      <p className="mt-2 text-sm text-green-600 font-medium">
                        {pla.descompte}% descompte anual
                      </p>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      {pla.caracteristiques.map((carac, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{carac}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Límit d'ofertes</span>
                        <span className="font-medium text-gray-900">
                          {pla.limitsOfertes === -1 ? 'Il·limitades' : pla.limitsOfertes}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Empreses actives</span>
                        <span className="font-medium text-gray-900">{pla.empresesActives}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ingressos</span>
                        <span className="font-medium text-gray-900">
                          €{formatNumber(pla.preu * pla.empresesActives)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={() => {
                          setSelectedPlan(pla)
                          setShowEditPlanModal(true)
                        }}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletePlan(pla.id)}
                        className="px-3 py-2 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empreses Tab */}
        {activeTab === 'empreses' && (
          <div className="space-y-6">
            {/* Filtres */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Cercar empreses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <select
                  value={estatFilter}
                  onChange={(e) => setEstatFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tots">Tots els estats</option>
                  <option value="activa">Activa</option>
                  <option value="inactiva">Inactiva</option>
                  <option value="pendent">Pendent</option>
                  <option value="suspesa">Suspesa</option>
                </select>
                <select
                  value={comunitatFilter}
                  onChange={(e) => setComunitatFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="totes">Totes les comunitats</option>
                  <option value="Catalunya">Catalunya</option>
                  <option value="Madrid">Madrid</option>
                  <option value="València">València</option>
                  <option value="Andalusia">Andalusia</option>
                </select>
                <select
                  value={plaFilter}
                  onChange={(e) => setPlaFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tots">Tots els plans</option>
                  {plans.map(pla => (
                    <option key={pla.id} value={pla.nom}>{pla.nom}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Taula d'empreses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Empresa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pla
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ofertes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Facturació
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expiració
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Accions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {empreses
                      .filter(e => {
                        const matchSearch = e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                          e.email.toLowerCase().includes(searchTerm.toLowerCase())
                        const matchEstat = estatFilter === 'tots' || e.estat === estatFilter
                        const matchComunitat = comunitatFilter === 'totes' || e.comunitat === comunitatFilter
                        const matchPla = plaFilter === 'tots' || e.pla === plaFilter
                        return matchSearch && matchEstat && matchComunitat && matchPla
                      })
                      .map(empresa => (
                        <tr key={empresa.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{empresa.nom}</div>
                              <div className="text-sm text-gray-500">{empresa.email}</div>
                              <div className="text-xs text-gray-400">{empresa.comunitat}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              empresa.pla === 'Premium' ? 'bg-purple-100 text-purple-800' :
                              empresa.pla === 'Professional' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {empresa.pla}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              empresa.estat === 'activa' ? 'bg-green-100 text-green-800' :
                              empresa.estat === 'pendent' ? 'bg-yellow-100 text-yellow-800' :
                              empresa.estat === 'suspesa' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {empresa.estat}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {empresa.ofertes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            €{formatNumber(empresa.facturacio)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{empresa.dataExpiracio}</div>
                            {new Date(empresa.dataExpiracio) < new Date(Date.now() + 30*24*60*60*1000) && (
                              <span className="text-xs text-orange-600">Expira aviat</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-800">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-800">
                                <Mail className="w-4 h-4" />
                              </button>
                              {empresa.estat === 'pendent' && (
                                <button
                                  onClick={() => {
                                    setSelectedEmpresa(empresa)
                                    setShowApprovalModal(true)
                                  }}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Ofertes Tab */}
        {activeTab === 'ofertes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ofertes Pendents de Moderació</h3>
              <div className="space-y-4">
                {ofertesPendents.filter(o => o.estat === 'pendent').map(oferta => (
                  <div key={oferta.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{oferta.titol}</h4>
                        <p className="text-sm text-gray-600 mt-1">{oferta.descripcio}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-500">
                            <Building2 className="w-3 h-3 inline mr-1" />
                            {oferta.empresaNom}
                          </span>
                          <span className="text-sm text-gray-500">
                            <Tag className="w-3 h-3 inline mr-1" />
                            {oferta.categoria}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            €{oferta.preu}
                          </span>
                          <span className="text-sm text-gray-500">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {oferta.dataCreacio}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedOferta(oferta)
                            setShowOfertaModal(true)
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Revisar
                        </button>
                        <button
                          onClick={() => handleApproveOferta(oferta.id)}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRejectOferta(oferta.id, 'No compleix els estàndards')}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {ofertesPendents.filter(o => o.estat === 'pendent').length === 0 && (
                  <p className="text-center text-gray-500 py-8">No hi ha ofertes pendents de moderació</p>
                )}
              </div>
            </div>

            {/* Estadístiques d'ofertes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">Per Categoria</h4>
                <div className="space-y-2">
                  {['Tecnologia', 'Consultoria', 'Formació', 'Serveis'].map(cat => (
                    <div key={cat} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{cat}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.floor(Math.random() * 100) + 20}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">Estats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Actives</span>
                    <span className="text-sm font-medium text-green-600">3,421</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pendents</span>
                    <span className="text-sm font-medium text-yellow-600">67</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expirades</span>
                    <span className="text-sm font-medium text-gray-600">359</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rebutjades</span>
                    <span className="text-sm font-medium text-red-600">23</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">Rendiment</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Visualitzacions</span>
                    <span className="text-sm font-medium text-gray-900">458.3k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Clics</span>
                    <span className="text-sm font-medium text-gray-900">56.7k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Conversions</span>
                    <span className="text-sm font-medium text-gray-900">7.2k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taxa conversió</span>
                    <span className="text-sm font-medium text-green-600">12.7%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Facturació Tab */}
        {activeTab === 'facturacio' && (
          <div className="space-y-6">
            {/* Estadístiques de facturació */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Factures Pendents</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {factures.filter(f => f.estat === 'pendent').length}
                    </p>
                    <p className="text-xs text-orange-600 mt-2">
                      €{formatNumber(factures.filter(f => f.estat === 'pendent').reduce((sum, f) => sum + f.import, 0))} pendents
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Factures Vencides</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {factures.filter(f => f.estat === 'vencida').length}
                    </p>
                    <p className="text-xs text-red-600 mt-2">
                      €{formatNumber(factures.filter(f => f.estat === 'vencida').reduce((sum, f) => sum + f.import, 0))} vencudes
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pagaments Mes</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      €{formatNumber(factures.filter(f => f.estat === 'pagada' && f.dataPagament?.startsWith('2024-11')).reduce((sum, f) => sum + f.import, 0))}
                    </p>
                    <p className="text-xs text-green-600 mt-2">+18% vs mes anterior</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa Cobrament</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">92.5%</p>
                    <p className="text-xs text-blue-600 mt-2">Excellent</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Taula de factures */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Factures</h3>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Plus className="w-4 h-4" />
                      Nova Factura
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      <Download className="w-4 h-4" />
                      Exportar
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Factura
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Empresa
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Accions
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
                          <div className="text-sm text-gray-900">{factura.empresaNom}</div>
                          <div className="text-sm text-gray-500">{factura.pla}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">€{formatNumber(factura.import)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{factura.dataVenciment}</div>
                          {new Date(factura.dataVenciment) < new Date() && factura.estat !== 'pagada' && (
                            <span className="text-xs text-red-600">Vencida</span>
                          )}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800">
                              <Mail className="w-4 h-4" />
                            </button>
                            {factura.estat === 'pendent' && (
                              <button className="text-green-600 hover:text-green-800">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Moviments recents */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Moviments Recents</h3>
              <div className="space-y-4">
                {moviments.map(moviment => (
                  <div key={moviment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        moviment.tipus === 'pagament' ? 'bg-green-100' :
                        moviment.tipus === 'devolucio' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        {moviment.tipus === 'pagament' ? (
                          <ArrowUp className="w-4 h-4 text-green-600" />
                        ) : moviment.tipus === 'devolucio' ? (
                          <ArrowDown className="w-4 h-4 text-red-600" />
                        ) : (
                          <RefreshCw className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{moviment.empresaNom}</p>
                        <p className="text-sm text-gray-600">{moviment.metodePagament}</p>
                        <p className="text-xs text-gray-500">{moviment.referencia}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        moviment.tipus === 'pagament' ? 'text-green-600' :
                        moviment.tipus === 'devolucio' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {moviment.tipus === 'devolucio' ? '-' : '+'}€{formatNumber(moviment.import)}
                      </p>
                      <p className="text-sm text-gray-500">{moviment.data}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        moviment.estat === 'processat' ? 'bg-green-100 text-green-800' :
                        moviment.estat === 'pendent' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {moviment.estat}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Selector de període */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Anàlisi de Rendiment</h3>
                <div className="flex gap-2">
                  {(['dia', 'setmana', 'mes', 'any'] as const).map(period => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 text-sm rounded ${
                        selectedPeriod === period
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gràfics i mètriques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">Evolució d'Ingressos</h4>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <Activity className="w-8 h-8 text-gray-400" />
                  <span className="ml-2 text-gray-500">Gràfic d'evolució</span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">Distribució per Comunitats</h4>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <PieChart className="w-8 h-8 text-gray-400" />
                  <span className="ml-2 text-gray-500">Gràfic circular</span>
                </div>
              </div>
            </div>

            {/* Mètriques clau */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">LTV Mitjà</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">€2,847</p>
                <p className="text-xs text-green-600 mt-1">+15% vs mes anterior</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">CAC</span>
                  <DollarSign className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">€127</p>
                <p className="text-xs text-blue-600 mt-1">-8% vs mes anterior</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Churn Rate</span>
                  <ArrowDown className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">5.7%</p>
                <p className="text-xs text-red-600 mt-1">+0.3% vs mes anterior</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">NPS</span>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">72</p>
                <p className="text-xs text-green-600 mt-1">Excel·lent</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal Crear Pla */}
      {showCreatePlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Crear Nou Pla de Col·laboració</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom del Pla</label>
                <input
                  type="text"
                  value={nouPla.nom}
                  onChange={(e) => setNouPla({...nouPla, nom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: Professional"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preu (€)</label>
                  <input
                    type="number"
                    value={nouPla.preu}
                    onChange={(e) => setNouPla({...nouPla, preu: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durada</label>
                  <select
                    value={nouPla.durada}
                    onChange={(e) => setNouPla({...nouPla, durada: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Límit d'Ofertes</label>
                <input
                  type="number"
                  value={nouPla.limitsOfertes}
                  onChange={(e) => setNouPla({...nouPla, limitsOfertes: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="-1 per il·limitades"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Característiques</label>
                <div className="space-y-2">
                  {nouPla.caracteristiques.map((carac, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={carac}
                        onChange={(e) => {
                          const newCaracs = [...nouPla.caracteristiques]
                          newCaracs[idx] = e.target.value
                          setNouPla({...nouPla, caracteristiques: newCaracs})
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Característica del pla"
                      />
                      {idx === nouPla.caracteristiques.length - 1 ? (
                        <button
                          onClick={() => setNouPla({...nouPla, caracteristiques: [...nouPla.caracteristiques, '']})}
                          className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const newCaracs = nouPla.caracteristiques.filter((_, i) => i !== idx)
                            setNouPla({...nouPla, caracteristiques: newCaracs})
                          }}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={nouPla.destacat}
                    onChange={(e) => setNouPla({...nouPla, destacat: e.target.checked})}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Pla destacat</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={nouPla.actiu}
                    onChange={(e) => setNouPla({...nouPla, actiu: e.target.checked})}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Actiu</span>
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowCreatePlanModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel·lar
              </button>
              <button
                onClick={handleCreatePlan}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Crear Pla
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Aprovació Empresa */}
      {showApprovalModal && selectedEmpresa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Revisar Sol·licitud d'Empresa</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Informació de l'empresa */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Informació de l'Empresa</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Nom:</span>
                    <p className="font-medium">{selectedEmpresa.nom}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">NIF:</span>
                    <p className="font-medium">{selectedEmpresa.nif}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-medium">{selectedEmpresa.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Telèfon:</span>
                    <p className="font-medium">{selectedEmpresa.telefon}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Direcció:</span>
                    <p className="font-medium">{selectedEmpresa.direccio}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Comunitat:</span>
                    <p className="font-medium">{selectedEmpresa.comunitat}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Sector:</span>
                    <p className="font-medium">{selectedEmpresa.sector}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Tamany:</span>
                    <p className="font-medium capitalize">{selectedEmpresa.tamany}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Pla Sol·licitat:</span>
                    <p className="font-medium">{selectedEmpresa.pla}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Data Sol·licitud:</span>
                    <p className="font-medium">{selectedEmpresa.dataAlta}</p>
                  </div>
                </div>
              </div>
              
              {/* Verificacions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Verificacions</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-sm text-gray-700">NIF verificat</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-sm text-gray-700">Email verificat</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-sm text-gray-700">Documentació completa</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-sm text-gray-700">Pagament verificat</span>
                  </label>
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes internes</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Afegir notes sobre aquesta sol·licitud..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel·lar
              </button>
              <button
                onClick={() => handleRejectEmpresa(selectedEmpresa.id, 'Documentació incompleta')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Rebutjar
              </button>
              <button
                onClick={() => handleApproveEmpresa(selectedEmpresa.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Aprovar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Moderació Oferta */}
      {showOfertaModal && selectedOferta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Moderar Oferta</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Detalls de l'oferta */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Detalls de l'Oferta</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Títol:</span>
                    <p className="font-medium">{selectedOferta.titol}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Descripció:</span>
                    <p className="text-gray-700">{selectedOferta.descripcio}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Empresa:</span>
                      <p className="font-medium">{selectedOferta.empresaNom}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Categoria:</span>
                      <p className="font-medium">{selectedOferta.categoria}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Preu:</span>
                      <p className="font-medium">€{selectedOferta.preu}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Imatges */}
              {selectedOferta.imatges && selectedOferta.imatges.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Imatges</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedOferta.imatges.map((img, idx) => (
                      <div key={idx} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">{img}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Criteris de moderació */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Criteris de Moderació</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-green-600" defaultChecked />
                    <span className="text-sm text-gray-700">Títol apropiat</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-green-600" defaultChecked />
                    <span className="text-sm text-gray-700">Descripció completa</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-green-600" defaultChecked />
                    <span className="text-sm text-gray-700">Categoria correcta</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-green-600" defaultChecked />
                    <span className="text-sm text-gray-700">Preu raonable</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-green-600" />
                    <span className="text-sm text-gray-700">Imatges adequades</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-red-600" />
                    <span className="text-sm text-gray-700">No és spam</span>
                  </label>
                </div>
              </div>
              
              {/* Motiu rebuig */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motiu de rebuig (opcional)
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Especifica el motiu del rebuig si aplica..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowOfertaModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel·lar
              </button>
              <button
                onClick={() => handleRejectOferta(selectedOferta.id, 'No compleix els estàndards')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Rebutjar
              </button>
              <button
                onClick={() => handleApproveOferta(selectedOferta.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Aprovar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}