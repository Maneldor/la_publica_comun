'use client'

import { useState, useEffect } from 'react'
import { useGruposAvanzados } from '../../../contextos/GruposAvanzadosContext'
import { useNotifications } from '../../../contextos/NotificationsContext'
import { GrupoAvanzado, MiembroGrupoAvanzado } from '../../../../tipos/gruposAvanzados'
import { 
  X, 
  Users, 
  UserCheck, 
  UserMinus, 
  Shield, 
  FileText,
  MessageSquare,
  Calendar,
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  Pin,
  PinOff,
  Flag,
  Image as ImageIcon,
  File,
  Clock
} from 'lucide-react'

interface ModalGestionGrupoProps {
  isOpen: boolean
  onClose: () => void
  grupo: GrupoAvanzado | null
}

type TabGestion = 'solicitudes' | 'moderacion' | 'eventos' | 'incidencias'

export default function ModalGestionGrupo({ 
  isOpen, 
  onClose, 
  grupo 
}: ModalGestionGrupoProps) {
  const { 
    agregarMiembro, 
    removerMiembro,
    posts,
    crearPost
  } = useGruposAvanzados()
  
  const { afegirNotificacio } = useNotifications()
  
  const [tabActiva, setTabActiva] = useState<TabGestion>('solicitudes')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  
  // Mock de solicitudes pendientes
  const [solicitudesPendientes] = useState([
    {
      id: 'sol-1',
      usuari: {
        id: 'user-20',
        nom: 'Maria Rodriguez',
        nick: '@maria_rodriguez',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b151b04c?w=50&h=50&fit=crop&crop=face',
        organitzacio: 'Ajuntament de Lleida'
      },
      data: new Date('2025-01-15'),
      missatge: 'Hola! Soc mestra d\'educació primària i m\'interessaria molt formar part d\'aquest grup per compartir experiències educatives.'
    },
    {
      id: 'sol-2', 
      usuari: {
        id: 'user-21',
        nom: 'Josep Martinez',
        nick: '@josep_martinez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        organitzacio: 'Generalitat de Catalunya'
      },
      data: new Date('2025-01-14'),
      missatge: 'Director d\'institut interessat en participar en el grup professional.'
    }
  ])
  
  // Mock de posts per moderar
  const [postsPendents] = useState([
    {
      id: 'post-mod-1',
      autor: 'user-5',
      contingut: 'Comparteixo aquest document sobre les noves metodologies d\'avaluació...',
      tipus: 'document',
      data: new Date('2025-01-16'),
      adjunts: [{ nom: 'metodologies-avaluacio-2025.pdf', tipus: 'pdf' }]
    },
    {
      id: 'post-mod-2',
      autor: 'user-8',
      contingut: 'Foto de la formació que vam fer ahir sobre eines digitals',
      tipus: 'imatge',
      data: new Date('2025-01-15'),
      adjunts: [{ nom: 'formacio-digital.jpg', tipus: 'imatge' }]
    }
  ])
  
  // Mock de events en borrador
  const [eventsBorrador] = useState([
    {
      id: 'event-1',
      titol: 'Jornada de Metodologies Innovadores',
      descripcio: 'Sessió formativa sobre noves metodologies educatives per al curs 2025',
      data: new Date('2025-02-15'),
      ubicacio: 'Sala de formació - Dept. Educació',
      creat: new Date('2025-01-10'),
      estat: 'borrador'
    }
  ])
  
  const [incidencia, setIncidencia] = useState({
    tipus: 'spam' as 'spam' | 'contingut-inapropiat' | 'comportament' | 'altre',
    usuariAfectat: '',
    descripcio: '',
    urgent: false
  })

  if (!isOpen || !grupo) return null

  const handleAprovarSolicitud = async (solicitudId: string, usuariId: string) => {
    setCargando(true)
    try {
      await agregarMiembro(grupo.id, usuariId, 'miembro')
      afegirNotificacio({
        tipus: 'grup',
        titol: 'Solicitud aprovada',
        descripcio: 'S\'ha aprovat l\'accés d\'un nou membre al grup'
      })
    } catch (error) {
      setError('Error al aprovar la sol·licitud')
    } finally {
      setCargando(false)
    }
  }

  const handleRebutjarSolicitud = (solicitudId: string) => {
    afegirNotificacio({
      tipus: 'grup',
      titol: 'Solicitud rebutjada',
      descripcio: 'S\'ha rebutjat una sol·licitud d\'accés al grup'
    })
  }

  const handleAprovarPost = (postId: string) => {
    afegirNotificacio({
      tipus: 'grup',
      titol: 'Publicació aprovada',
      descripcio: 'S\'ha aprovat una publicació del grup'
    })
  }

  const handleRebutjarPost = (postId: string) => {
    afegirNotificacio({
      tipus: 'grup',
      titol: 'Publicació rebutjada',
      descripcio: 'S\'ha rebutjat una publicació del grup'
    })
  }

  const handleEnviarEventPerAprovacio = (eventId: string) => {
    afegirNotificacio({
      tipus: 'grup',
      titol: 'Event enviat per aprovació',
      descripcio: 'S\'ha enviat un event en borrador a l\'administrador web per la seva aprovació'
    })
  }

  const handleEnviarIncidencia = () => {
    if (!incidencia.descripcio.trim()) {
      setError('La descripció de la incidència és obligatòria')
      return
    }
    
    afegirNotificacio({
      tipus: 'grup',
      titol: 'Incidència reportada',
      descripcio: `S'ha enviat una incidència de tipus "${incidencia.tipus}" a l'administrador web`
    })
    
    // Reset form
    setIncidencia({
      tipus: 'spam',
      usuariAfectat: '',
      descripcio: '',
      urgent: false
    })
    
    setError('')
  }

  const renderSolicitudes = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Sol·licituds pendents</h3>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          {solicitudesPendientes.length} pendents
        </span>
      </div>
      
      {solicitudesPendientes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No hi ha sol·licituds pendents</p>
        </div>
      ) : (
        <div className="space-y-3">
          {solicitudesPendientes.map((solicitud) => (
            <div key={solicitud.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <img
                    src={solicitud.usuari.avatar}
                    alt={solicitud.usuari.nom}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{solicitud.usuari.nom}</h4>
                      <span className="text-sm text-gray-500">{solicitud.usuari.nick}</span>
                    </div>
                    <p className="text-sm text-gray-600">{solicitud.usuari.organitzacio}</p>
                    {solicitud.missatge && (
                      <p className="mt-2 text-sm text-gray-700">{solicitud.missatge}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Sol·licitat el {solicitud.data.toLocaleDateString('ca')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleRebutjarSolicitud(solicitud.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Rebutjar"
                  >
                    <UserMinus size={16} />
                  </button>
                  <button
                    onClick={() => handleAprovarSolicitud(solicitud.id, solicitud.usuari.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Aprovar"
                  >
                    <UserCheck size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderModeracio = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Publicacions pendents</h3>
        
        {postsPendents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No hi ha publicacions pendents de moderació</p>
          </div>
        ) : (
          <div className="space-y-3">
            {postsPendents.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">@usuari-{post.autor}</span>
                      <span className="text-xs text-gray-500">
                        {post.data.toLocaleDateString('ca')} {post.data.toLocaleTimeString('ca', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {post.tipus === 'document' && <FileText size={14} className="text-blue-500" />}
                      {post.tipus === 'imatge' && <ImageIcon size={14} className="text-green-500" />}
                    </div>
                    
                    <p className="text-gray-700 mb-3">{post.contingut}</p>
                    
                    {post.adjunts && post.adjunts.length > 0 && (
                      <div className="space-y-1">
                        {post.adjunts.map((adjunt, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <File size={14} />
                            <span>{adjunt.nom}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleRebutjarPost(post.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Rebutjar"
                    >
                      <EyeOff size={16} />
                    </button>
                    <button
                      onClick={() => handleAprovarPost(post.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Aprovar"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderEventos = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Events en borrador</h3>
        <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
          Crear event
        </button>
      </div>
      
      {eventsBorrador.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No hi ha events en borrador</p>
        </div>
      ) : (
        <div className="space-y-3">
          {eventsBorrador.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">{event.titol}</h4>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      {event.estat}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-2">{event.descripcio}</p>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} />
                      <span>{event.data.toLocaleDateString('ca')} - {event.ubicacio}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={14} />
                      <span>Creat el {event.creat.toLocaleDateString('ca')}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleEnviarEventPerAprovacio(event.id)}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                >
                  Enviar per aprovació
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderIncidencias = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Reportar incidència</h3>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Comunicació amb l'administrador web</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Utilitza aquest formulari per reportar incidències o problemes que requereixin l'atenció de l'administrador web.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipus d'incidència
          </label>
          <select
            value={incidencia.tipus}
            onChange={(e) => setIncidencia(prev => ({ ...prev, tipus: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="spam">Spam o contingut no desitjat</option>
            <option value="contingut-inapropiat">Contingut inapropiat</option>
            <option value="comportament">Comportament inadequat d'un membre</option>
            <option value="altre">Altre</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usuari afectat (opcional)
          </label>
          <input
            type="text"
            value={incidencia.usuariAfectat}
            onChange={(e) => setIncidencia(prev => ({ ...prev, usuariAfectat: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="@nick_usuari o nom de l'usuari"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripció de la incidència *
          </label>
          <textarea
            value={incidencia.descripcio}
            onChange={(e) => setIncidencia(prev => ({ ...prev, descripcio: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descriu detallament la incidència, incloent dates, usuaris implicats i captures de pantalla si cal..."
          />
        </div>
        
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={incidencia.urgent}
              onChange={(e) => setIncidencia(prev => ({ ...prev, urgent: e.target.checked }))}
              className="text-red-500"
            />
            <span className="text-sm text-gray-700">Marcar com a urgent</span>
          </label>
        </div>
        
        <button
          onClick={handleEnviarIncidencia}
          disabled={!incidencia.descripcio.trim()}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Enviar incidència a l'administrador web
        </button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Gestió del grup
            </h2>
            <p className="text-sm text-gray-600">
              {grupo.nombre}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="px-6">
            <div className="flex space-x-8">
              {[
                { key: 'solicitudes' as TabGestion, label: 'Sol·licituds', icon: Users, count: solicitudesPendientes.length },
                { key: 'moderacion' as TabGestion, label: 'Moderació', icon: Shield, count: postsPendents.length },
                { key: 'eventos' as TabGestion, label: 'Events', icon: Calendar, count: eventsBorrador.length },
                { key: 'incidencias' as TabGestion, label: 'Incidències', icon: Flag, count: 0 }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTabActiva(tab.key)}
                  className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    tabActiva === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {tabActiva === 'solicitudes' && renderSolicitudes()}
          {tabActiva === 'moderacion' && renderModeracio()}
          {tabActiva === 'eventos' && renderEventos()}
          {tabActiva === 'incidencias' && renderIncidencias()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Funcions disponibles per a administradors i moderadors de grup
          </div>
          
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Tancar
          </button>
        </div>
      </div>
    </div>
  )
}