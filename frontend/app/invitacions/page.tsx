'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useComunidad } from '../ComunidadContext'
import { useUsuario } from '../../src/contextos/UsuarioContext'

interface Invitacio {
  nom: string
  correu: string
}

interface InvitacioHistoric {
  id: string
  nom: string
  correu: string
  dataEnviament: string
  estat: 'pendent' | 'registrat'
  dataRegistre?: string
}

export default function InvitacionsPage() {
  const router = useRouter()
  const { configuracion } = useComunidad()
  const { usuario } = useUsuario()
  const [invitacions, setInvitacions] = useState<Invitacio[]>([
    { nom: '', correu: '' },
    { nom: '', correu: '' },
    { nom: '', correu: '' },
    { nom: '', correu: '' },
    { nom: '', correu: '' }
  ])
  const [enviant, setEnviant] = useState(false)
  const [missatgeExit, setMissatgeExit] = useState('')
  const [mostrarHistoric, setMostrarHistoric] = useState(false)
  const [mostrarBeneficis, setMostrarBeneficis] = useState(false)
  const [pestanyaActiva, setPestanyaActiva] = useState<'enviades' | 'registrades' | 'pendents'>('enviades')

  // Simular historial de invitaciones (en producción vendría del backend)
  const [historialInvitacions] = useState<InvitacioHistoric[]>([
    { id: '1', nom: 'Anna García', correu: 'anna.garcia@gencat.cat', dataEnviament: '2024-01-15', estat: 'registrat', dataRegistre: '2024-01-18' },
    { id: '2', nom: 'Marc Puig', correu: 'marc.puig@gencat.cat', dataEnviament: '2024-01-20', estat: 'registrat', dataRegistre: '2024-01-22' },
    { id: '3', nom: 'Laura Martí', correu: 'laura.marti@gencat.cat', dataEnviament: '2024-01-25', estat: 'pendent' },
    { id: '4', nom: 'Jordi Soler', correu: 'jordi.soler@gencat.cat', dataEnviament: '2024-01-28', estat: 'registrat', dataRegistre: '2024-02-01' },
    { id: '5', nom: 'Maria Vila', correu: 'maria.vila@gencat.cat', dataEnviament: '2024-02-02', estat: 'pendent' },
    { id: '6', nom: 'Pere Roca', correu: 'pere.roca@gencat.cat', dataEnviament: '2024-02-05', estat: 'registrat', dataRegistre: '2024-02-06' },
    { id: '7', nom: 'Núria Camps', correu: 'nuria.camps@gencat.cat', dataEnviament: '2024-02-08', estat: 'pendent' },
    { id: '8', nom: 'Albert Serra', correu: 'albert.serra@gencat.cat', dataEnviament: '2024-02-10', estat: 'registrat', dataRegistre: '2024-02-12' },
  ])

  const invitacionsEnviades = historialInvitacions.length
  const invitacionsAcceptades = historialInvitacions.filter(inv => inv.estat === 'registrat').length
  const invitacionsPendents = historialInvitacions.filter(inv => inv.estat === 'pendent').length

  const handleCanviInvitacio = (index: number, camp: keyof Invitacio, valor: string) => {
    const novesInvitacions = [...invitacions]
    novesInvitacions[index][camp] = valor
    setInvitacions(novesInvitacions)
  }

  const handleEnviarInvitacions = async () => {
    const invitacionsValides = invitacions.filter(inv => inv.nom && inv.correu)
    
    if (invitacionsValides.length === 0) {
      alert('Si us plau, omple almenys una invitació')
      return
    }

    setEnviant(true)
    
    setTimeout(() => {
      setMissatgeExit(`S'han enviat ${invitacionsValides.length} invitacions correctament!`)
      setEnviant(false)
      
      setTimeout(() => {
        setInvitacions([
          { nom: '', correu: '' },
          { nom: '', correu: '' },
          { nom: '', correu: '' },
          { nom: '', correu: '' },
          { nom: '', correu: '' }
        ])
        setMissatgeExit('')
      }, 3000)
    }, 1500)
  }

  const obtenerNomUsuari = () => {
    if (!usuario) return 'Un company'
    const nom = usuario.nombre?.valor || usuario.nombre || ''
    const cognoms = usuario.apellidos?.valor || usuario.apellidos || ''
    return `${nom} ${cognoms}`.trim() || usuario.nick
  }

  const generarMissatgeCorreu = (nomDestinatari: string) => {
    const nomRemitent = obtenerNomUsuari()
    const comunitat = configuracion.nombre
    
    return `Hola ${nomDestinatari},

${nomRemitent} t'ha convidat a unir-te a La Pública, la xarxa social exclusiva i gratuïta per a empleats públics de ${comunitat}.

La Pública és molt més que una xarxa social:

🌐 Xarxa Social Completa
Comparteix experiències, notícies i recursos amb companys del sector públic en un entorn segur i privat.

👥 Grups Temàtics
Uneix-te a grups per departaments, interessos professionals o projectes. Crea els teus propis grups!

💬 Missatgeria Privada
Comunica't directament amb altres membres, comparteix arxius i mantén converses professionals.

📢 Esdeveniments i Formació
Descobreix esdeveniments, cursos i oportunitats de formació exclusives per al sector públic.

🤝 100% Gratuït
Sense quotes ni pagaments. La Pública és i sempre serà gratuïta per a tots els empleats públics.

Registra't ara:
https://lapublica.${configuracion.domini || 'cat'}/registre?ref=${usuario?.id}

T'esperem!

Salutacions cordials,
${nomRemitent}

--
La Pública - Xarxa Social d'Empleats Públics
${comunitat}
www.lapublica.${configuracion.domini || 'cat'}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header compacto */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Tornar</span>
            </button>
            
            <h1 className="text-2xl font-bold text-gray-900">Programa Embaixadors</h1>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span className="text-sm font-medium text-gray-600">Nivell: Ambaixador</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Panel izquierdo - Información */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span>
                Les teves estadístiques
              </h3>
              
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-600">{invitacionsEnviades}</div>
                  <div className="text-sm text-gray-600">Invitacions enviades</div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600">{invitacionsAcceptades}</div>
                  <div className="text-sm text-gray-600">Companys registrats</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">66%</div>
                  <div className="text-sm text-gray-600">Taxa d'èxit</div>
                </div>
              </div>
              
              <hr className="my-6" />
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  <span>🎖️</span> Programa Embaixador
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Descobreix tots els beneficis de ser Embaixador.
                </p>
                <button
                  onClick={() => setMostrarBeneficis(true)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <span>🏆</span>
                  Veure beneficis
                </button>
              </div>
            </div>
          </div>

          {/* Panel central - Formulario */}
          <div className="col-span-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Convida als teus companys</h2>
                <p className="text-sm text-gray-600 mt-1">Ajuda a fer créixer la nostra comunitat</p>
              </div>
              
              {/* Mensaje de éxito */}
              {missatgeExit && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
                  <span>✅</span>
                  <span>{missatgeExit}</span>
                </div>
              )}
              
              <div className="space-y-3">
                {invitacions.map((invitacio, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={invitacio.nom}
                          onChange={(e) => handleCanviInvitacio(index, 'nom', e.target.value)}
                          placeholder="Nom complet"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="email"
                          value={invitacio.correu}
                          onChange={(e) => handleCanviInvitacio(index, 'correu', e.target.value)}
                          placeholder="correu@exemple.cat"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleEnviarInvitacions}
                  disabled={enviant}
                  className={`px-8 py-3 rounded-lg text-white font-medium transition-all transform hover:scale-105 ${
                    enviant 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg'
                  }`}
                >
                  {enviant ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Enviant...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>✉️</span>
                      Enviar invitacions
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Panel derecho - Recordatorio */}
          <div className="col-span-3">
            <div className="bg-amber-50 border border-amber-200 rounded-lg shadow-lg p-6 sticky top-6">
              <h3 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                Recordatori Important
              </h3>
              
              <ul className="text-sm text-amber-800 space-y-3">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Les invitacions només es poden enviar a empleats públics verificables</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Cada invitació genera un enllaç únic i personal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Les invitacions caduquen als 30 dies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Els convidats hauran de verificar la seva condició d'empleat públic</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Rebràs una notificació quan un convidat es registri</span>
                </li>
              </ul>
              
              <hr className="my-6 border-amber-300" />
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span>📊</span> Històric d'invitacions
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  Consulta l'estat de totes les teves invitacions enviades.
                </p>
                <button
                  onClick={() => setMostrarHistoric(!mostrarHistoric)}
                  className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                >
                  {mostrarHistoric ? 'Tancar històric' : 'Veure estat'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal/Popup del histórico de invitaciones */}
        {mostrarHistoric && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Fondo oscuro */}
              <div 
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={() => setMostrarHistoric(false)}
              />
              
              {/* Centrar el modal */}
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              
              {/* Contenido del modal */}
              <div className="inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Històric d'invitacions</h2>
                  <button
                    onClick={() => setMostrarHistoric(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              
              {/* Pestañas */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setPestanyaActiva('enviades')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    pestanyaActiva === 'enviades'
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Invitacions enviades ({invitacionsEnviades})
                </button>
                <button
                  onClick={() => setPestanyaActiva('registrades')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    pestanyaActiva === 'registrades'
                      ? 'bg-white text-green-600 shadow'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Invitacions amb registre ({invitacionsAcceptades})
                </button>
                <button
                  onClick={() => setPestanyaActiva('pendents')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    pestanyaActiva === 'pendents'
                      ? 'bg-white text-amber-600 shadow'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Invitacions pendents de registre ({invitacionsPendents})
                </button>
              </div>
              
              {/* Contenido de las pestañas */}
              <div className="space-y-3">
                {pestanyaActiva === 'enviades' && historialInvitacions.map((inv) => (
                  <div key={inv.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{inv.nom}</h4>
                      <p className="text-sm text-gray-600">{inv.correu}</p>
                      <p className="text-xs text-gray-500 mt-1">Enviada el {new Date(inv.dataEnviament).toLocaleDateString('ca-ES')}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      inv.estat === 'registrat' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.estat === 'registrat' ? 'Registrat' : 'Pendent'}
                    </div>
                  </div>
                ))}
                
                {pestanyaActiva === 'registrades' && historialInvitacions
                  .filter(inv => inv.estat === 'registrat')
                  .map((inv) => (
                    <div key={inv.id} className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{inv.nom}</h4>
                          <p className="text-sm text-gray-600">{inv.correu}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Registrat el {new Date(inv.dataRegistre!).toLocaleDateString('ca-ES')}
                          </p>
                        </div>
                        <div className="text-green-600">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {pestanyaActiva === 'pendents' && historialInvitacions
                  .filter(inv => inv.estat === 'pendent')
                  .map((inv) => (
                    <div key={inv.id} className="bg-amber-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{inv.nom}</h4>
                          <p className="text-sm text-gray-600">{inv.correu}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Enviada el {new Date(inv.dataEnviament).toLocaleDateString('ca-ES')} - 
                            Caduca el {new Date(new Date(inv.dataEnviament).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ca-ES')}
                          </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Reenviar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal/Popup de beneficios del embajador */}
        {mostrarBeneficis && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Fondo oscuro */}
              <div 
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={() => setMostrarBeneficis(false)}
              />
              
              {/* Centrar el modal */}
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              
              {/* Contenido del modal */}
              <div className="inline-block w-full max-w-3xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span>🎖️</span>
                    Programa Embaixador - Beneficis
                  </h2>
                  <button
                    onClick={() => setMostrarBeneficis(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Niveles de embajador */}
                <div className="space-y-6">
                  {/* Nivel Bronze */}
                  <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">🥉</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-orange-800 mb-2">Embaixador de Bronze</h3>
                        <p className="text-orange-700 font-medium mb-3">Amb 5 registres confirmats</p>
                        <ul className="space-y-2 text-sm text-orange-600">
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500">✓</span>
                            <span>Insígnia de Bronze al teu perfil</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500">✓</span>
                            <span>Reconeixement públic a la comunitat</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-500">✓</span>
                            <span>Accés prioritari a nous grups temàtics</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Nivel Plata */}
                  <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-300">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">🥈</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Embaixador d'Argent</h3>
                        <p className="text-gray-700 font-medium mb-3">Amb 10 registres confirmats</p>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start gap-2">
                            <span className="text-gray-500">✓</span>
                            <span>Insígnia d'Argent al teu perfil</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-gray-500">✓</span>
                            <span>Pots ser Moderador del teu grup de feina</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-gray-500">✓</span>
                            <span>Prioritat en l'organització d'esdeveniments</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-gray-500">✓</span>
                            <span>Espai destacat al directori de membres</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Nivel Oro */}
                  <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">🥇</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-yellow-800 mb-2">Embaixador d'Or</h3>
                        <p className="text-yellow-700 font-medium mb-3">Amb 20 registres confirmats</p>
                        <ul className="space-y-2 text-sm text-yellow-700">
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-600">✓</span>
                            <span>Insígnia d'Or al teu perfil</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-600">✓</span>
                            <span>Rol d'Ambaixador Oficial de La Pública</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-600">✓</span>
                            <span>Crear i gestionar múltiples grups</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-600">✓</span>
                            <span>Participació en decisions de la comunitat</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-600">✓</span>
                            <span>Menció especial en comunicacions oficials</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Beneficios adicionales */}
                  <div className="bg-blue-50 rounded-lg p-4 mt-6">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <span>💡</span> Beneficis addicionals per a tots els Embaixadors
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Visibilitat destacada en la xarxa social</li>
                      <li>• Invitacions il·limitades (sense restricció de 5 per vegada)</li>
                      <li>• Estadístiques detallades de les teves invitacions</li>
                      <li>• Suport prioritari de l'equip de La Pública</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}