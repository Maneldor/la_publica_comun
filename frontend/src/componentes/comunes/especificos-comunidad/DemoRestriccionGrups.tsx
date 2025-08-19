'use client'

import { useState } from 'react'
import { useGroupMembership } from '../../../contextos/GroupMembershipContext'
import ModalConfirmacioGrup from './ModalConfirmacioGrup'
import ModalAlertesAdmin from './ModalAlertesAdmin'
import { Users, Lock, Globe, AlertTriangle, Shield } from 'lucide-react'

export default function DemoRestriccionGrups() {
  const { 
    grupsPrivats, 
    alertes, 
    intentarUnirseGrup, 
    abandonarGrup, 
    teGrupPrivat, 
    potUnirseGrupPrivat 
  } = useGroupMembership()
  
  const [modalConfirmacioObert, setModalConfirmacioObert] = useState(false)
  const [modalAlertesObert, setModalAlertesObert] = useState(false)
  const [grupSeleccionat, setGrupSeleccionat] = useState<{
    id: string
    nom: string
    categoria: 'afinidad' | 'profesional' | 'geografico'
    tipus: 'publico' | 'privado' | 'oculto'
  } | null>(null)
  const [esRestriccioBloqueig, setEsRestriccioBloqueig] = useState(false)

  // Grups mock per demostració
  const grupsDisponibles = [
    {
      id: 'grup-oposicions-educacio',
      nom: 'Oposicions Educació 2025',
      categoria: 'profesional' as const,
      tipus: 'privado' as const,
      descripcio: 'Grup privat per preparar oposicions d\'educació',
      membres: 45
    },
    {
      id: 'grup-funcionaris-sanitaris',
      nom: 'Funcionaris Sanitaris',
      categoria: 'profesional' as const,
      tipus: 'privado' as const,
      descripcio: 'Grup privat per funcionaris del sector salut',
      membres: 32
    },
    {
      id: 'grup-esports-catalunya',
      nom: 'Esports Catalunya',
      categoria: 'afinidad' as const,
      tipus: 'publico' as const,
      descripcio: 'Grup públic per compartir aficions esportives',
      membres: 128
    },
    {
      id: 'grup-barcelona-centre',
      nom: 'Barcelona Centre',
      categoria: 'geografico' as const,
      tipus: 'publico' as const,
      descripcio: 'Grup geogràfic de Barcelona centre',
      membres: 89
    }
  ]

  const handleIntentarUnirseGrup = async (grup: typeof grupsDisponibles[0]) => {
    const podeUnirse = potUnirseGrupPrivat(grup.categoria)
    const grupActual = grupsPrivats.find(g => 
      (g.categoria === 'profesional' || g.categoria === 'afinidad') && 
      g.tipus === 'privado' && 
      g.esActiu
    )

    setGrupSeleccionat({
      id: grup.id,
      nom: grup.nom,
      categoria: grup.categoria,
      tipus: grup.tipus
    })

    // Si és grup privat/professional i ja té un grup privat
    if ((grup.tipus === 'privado' && !podeUnirse)) {
      setEsRestriccioBloqueig(true)
    } else {
      setEsRestriccioBloqueig(false)
    }

    setModalConfirmacioObert(true)
  }

  const handleConfirmarUnio = async () => {
    if (!grupSeleccionat) return
    
    await intentarUnirseGrup(
      grupSeleccionat.id,
      grupSeleccionat.nom,
      grupSeleccionat.categoria,
      grupSeleccionat.tipus
    )
  }

  const handleAbandonarGrup = async (grupId: string) => {
    if (confirm('Estàs segur que vols abandonar aquest grup?')) {
      await abandonarGrup(grupId)
    }
  }

  const getIconoTipus = (tipus: string) => {
    switch (tipus) {
      case 'publico': return <Globe size={16} className="text-green-500" />
      case 'privado': return <Lock size={16} className="text-yellow-500" />
      case 'oculto': return <AlertTriangle size={16} className="text-red-500" />
      default: return <Users size={16} className="text-gray-500" />
    }
  }

  const getIconoCategoria = (categoria: string) => {
    switch (categoria) {
      case 'profesional': return <Shield size={16} className="text-blue-500" />
      case 'afinidad': return <Users size={16} className="text-purple-500" />
      case 'geografico': return <Globe size={16} className="text-green-500" />
      default: return <Users size={16} className="text-gray-500" />
    }
  }

  const alertesNoProcessades = alertes.filter(a => !a.processada).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demo: Restricció Grups Privats</h1>
          <p className="text-gray-600">Prova el sistema de control d'accés a grups privats/professionals</p>
        </div>
        
        {alertesNoProcessades > 0 && (
          <button
            onClick={() => setModalAlertesObert(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <AlertTriangle size={16} />
            <span>Alertes ({alertesNoProcessades})</span>
          </button>
        )}
      </div>

      {/* Estat actual */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">El teu estat actual:</h3>
        {teGrupPrivat() ? (
          <div className="flex items-center space-x-2 text-blue-800">
            <Lock size={16} />
            <span>Ja ets membre d'un grup privat/professional</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-green-800">
            <Users size={16} />
            <span>Pots unir-te a un grup privat/professional</span>
          </div>
        )}
      </div>

      {/* Els meus grups */}
      {grupsPrivats.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Els meus grups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grupsPrivats.map((grup) => (
              <div key={grup.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getIconoTipus(grup.tipus)}
                    {getIconoCategoria(grup.categoria)}
                    <h3 className="font-medium text-gray-900">{grup.nom}</h3>
                  </div>
                  {(grup.categoria === 'profesional' || grup.categoria === 'afinidad') && grup.tipus === 'privado' && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Grup únic
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <p>Categoria: {grup.categoria}</p>
                  <p>Tipus: {grup.tipus}</p>
                  <p>Data unió: {grup.dataUnio.toLocaleDateString('ca-ES')}</p>
                </div>
                
                <button
                  onClick={() => handleAbandonarGrup(grup.id)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Abandonar grup
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grups disponibles */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Grups disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {grupsDisponibles.map((grup) => {
            const jaEsMembre = grupsPrivats.some(g => g.id === grup.id)
            const podeUnirse = potUnirseGrupPrivat(grup.categoria)
            const esRestringit = grup.tipus === 'privado' && !podeUnirse
            
            return (
              <div key={grup.id} className={`bg-white border rounded-lg p-4 ${esRestringit ? 'border-red-200' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getIconoTipus(grup.tipus)}
                    {getIconoCategoria(grup.categoria)}
                    <h3 className="font-medium text-gray-900">{grup.nom}</h3>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                      {grup.categoria}
                    </span>
                    {grup.tipus === 'privado' && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Privat
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{grup.descripcio}</p>
                <p className="text-xs text-gray-500 mb-4">{grup.membres} membres</p>
                
                {jaEsMembre ? (
                  <span className="inline-flex items-center space-x-1 text-sm text-green-600 font-medium">
                    <Users size={14} />
                    <span>Ja ets membre</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleIntentarUnirseGrup(grup)}
                    className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                      esRestringit
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {esRestringit ? 'Accés restringit' : 'Unir-se'}
                  </button>
                )}
                
                {esRestringit && (
                  <p className="text-xs text-red-600 mt-2">
                    Ja tens un grup privat/professional
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Modals */}
      <ModalConfirmacioGrup
        isOpen={modalConfirmacioObert}
        onClose={() => setModalConfirmacioObert(false)}
        onConfirmar={handleConfirmarUnio}
        grupNom={grupSeleccionat?.nom || ''}
        grupActualNom={grupsPrivats.find(g => 
          (g.categoria === 'profesional' || g.categoria === 'afinidad') && 
          g.tipus === 'privado' && 
          g.esActiu
        )?.nom}
        esRestriccioBloqueig={esRestriccioBloqueig}
      />

      <ModalAlertesAdmin
        isOpen={modalAlertesObert}
        onClose={() => setModalAlertesObert(false)}
      />
    </div>
  )
}