'use client'

import { useState, useEffect } from 'react'
import { 
  X, Settings, User, Shield, Bell, Palette, Globe, Lock, 
  Link2, Database, ChevronRight, Eye, EyeOff, Info,
  AlertTriangle, CheckCircle, Save, RefreshCw, Mail,
  Smartphone, Key, FileText, Download, Trash2, LogOut,
  Sun, Moon, Monitor, Languages, MapPin, Calendar,
  CreditCard, Building, Users, Activity
} from 'lucide-react'
import { audioNotificacions } from '../../../utils/audioNotificacions'
import { useIdioma } from '../../../../hooks/useComunidad'
import { useT } from '../../../contextos/TraduccioContext'

interface ModalConfiguracioProps {
  isOpen: boolean
  onClose: () => void
  usuariId?: string
}

type SeccioActiva = 'perfil' | 'privacitat' | 'notificacions' | 'aparença' | 'idioma' | 'seguretat' | 'aplicacions' | 'dades'

export default function ModalConfiguracio({ 
  isOpen, 
  onClose,
  usuariId = 'user-1'
}: ModalConfiguracioProps) {
  
  const [seccioActiva, setSeccioActiva] = useState<SeccioActiva>('perfil')
  const [guardant, setGuardant] = useState(false)
  const [canvisNoGuardats, setCanvisNoGuardats] = useState(false)
  const [modalConfiguracioEmailsObert, setModalConfiguracioEmailsObert] = useState(false)
  
  // Hook per obtenir l'idioma actual
  const { idioma } = useIdioma()
  
  // Hook per traduccions automàtiques
  const t = useT()
  
  // Traduccions de l'avís legal segons idioma
  const avisosLegals = {
    ca: {
      titol: "Avís Important sobre Privacitat i Responsabilitat",
      paragraf1: "La Pública prioritza la teva privacitat i seguretat. Per defecte, tots els teus dades personals i sensibles estan configurats com a PRIVATS.",
      paragraf2: "La plataforma NO es fa responsable de les dades que decideixis fer públiques mitjançant la modificació d'aquesta configuració. Ets l'únic responsable de la informació que comparteixes públicament.",
      paragraf3: "Recomanem màxima precaució abans de fer públiques dades com el teu email, telèfon o data de naixement. Aquestes dades poden ser utilitzades per tercers de formes que podrien comprometre la teva privacitat o seguretat.",
      acceptacio: "En acceptar aquests termes, reconeixes que has llegit i entès aquest avís, i que assumeixes tota la responsabilitat sobre les dades que facis públiques.",
      consells: "Consells de Privacitat",
      consell1: "Revisa regularment la teva configuració de privacitat",
      consell2: "Sigues selectiu amb les connexions que acceptes",
      consell3: "No comparteixis mai informació sensible en perfils públics",
      consell4: "Utilitza contrasenyes fortes i úniques",
      consell5: "Activa l'autenticació de dos factors per més seguretat"
    },
    es: {
      titol: "Aviso Importante sobre Privacidad y Responsabilidad",
      paragraf1: "La Pública prioriza tu privacidad y seguridad. Por defecto, todos tus datos personales y sensibles están configurados como PRIVADOS.",
      paragraf2: "La plataforma NO se hace responsable de los datos que decidas hacer públicos mediante la modificación de esta configuración. Eres el único responsable de la información que compartas públicamente.",
      paragraf3: "Recomendamos máxima precaución antes de hacer públicos datos como tu email, teléfono o fecha de nacimiento. Estos datos pueden ser utilizados por terceros de formas que podrían comprometer tu privacidad o seguridad.",
      acceptacio: "Al aceptar estos términos, reconoces que has leído y entendido este aviso, y que asumes toda la responsabilidad sobre los datos que hagas públicos.",
      consells: "Consejos de Privacidad",
      consell1: "Revisa regularmente tu configuración de privacidad",
      consell2: "Sé selectivo con las conexiones que aceptas",
      consell3: "No compartas nunca información sensible en perfiles públicos",
      consell4: "Utiliza contraseñas fuertes y únicas",
      consell5: "Activa la autenticación de dos factores para más seguridad"
    },
    eu: {
      titol: "Pribatutasun eta Erantzukizunari buruzko Ohar Garrantzitsua",
      paragraf1: "La Pública-k zure pribatutasuna eta segurtasuna lehenesten ditu. Lehenespenez, zure datu pertsonal eta sentikor guztiak PRIBATU gisa konfiguratuta daude.",
      paragraf2: "Plataformak EZ du bere gain hartzen konfigurazio hau aldatuz publiko egiten dituzun datuen erantzukizunik. Publikoki partekatzen duzun informazioaren erantzule bakarra zu zara.",
      paragraf3: "Arreta handia izatea gomendatzen dugu zure emaila, telefonoa edo jaiotze-data bezalako datuak publiko egin aurretik. Datu hauek hirugarrenek erabil ditzakete zure pribatutasuna edo segurtasuna arriskuan jar dezaketen moduetan.",
      acceptacio: "Baldintza hauek onartuz, abisu hau irakurri eta ulertu duzula aitortzen duzu, eta publiko egiten dituzun datuen erantzukizun osoa hartzen duzu.",
      consells: "Pribatutasun Aholkuak",
      consell1: "Berrikusi aldizka zure pribatutasun konfigurazioa",
      consell2: "Izan selektiboa onartzen dituzun konexioekin",
      consell3: "Ez partekatu inoiz informazio sentikorra profil publikoetan",
      consell4: "Erabili pasahitz sendo eta bakarrak",
      consell5: "Aktibatu bi faktoreko autentifikazioa segurtasun gehiagorako"
    },
    gl: {
      titol: "Aviso Importante sobre Privacidade e Responsabilidade",
      paragraf1: "La Pública prioriza a túa privacidade e seguridade. Por defecto, todos os teus datos persoais e sensibles están configurados como PRIVADOS.",
      paragraf2: "A plataforma NON se fai responsable dos datos que decidas facer públicos mediante a modificación desta configuración. Es o único responsable da información que compartas publicamente.",
      paragraf3: "Recomendamos máxima precaución antes de facer públicos datos como o teu email, teléfono ou data de nacemento. Estes datos poden ser utilizados por terceiros de formas que poderían comprometer a túa privacidade ou seguridade.",
      acceptacio: "Ao aceptar estes termos, recoñeces que liches e entendiches este aviso, e que asumes toda a responsabilidade sobre os datos que fagas públicos.",
      consells: "Consellos de Privacidade",
      consell1: "Revisa regularmente a túa configuración de privacidade",
      consell2: "Sé selectivo coas conexións que aceptas",
      consell3: "Non compartas nunca información sensible en perfís públicos",
      consell4: "Utiliza contrasinais fortes e únicos",
      consell5: "Activa a autenticación de dous factores para máis seguridade"
    }
  }
  
  // Obtenir les traduccions segons l'idioma actual (amb fallback a castellà)
  const traduccions = avisosLegals[idioma as keyof typeof avisosLegals] || avisosLegals.es
  
  // Estats de configuració
  const [configuracio, setConfiguracio] = useState({
    // Perfil
    nom: 'Manel Amador',
    cognoms: 'García López',
    email: 'plegats.cat@gmail.com',
    telefon: '+34 600 123 456',
    bio: 'Funcionari públic interessat en la innovació i la transformació digital',
    ubicacio: 'Barcelona, Catalunya',
    dataNaixement: '1985-06-15',
    
    // Privacitat
    perfilPublic: false,
    mostrarEmail: false,
    mostrarTelefon: false,
    mostrarUbicacio: true,
    mostrarDataNaixement: false,
    permetMissatgesDesconeguts: false,
    permetSolicitudsConnexio: true,
    mostrarActivitat: true,
    mostrarGrups: true,
    indexacioMotorsCerca: false,
    
    // Notificacions
    notifMissatges: true,
    notifMencions: true,
    notifSolicituds: true,
    notifGrups: true,
    notifEvents: true,
    emailsResumSetmanal: true,
    pushMobil: false,
    
    // Aparença
    tema: 'sistema' as 'clar' | 'fosc' | 'sistema',
    colorAccent: '#3b82f6',
    tamanyFont: 'mitjana' as 'petita' | 'mitjana' | 'gran',
    animacions: true,
    
    // Idioma
    idioma: 'ca',
    formatData: 'DD/MM/YYYY',
    formatHora: '24h',
    zonaHoraria: 'Europe/Madrid',
    
    // Seguretat
    autenticacio2FA: false,
    sessionsActives: 3,
    ultimCanviContrasenya: '2024-01-15',
    preguntesSeguretat: true,
    
    // Aplicacions
    aplicacionsConnectades: [
      { id: '1', nom: 'Google Calendar', connectat: true, permisos: ['llegir', 'escriure'] },
      { id: '2', nom: 'Microsoft Teams', connectat: false, permisos: ['llegir'] }
    ],
    
    // Dades
    espaiUtilitzat: 1.2, // GB
    espaiTotal: 5, // GB
    exportacionsRecents: 2
  })

  const seccions = [
    { id: 'perfil' as const, nom: 'Perfil i Compte', icona: User, color: 'text-blue-600' },
    { id: 'privacitat' as const, nom: 'Privacitat', icona: Shield, color: 'text-green-600' },
    { id: 'notificacions' as const, nom: 'Notificacions', icona: Bell, color: 'text-yellow-600' },
    { id: 'aparença' as const, nom: 'Aparença', icona: Palette, color: 'text-purple-600' },
    { id: 'idioma' as const, nom: 'Idioma i Regió', icona: Globe, color: 'text-indigo-600' },
    { id: 'seguretat' as const, nom: 'Seguretat', icona: Lock, color: 'text-red-600' },
    { id: 'aplicacions' as const, nom: 'Aplicacions', icona: Link2, color: 'text-teal-600' },
    { id: 'dades' as const, nom: 'Dades i Emmagatzematge', icona: Database, color: 'text-gray-600' }
  ]

  // Detectar canvis no guardats
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (canvisNoGuardats) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [canvisNoGuardats])

  const handleCanviarConfiguracio = (clau: string, valor: any) => {
    setConfiguracio(prev => ({
      ...prev,
      [clau]: valor
    }))
    setCanvisNoGuardats(true)
  }

  const handleGuardar = async () => {
    setGuardant(true)
    
    try {
      // Simular guardat (en producció seria una crida a API)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Guardar en localStorage
      localStorage.setItem(`user-${usuariId}-config`, JSON.stringify(configuracio))
      
      setCanvisNoGuardats(false)
      audioNotificacions.playExit()
      
    } catch (error) {
      console.error('Error guardant configuració:', error)
      audioNotificacions.playError()
    } finally {
      setGuardant(false)
    }
  }

  const handleTancar = () => {
    if (canvisNoGuardats) {
      const confirmar = window.confirm('Tens canvis sense guardar. Vols sortir igualment?')
      if (!confirmar) return
    }
    
    setSeccioActiva('perfil')
    setCanvisNoGuardats(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleTancar} />
      
      {/* Modal principal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex overflow-hidden">
        
        {/* Sidebar de navegació */}
        <div className="w-72 bg-gray-50 border-r flex flex-col">
          {/* Header sidebar */}
          <div className="p-6 border-b bg-white">
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-gray-700" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Configuració</h2>
                <p className="text-sm text-gray-600">Gestiona el teu compte</p>
              </div>
            </div>
          </div>

          {/* Navegació */}
          <nav className="flex-1 p-4 overflow-y-auto">
            {seccions.map(seccio => {
              const Icona = seccio.icona
              const esActiva = seccioActiva === seccio.id
              
              return (
                <button
                  key={seccio.id}
                  onClick={() => setSeccioActiva(seccio.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-2 transition-all ${
                    esActiva 
                      ? 'bg-white shadow-sm border border-gray-200' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icona className={`w-5 h-5 ${esActiva ? seccio.color : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${
                      esActiva ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {seccio.nom}
                    </span>
                  </div>
                  {esActiva && <ChevronRight className="w-4 h-4 text-gray-400" />}
                </button>
              )
            })}
          </nav>

          {/* Footer sidebar */}
          <div className="p-4 border-t">
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Tancar Sessió</span>
            </button>
          </div>
        </div>

        {/* Contingut principal */}
        <div className="flex-1 flex flex-col">
          {/* Header del contingut */}
          <div className="px-8 py-6 border-b bg-white flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                {seccions.find(s => s.id === seccioActiva)?.nom}
              </h3>
            </div>
            <button
              onClick={handleTancar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Contingut scrollable */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {/* SECCIÓ PERFIL */}
            {seccioActiva === 'perfil' && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Informació Personal</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={configuracio.nom}
                        onChange={(e) => handleCanviarConfiguracio('nom', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cognoms
                      </label>
                      <input
                        type="text"
                        value={configuracio.cognoms}
                        onChange={(e) => handleCanviarConfiguracio('cognoms', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={configuracio.email}
                        onChange={(e) => handleCanviarConfiguracio('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telèfon
                      </label>
                      <input
                        type="tel"
                        value={configuracio.telefon}
                        onChange={(e) => handleCanviarConfiguracio('telefon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Biografia
                      </label>
                      <textarea
                        value={configuracio.bio}
                        onChange={(e) => handleCanviarConfiguracio('bio', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ubicació
                      </label>
                      <input
                        type="text"
                        value={configuracio.ubicacio}
                        onChange={(e) => handleCanviarConfiguracio('ubicacio', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Naixement
                      </label>
                      <input
                        type="date"
                        value={configuracio.dataNaixement}
                        onChange={(e) => handleCanviarConfiguracio('dataNaixement', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Gestió del Compte</h4>
                  
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Key className="w-5 h-5 text-gray-600" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">Canviar Contrasenya</p>
                          <p className="text-xs text-gray-600">Últim canvi: {configuracio.ultimCanviContrasenya}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-gray-600" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">Descarregar les meves dades</p>
                          <p className="text-xs text-gray-600">Obtén una còpia de totes les teves dades</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50">
                      <div className="flex items-center space-x-3">
                        <Trash2 className="w-5 h-5 text-red-600" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-red-600">Eliminar Compte</p>
                          <p className="text-xs text-gray-600">Aquesta acció no es pot desfer</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓ PRIVACITAT */}
            {seccioActiva === 'privacitat' && (
              <div className="max-w-3xl space-y-6">
                {/* AVÍS LEGAL IMPORTANT - MULTIIDIOMA */}
                <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-lg font-semibold text-amber-900 mb-2">
                        {traduccions.titol}
                      </h4>
                      <div className="space-y-2 text-sm text-amber-800">
                        <p>
                          <strong>La Pública</strong> {traduccions.paragraf1.replace('La Pública ', '')}
                        </p>
                        <p>
                          {traduccions.paragraf2}
                        </p>
                        <p>
                          {traduccions.paragraf3}
                        </p>
                      </div>
                      
                      <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                        <p className="text-xs text-amber-900">
                          {traduccions.acceptacio}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Visibilitat del Perfil</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          configuracio.perfilPublic ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                          {configuracio.perfilPublic ? (
                            <Eye className="w-5 h-5 text-red-600" />
                          ) : (
                            <EyeOff className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Perfil Públic</p>
                          <p className="text-xs text-gray-600">
                            {configuracio.perfilPublic 
                              ? '⚠️ El teu perfil és visible per a tothom'
                              : '✅ El teu perfil només és visible per connexions'}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={configuracio.perfilPublic}
                          onChange={(e) => handleCanviarConfiguracio('perfilPublic', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Informació Personal</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Controla quina informació personal és visible per altres usuaris
                  </p>
                  
                  <div className="space-y-3">
                    {[
                      { 
                        key: 'mostrarEmail', 
                        label: 'Email', 
                        risc: 'alt',
                        descripcio: 'Permet que altres vegin el teu email',
                        advertencia: '⚠️ Risc alt de spam i phishing'
                      },
                      { 
                        key: 'mostrarTelefon', 
                        label: 'Telèfon', 
                        risc: 'alt',
                        descripcio: 'Permet que altres vegin el teu número',
                        advertencia: '⚠️ Risc alt de trucades no desitjades'
                      },
                      { 
                        key: 'mostrarUbicacio', 
                        label: 'Ubicació', 
                        risc: 'mitjà',
                        descripcio: 'Mostra la teva ciutat o regió',
                        advertencia: '⚠️ Risc mitjà per la privacitat'
                      },
                      { 
                        key: 'mostrarDataNaixement', 
                        label: 'Data de Naixement', 
                        risc: 'alt',
                        descripcio: 'Mostra la teva edat',
                        advertencia: '⚠️ Pot ser utilitzat per robar identitat'
                      },
                      { 
                        key: 'mostrarActivitat', 
                        label: 'Activitat Recent', 
                        risc: 'baix',
                        descripcio: 'Mostra quan vas estar actiu per última vegada',
                        advertencia: 'ℹ️ Risc baix'
                      },
                      { 
                        key: 'mostrarGrups', 
                        label: 'Grups', 
                        risc: 'baix',
                        descripcio: 'Mostra els grups dels quals formes part',
                        advertencia: 'ℹ️ Risc baix'
                      }
                    ].map(opcio => (
                      <div 
                        key={opcio.key}
                        className={`flex items-center justify-between p-4 border rounded-lg ${
                          configuracio[opcio.key as keyof typeof configuracio] && opcio.risc === 'alt'
                            ? 'border-red-200 bg-red-50'
                            : configuracio[opcio.key as keyof typeof configuracio] && opcio.risc === 'mitjà'
                            ? 'border-amber-200 bg-amber-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">{opcio.label}</p>
                            {opcio.risc === 'alt' && (
                              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                                Risc Alt
                              </span>
                            )}
                            {opcio.risc === 'mitjà' && (
                              <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                                Risc Mitjà
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{opcio.descripcio}</p>
                          {configuracio[opcio.key as keyof typeof configuracio] && (
                            <p className={`text-xs mt-1 ${
                              opcio.risc === 'alt' ? 'text-red-600' :
                              opcio.risc === 'mitjà' ? 'text-amber-600' :
                              'text-gray-500'
                            }`}>
                              {opcio.advertencia}
                            </p>
                          )}
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={configuracio[opcio.key as keyof typeof configuracio] as boolean}
                            onChange={(e) => handleCanviarConfiguracio(opcio.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Comunicacions</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Permetre missatges de desconeguts
                        </p>
                        <p className="text-xs text-gray-600">
                          Només connexions podran enviar-te missatges directes
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={configuracio.permetMissatgesDesconeguts}
                          onChange={(e) => handleCanviarConfiguracio('permetMissatgesDesconeguts', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Permetre sol·licituds de connexió
                        </p>
                        <p className="text-xs text-gray-600">
                          Altres usuaris poden enviar-te sol·licituds
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={configuracio.permetSolicitudsConnexio}
                          onChange={(e) => handleCanviarConfiguracio('permetSolicitudsConnexio', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Motors de Cerca</h4>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Indexació en motors de cerca
                      </p>
                      <p className="text-xs text-gray-600">
                        Permet que Google i altres motors trobin el teu perfil
                      </p>
                      {configuracio.indexacioMotorsCerca && (
                        <p className="text-xs text-amber-600 mt-1">
                          ⚠️ El teu perfil pot aparèixer en resultats de cerca públics
                        </p>
                      )}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracio.indexacioMotorsCerca}
                        onChange={(e) => handleCanviarConfiguracio('indexacioMotorsCerca', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Informació adicional */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Consells de Privacitat</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Revisa regularment la teva configuració de privacitat</li>
                        <li>Sigues selectiu amb les connexions que acceptes</li>
                        <li>No comparteixis mai informació sensible en perfils públics</li>
                        <li>Utilitza contrasenyes fortes i úniques</li>
                        <li>Activa l'autenticació de dos factors per més seguretat</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓ NOTIFICACIONS */}
            {seccioActiva === 'notificacions' && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Notificacions Push</h4>
                  
                  <div className="space-y-3">
                    {[
                      { key: 'notifMissatges', label: 'Missatges nous', descripcio: 'Rebre notificacions quan arribin missatges' },
                      { key: 'notifMencions', label: 'Mencions', descripcio: 'Quan algú et mencioni en posts o comentaris' },
                      { key: 'notifSolicituds', label: 'Sol·licituds de connexió', descripcio: 'Noves sol·licituds de connexió' },
                      { key: 'notifGrups', label: 'Activitat de grups', descripcio: 'Publicacions i actualitzacions dels teus grups' },
                      { key: 'notifEvents', label: 'Esdeveniments', descripcio: 'Recordatoris d\'esdeveniments propers' }
                    ].map(opcio => (
                      <div key={opcio.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{opcio.label}</p>
                          <p className="text-xs text-gray-600">{opcio.descripcio}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={configuracio[opcio.key as keyof typeof configuracio] as boolean}
                            onChange={(e) => handleCanviarConfiguracio(opcio.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Notificacions per Email</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Resum setmanal</p>
                        <p className="text-xs text-gray-600">Rebre un resum setmanal de l'activitat</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={configuracio.emailsResumSetmanal}
                          onChange={(e) => handleCanviarConfiguracio('emailsResumSetmanal', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <button 
                      onClick={() => setModalConfiguracioEmailsObert(true)}
                      className="w-full p-4 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <div className="text-left">
                            <p className="text-sm font-medium text-blue-900">Configuració avançada d'emails</p>
                            <p className="text-xs text-blue-700">Gestiona quan rebre emails per cada tipus de notificació</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-blue-600" />
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Notificacions Mòbils</h4>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Notificacions push al mòbil</p>
                      <p className="text-xs text-gray-600">Rebre notificacions a l'app mòbil</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracio.pushMobil}
                        onChange={(e) => handleCanviarConfiguracio('pushMobil', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓ APARENÇA */}
            {seccioActiva === 'aparença' && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Tema</h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'clar', label: 'Clar', icon: Sun },
                      { value: 'fosc', label: 'Fosc', icon: Moon },
                      { value: 'sistema', label: 'Sistema', icon: Monitor }
                    ].map(tema => {
                      const Icona = tema.icon
                      return (
                        <button
                          key={tema.value}
                          onClick={() => handleCanviarConfiguracio('tema', tema.value)}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            configuracio.tema === tema.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icona className={`w-8 h-8 mx-auto mb-2 ${
                            configuracio.tema === tema.value ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                          <p className={`text-sm font-medium ${
                            configuracio.tema === tema.value ? 'text-blue-900' : 'text-gray-700'
                          }`}>
                            {tema.label}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Color d'Accent</h4>
                  
                  <div className="flex items-center space-x-4">
                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(color => (
                      <button
                        key={color}
                        onClick={() => handleCanviarConfiguracio('colorAccent', color)}
                        className={`w-12 h-12 rounded-lg border-2 ${
                          configuracio.colorAccent === color
                            ? 'border-gray-900 scale-110'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Mida del Text</h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'petita', label: 'Petita', size: 'text-xs' },
                      { value: 'mitjana', label: 'Mitjana', size: 'text-sm' },
                      { value: 'gran', label: 'Gran', size: 'text-base' }
                    ].map(mida => (
                      <button
                        key={mida.value}
                        onClick={() => handleCanviarConfiguracio('tamanyFont', mida.value)}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          configuracio.tamanyFont === mida.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`${mida.size} ${
                          configuracio.tamanyFont === mida.value ? 'text-blue-900' : 'text-gray-700'
                        }`}>
                          Aa
                        </p>
                        <p className={`text-xs mt-2 ${
                          configuracio.tamanyFont === mida.value ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          {mida.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Animacions</h4>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Activar animacions</p>
                      <p className="text-xs text-gray-600">Transicions i efectes visuals</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracio.animacions}
                        onChange={(e) => handleCanviarConfiguracio('animacions', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓ IDIOMA */}
            {seccioActiva === 'idioma' && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Idioma de la Interfície</h4>
                  
                  <select
                    value={configuracio.idioma}
                    onChange={(e) => handleCanviarConfiguracio('idioma', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ca">Català</option>
                    <option value="es">Castellano</option>
                    <option value="eu">Euskera</option>
                    <option value="gl">Galego</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Format de Data i Hora</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Format de data
                      </label>
                      <select
                        value={configuracio.formatData}
                        onChange={(e) => handleCanviarConfiguracio('formatData', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Format d'hora
                      </label>
                      <select
                        value={configuracio.formatHora}
                        onChange={(e) => handleCanviarConfiguracio('formatHora', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="24h">24 hores (14:30)</option>
                        <option value="12h">12 hores (2:30 PM)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Zona Horària</h4>
                  
                  <select
                    value={configuracio.zonaHoraria}
                    onChange={(e) => handleCanviarConfiguracio('zonaHoraria', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Europe/Madrid">Madrid (GMT+1)</option>
                    <option value="Atlantic/Canary">Canàries (GMT+0)</option>
                    <option value="Europe/London">Londres (GMT+0)</option>
                    <option value="America/New_York">Nova York (GMT-5)</option>
                  </select>
                </div>
              </div>
            )}

            {/* SECCIÓ SEGURETAT */}
            {seccioActiva === 'seguretat' && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Autenticació</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Autenticació de dos factors (2FA)</p>
                        <p className="text-xs text-gray-600">Afegeix una capa extra de seguretat</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={configuracio.autenticacio2FA}
                          onChange={(e) => handleCanviarConfiguracio('autenticacio2FA', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Key className="w-5 h-5 text-gray-600" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">Canviar contrasenya</p>
                          <p className="text-xs text-gray-600">Últim canvi: {configuracio.ultimCanviContrasenya}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Sessions Actives</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Tens {configuracio.sessionsActives} dispositius connectats
                  </p>
                  
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Tancar totes les altres sessions
                  </button>
                </div>
              </div>
            )}

            {/* SECCIÓ APLICACIONS */}
            {seccioActiva === 'aplicacions' && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Aplicacions Connectades</h4>
                  
                  <div className="space-y-3">
                    {configuracio.aplicacionsConnectades.map(app => (
                      <div key={app.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{app.nom}</p>
                          <p className="text-xs text-gray-600">
                            Permisos: {app.permisos.join(', ')}
                          </p>
                        </div>
                        {app.connectat ? (
                          <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                            Desconnectar
                          </button>
                        ) : (
                          <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                            Connectar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓ DADES */}
            {seccioActiva === 'dades' && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Emmagatzematge</h4>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-900">Espai utilitzat</p>
                      <p className="text-sm text-gray-600">
                        {configuracio.espaiUtilitzat} GB de {configuracio.espaiTotal} GB
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(configuracio.espaiUtilitzat / configuracio.espaiTotal) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Gestió de Dades</h4>
                  
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-gray-600" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">Descarregar les meves dades</p>
                          <p className="text-xs text-gray-600">Exportacions recents: {configuracio.exportacionsRecents}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50">
                      <div className="flex items-center space-x-3">
                        <Trash2 className="w-5 h-5 text-red-600" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-red-600">Eliminar totes les dades</p>
                          <p className="text-xs text-gray-600">Aquesta acció no es pot desfer</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer amb botons d'acció */}
          <div className="px-8 py-4 border-t bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {canvisNoGuardats && (
                <div className="flex items-center space-x-2 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Tens canvis sense guardar</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Restablir
              </button>
              <button
                onClick={handleGuardar}
                disabled={guardant || !canvisNoGuardats}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {guardant ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Guardant...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Guardar Canvis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}