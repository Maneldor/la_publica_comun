'use client'

import { useState } from 'react'

interface Usuari {
  id: string
  nom: string
  inicials: string
  rol: string
  avatar?: string
  bio?: string
  ubicacio?: string
  departament?: string
  anyExperiencia?: number
  especialitats?: string[]
  publicacions?: number
  connexions?: number
  grups?: number
}

interface ModalPerfilUsuariProps {
  isOpen: boolean
  onClose: () => void
  usuari: Usuari
  esPerfilPropi?: boolean
}

// Dades mock ampliades per al perfil
const expandirUsuari = (usuariBasic: { id: string, nom: string, inicials: string, rol: string }): Usuari => {
  const usuarisExpandits: { [key: string]: Usuari } = {
    '1': {
      id: '1',
      nom: 'Maria Garcia',
      inicials: 'MG',
      rol: 'Funcionària Pública',
      avatar: '',
      bio: 'Especialista en administració digital amb més de 8 anys d\'experiència al sector públic. Appassionada per la transformació digital i la millora dels serveis ciutadans.',
      ubicacio: 'Barcelona, Catalunya',
      departament: 'Generalitat de Catalunya - Departament de Digitalització',
      anyExperiencia: 8,
      especialitats: ['Administració Digital', 'Gestió Pública', 'Transformació Digital', 'Serveis Ciutadans'],
      publicacions: 24,
      connexions: 156,
      grups: 8
    },
    '2': {
      id: '2',
      nom: 'Joan Pérez',
      inicials: 'JP',
      rol: 'Gestor Empresarial',
      avatar: '',
      bio: 'Gestor d\'empreses col·laboradores amb l\'administració pública. Expert en contractació pública i licitacions.',
      ubicacio: 'Girona, Catalunya',
      departament: 'Empresa Col·laboradora - Gestió i Serveis',
      anyExperiencia: 12,
      especialitats: ['Contractació Pública', 'Licitacions', 'Gestió Empresarial', 'Dret Administratiu'],
      publicacions: 31,
      connexions: 203,
      grups: 5
    },
    '3': {
      id: '3',
      nom: 'Anna López',
      inicials: 'AL',
      rol: 'Administració Pública',
      avatar: '',
      bio: 'Coordinadora de projectes a l\'administració local. Enfocada en la millora de processos i l\'atenció ciutadana.',
      ubicacio: 'Lleida, Catalunya',
      departament: 'Ajuntament de Lleida - Àrea de Ciutadania',
      anyExperiencia: 6,
      especialitats: ['Gestió Local', 'Atenció Ciutadana', 'Coordinació de Projectes', 'Administració Local'],
      publicacions: 18,
      connexions: 89,
      grups: 12
    },
    '4': {
      id: '4',
      nom: 'Pere Martí',
      inicials: 'PM',
      rol: 'Sindicat',
      avatar: '',
      bio: 'Representant sindical amb àmplia experiència en negociació col·lectiva i defensa dels drets dels treballadors públics.',
      ubicacio: 'Tarragona, Catalunya',
      departament: 'Sindicat de Treballadors Públics de Catalunya',
      anyExperiencia: 15,
      especialitats: ['Negociació Col·lectiva', 'Drets Laborals', 'Representació Sindical', 'Dret del Treball'],
      publicacions: 42,
      connexions: 278,
      grups: 3
    },
    '5': {
      id: '5',
      nom: 'Manel Amador',
      inicials: 'MA',
      rol: 'Usuari',
      avatar: '',
      bio: 'Nou membre de la comunitat interessat en connectar amb professionals del sector públic.',
      ubicacio: 'Barcelona, Catalunya',
      departament: 'En cerca d\'oportunitats',
      anyExperiencia: 2,
      especialitats: ['Administració General', 'Gestió Documental'],
      publicacions: 5,
      connexions: 12,
      grups: 2
    }
  }

  return usuarisExpandits[usuariBasic.id] || {
    ...usuariBasic,
    bio: 'Membre de la comunitat professional del sector públic.',
    ubicacio: 'Catalunya',
    departament: 'Sector Públic',
    anyExperiencia: 1,
    especialitats: ['Administració Pública'],
    publicacions: 0,
    connexions: 0,
    grups: 0
  }
}

export default function ModalPerfilUsuari({ isOpen, onClose, usuari: usuariBasic, esPerfilPropi = false }: ModalPerfilUsuariProps) {
  const [conectat, setConnectat] = useState(false)
  const usuari = expandirUsuari(usuariBasic)

  const handleConnectar = () => {
    setConnectat(!conectat)
  }

  const handleEditarPerfil = () => {
    alert('Obrint editor de perfil...')
    // Aquí aniria la lògica per obrir el formulari d'edició
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header amb imatge de portada */}
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Avatar i informació bàsica */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                {usuari.inicials}
              </div>
            </div>
            
            {/* Informació principal */}
            <div className="flex-1 mt-4 sm:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{usuari.nom}</h1>
                  <p className="text-lg text-blue-600 font-medium">{usuari.rol}</p>
                  <div className="flex items-center space-x-2 text-gray-600 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{usuari.ubicacio}</span>
                  </div>
                </div>
                
                {/* Botó de connexió o edició */}
                <div className="mt-4 sm:mt-0">
                  {esPerfilPropi ? (
                    <button
                      onClick={handleEditarPerfil}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      ✏️ Editar Perfil
                    </button>
                  ) : (
                    <button
                      onClick={handleConnectar}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        conectat
                          ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {conectat ? '✓ Connectat' : 'Connectar'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contingut del perfil */}
        <div className="px-6 pb-6">
          {/* Estadístiques */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{usuari.publicacions}</div>
              <div className="text-sm text-gray-600">Publicacions</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{usuari.connexions}</div>
              <div className="text-sm text-gray-600">Connexions</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{usuari.grups}</div>
              <div className="text-sm text-gray-600">Grups</div>
            </div>
          </div>

          {/* Biografia */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sobre mi</h3>
            <p className="text-gray-700 leading-relaxed">{usuari.bio}</p>
          </div>

          {/* Informació professional */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Informació Professional</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">{usuari.departament}</p>
                  <p className="text-sm text-gray-600">Departament</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">{usuari.anyExperiencia} anys d'experiència</p>
                  <p className="text-sm text-gray-600">Experiència professional</p>
                </div>
              </div>
            </div>
          </div>

          {/* Especialitats */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Especialitats</h3>
            <div className="flex flex-wrap gap-2">
              {usuari.especialitats?.map((especialitat, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {especialitat}
                </span>
              ))}
            </div>
          </div>

          {/* Accions addicionals */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            {!esPerfilPropi && (
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                💬 Enviar Missatge
              </button>
            )}
            <button className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ${esPerfilPropi ? 'flex-1' : 'flex-1'}`}>
              👁️ {esPerfilPropi ? 'Les meves Publicacions' : 'Veure Publicacions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}