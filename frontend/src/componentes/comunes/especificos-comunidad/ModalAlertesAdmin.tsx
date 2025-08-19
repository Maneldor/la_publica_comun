'use client'

import { useState } from 'react'
import { useGroupMembership } from '../../../contextos/GroupMembershipContext'
import { AlertTriangle, X, Check, Eye, Clock, Users } from 'lucide-react'

interface ModalAlertesAdminProps {
  isOpen: boolean
  onClose: () => void
}

export default function ModalAlertesAdmin({ isOpen, onClose }: ModalAlertesAdminProps) {
  const { 
    alertes, 
    marcarAlertaLlegida, 
    marcarAlertaProcessada,
    processarSolicitud 
  } = useGroupMembership()
  
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<string | null>(null)
  const [processant, setProcessant] = useState<string | null>(null)

  if (!isOpen) return null

  const alertesNoProcessades = alertes.filter(alerta => !alerta.processada)
  const alertesProcessades = alertes.filter(alerta => alerta.processada)

  const formatTime = (date: Date) => {
    return date.toLocaleString('ca-ES', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleProcessarAlerta = async (alertaId: string, accio: 'aprovar' | 'denegar' | 'revisar') => {
    setProcessant(alertaId)
    
    try {
      if (accio === 'revisar') {
        marcarAlertaLlegida(alertaId)
      } else {
        marcarAlertaProcessada(alertaId)
      }
      
      // Simular delay d'API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAlertaSeleccionada(null)
    } catch (error) {
      console.error('Error processant alerta:', error)
    } finally {
      setProcessant(null)
    }
  }

  const getEstatColor = (alerta: any) => {
    if (alerta.processada) return 'bg-green-50 border-green-200'
    if (alerta.llegida) return 'bg-blue-50 border-blue-200'
    return 'bg-red-50 border-red-200'
  }

  const getEstatIcon = (alerta: any) => {
    if (alerta.processada) return <Check size={16} className="text-green-600" />
    if (alerta.llegida) return <Eye size={16} className="text-blue-600" />
    return <AlertTriangle size={16} className="text-red-600" />
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-red-500" size={24} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Alertes d'Administració</h2>
              <p className="text-sm text-gray-600">Gestiona intents múltiples de grups privats</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Estadístiques */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{alertesNoProcessades.length}</div>
              <div className="text-sm text-gray-600">Pendents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {alertes.filter(a => a.llegida && !a.processada).length}
              </div>
              <div className="text-sm text-gray-600">En revisió</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{alertesProcessades.length}</div>
              <div className="text-sm text-gray-600">Processades</div>
            </div>
          </div>
        </div>

        {/* Contingut */}
        <div className="flex-1 overflow-hidden">
          {alertes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Users size={64} className="mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Cap alerta pendent</h3>
              <p className="text-sm">No hi ha intents múltiples de grups privats per revisar</p>
            </div>
          ) : (
            <div className="p-6 overflow-y-auto h-full">
              
              {/* Alertes pendents */}
              {alertesNoProcessades.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock size={16} className="mr-2 text-red-500" />
                    Alertes pendents ({alertesNoProcessades.length})
                  </h3>
                  
                  <div className="space-y-4">
                    {alertesNoProcessades.map((alerta) => (
                      <div
                        key={alerta.id}
                        className={`border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md ${getEstatColor(alerta)}`}
                        onClick={() => setAlertaSeleccionada(alerta.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getEstatIcon(alerta)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium text-gray-900">Intent múltiple de grup privat</h4>
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                  Urgent
                                </span>
                              </div>
                              
                              <p className="text-sm text-gray-700 mb-3">
                                <strong>{alerta.usuariNom}</strong> ha intentat unir-se a "
                                <strong>{alerta.grupSolicitudNom}</strong>" mentre ja és membre de "
                                <strong>{alerta.grupActualNom}</strong>"
                              </p>
                              
                              <div className="text-xs text-gray-500">
                                {formatTime(alerta.dataCreacio)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {!alerta.llegida && (
                              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                            )}
                          </div>
                        </div>

                        {/* Detalls expandits */}
                        {alertaSeleccionada === alerta.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="bg-white rounded-lg p-4 space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Grup actual</h5>
                                  <div className="text-sm">
                                    <p className="font-medium text-blue-600">{alerta.grupActualNom}</p>
                                    <p className="text-gray-600">Grup privat professional</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Grup sol·licitat</h5>
                                  <div className="text-sm">
                                    <p className="font-medium text-orange-600">{alerta.grupSolicitudNom}</p>
                                    <p className="text-gray-600">Nou grup privat professional</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <p className="text-sm text-gray-600">
                                  L'usuari només pot estar en un grup privat/professional alhora
                                </p>
                                
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleProcessarAlerta(alerta.id, 'revisar')
                                    }}
                                    disabled={processant === alerta.id}
                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                                  >
                                    Marcar com llegida
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleProcessarAlerta(alerta.id, 'denegar')
                                    }}
                                    disabled={processant === alerta.id}
                                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                                  >
                                    Resoldre
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alertes processades */}
              {alertesProcessades.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <Check size={16} className="mr-2 text-green-500" />
                    Alertes processades ({alertesProcessades.length})
                  </h3>
                  
                  <div className="space-y-3">
                    {alertesProcessades.slice(0, 5).map((alerta) => (
                      <div
                        key={alerta.id}
                        className={`border rounded-lg p-4 ${getEstatColor(alerta)} opacity-75`}
                      >
                        <div className="flex items-start space-x-3">
                          {getEstatIcon(alerta)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-700 text-sm">Intent múltiple de grup privat</h4>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Resolt
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600">
                              {alerta.usuariNom} - {alerta.grupSolicitudNom}
                            </p>
                            
                            <div className="text-xs text-gray-500">
                              {formatTime(alerta.dataCreacio)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {alertesProcessades.length > 5 && (
                      <div className="text-center py-2">
                        <span className="text-sm text-gray-500">
                          I {alertesProcessades.length - 5} més...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Sistema de control d'accés a grups privats actiu
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Tancar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}