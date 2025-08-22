'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Bell, MessageCircle, Users, UserPlus, Check, Settings } from 'lucide-react'
import { emailNotificacionsService } from '../../../servicios/emailNotificacions'
import { audioNotificacions } from '../../../utils/audioNotificacions'

interface ModalConfiguracioEmailsProps {
  isOpen: boolean
  onClose: () => void
  usuariId?: string
}

export default function ModalConfiguracioEmails({ 
  isOpen, 
  onClose,
  usuariId = 'user-1'
}: ModalConfiguracioEmailsProps) {
  
  const [configuracio, setConfiguracio] = useState({
    missatges: true,
    mencions: true,
    solicituds: true,
    grups: true
  })
  
  const [guardant, setGuardant] = useState(false)
  const [configGuardada, setConfigGuardada] = useState(false)

  // Carregar configuració actual
  useEffect(() => {
    if (isOpen) {
      const configActual = emailNotificacionsService.obtenirConfiguracioEmail(usuariId)
      setConfiguracio(configActual)
      setConfigGuardada(false)
    }
  }, [isOpen, usuariId])

  const handleCanviarConfiguracio = (tipus: keyof typeof configuracio) => {
    setConfiguracio(prev => ({
      ...prev,
      [tipus]: !prev[tipus]
    }))
    audioNotificacions.playMissatgeEnviat()
  }

  const handleGuardar = async () => {
    setGuardant(true)
    
    try {
      // Simular guardat (en producció seria una crida a API)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      emailNotificacionsService.actualitzarConfiguracioEmail(usuariId, configuracio)
      
      setConfigGuardada(true)
      audioNotificacions.playExit()
      
      setTimeout(() => {
        setConfigGuardada(false)
      }, 3000)
      
    } catch (error) {
      console.error('Error guardant configuració:', error)
      audioNotificacions.playError()
    } finally {
      setGuardant(false)
    }
  }

  const handleTancar = () => {
    setConfigGuardada(false)
    onClose()
  }

  if (!isOpen) return null

  const opcionsConfiguracio = [
    {
      clau: 'missatges' as const,
      icona: MessageCircle,
      titol: 'Missatges nous',
      descripcio: 'Rebre emails quan arribin nous missatges privats',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      clau: 'mencions' as const,
      icona: Bell,
      titol: 'Mencions',
      descripcio: 'Rebre emails quan algú et mencioni en grups o posts',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-200'
    },
    {
      clau: 'solicituds' as const,
      icona: UserPlus,
      titol: 'Sol·licituds de connexió',
      descripcio: 'Rebre emails quan algú vulgui connectar amb tu',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200'
    },
    {
      clau: 'grups' as const,
      icona: Users,
      titol: 'Invitacions a grups',
      descripcio: 'Rebre emails quan et conviden a nous grups',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleTancar} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Configuració d'Emails
              </h2>
              <p className="text-sm text-gray-600">
                Gestiona quan vols rebre notificacions per correu electrònic
              </p>
            </div>
          </div>
          <button
            onClick={handleTancar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Contingut */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          
          {/* Explicació */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">
                  Com funcionen les notificacions per email?
                </h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Només rebràs emails quan <strong>no estiguis online</strong> a La Pública. 
                  Si estàs navegant activament a la plataforma, no s'enviarà cap email per evitar duplicar notificacions.
                </p>
              </div>
            </div>
          </div>

          {/* Opcions de configuració */}
          <div className="space-y-4">
            {opcionsConfiguracio.map(opcio => {
              const Icona = opcio.icona
              const estaActivat = configuracio[opcio.clau]
              
              return (
                <div
                  key={opcio.clau}
                  className={`border rounded-lg p-4 transition-all cursor-pointer hover:shadow-sm ${
                    estaActivat ? opcio.borderColor : 'border-gray-200'
                  }`}
                  onClick={() => handleCanviarConfiguracio(opcio.clau)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      estaActivat ? opcio.bgColor : 'bg-gray-100'
                    }`}>
                      <Icona className={`w-6 h-6 ${
                        estaActivat ? opcio.color : 'text-gray-500'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-medium ${
                          estaActivat ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {opcio.titol}
                        </h3>
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                          estaActivat 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          {estaActivat && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                      <p className={`text-sm leading-relaxed ${
                        estaActivat ? 'text-gray-600' : 'text-gray-500'
                      }`}>
                        {opcio.descripcio}
                      </p>
                      
                      {estaActivat && (
                        <div className="mt-2 text-xs text-blue-600 font-medium">
                          ✓ Activat - Rebràs emails per aquesta notificació
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Exemple d'email */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">
              📧 Exemple d'email de notificació:
            </h4>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">
                  De: noreply@lapublica.cat
                </div>
                <div className="font-medium text-gray-900 mb-1">
                  Per: plegats.cat@gmail.com
                </div>
                <div className="font-medium text-gray-900 mb-3">
                  Assumpte: Nou missatge de Maria García
                </div>
                <div className="text-gray-600 text-xs">
                  Hola Manel! Has rebut un nou missatge de Maria García...
                  <br />
                  <span className="text-blue-600 underline">
                    → Veure Missatge
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mostrar missatge de confirmació */}
          {configGuardada && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 text-green-800">
                <Check className="w-5 h-5" />
                <span className="font-medium">
                  Configuració guardada correctament!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Els canvis s'aplicaran immediatament a les noves notificacions
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleTancar}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel·lar
            </button>
            <button
              onClick={handleGuardar}
              disabled={guardant}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {guardant ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Guardant...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Guardar Configuració</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}