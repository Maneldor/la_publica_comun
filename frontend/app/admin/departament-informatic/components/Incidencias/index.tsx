'use client'

import { 
  AlertCircle, Clock, CheckCircle, AlertTriangle, Bot, Search, X, Plus, 
  Eye, MessageSquare, Brain
} from 'lucide-react'

interface Ticket {
  id: string
  codigo: string
  titulo: string
  descripcion: string
  tipo: 'incidencia' | 'peticion' | 'consulta' | 'error'
  origen: 'interno' | 'externo'
  empresa?: string
  usuario: string
  estado: 'nuevo' | 'asignado' | 'en_proceso' | 'esperando' | 'resuelto' | 'cerrado'
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  departamento: string
  asignadoA?: string
  fechaCreacion: Date
  fechaActualizacion: Date
  sla: {
    tiempo: string
    cumplido: boolean
  }
  iaAnalisis?: {
    complejidad: number
    solucionAutomatica: boolean
    accionesRequeridas: string[]
    confianza: number
    tiempoEstimado?: string
    solucionSugerida?: string
  }
  respuestas: number
  adjuntos: number
}

interface IncidenciasProps {
  tickets: Ticket[]
  filteredTickets: Ticket[]
  selectedTicket: Ticket | null
  setSelectedTicket: (ticket: Ticket | null) => void
  ticketTypeFilter: string
  setTicketTypeFilter: (filter: string) => void
  priorityFilter: string
  setPriorityFilter: (filter: string) => void
  statusFilter: string
  setStatusFilter: (filter: string) => void
  searchFilter: string
  setSearchFilter: (search: string) => void
  setShowNewTicketModal: (show: boolean) => void
  getPriorityColor: (priority: string) => string
}

export default function Incidencias({
  tickets,
  filteredTickets,
  selectedTicket,
  setSelectedTicket,
  ticketTypeFilter,
  setTicketTypeFilter,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  searchFilter,
  setSearchFilter,
  setShowNewTicketModal,
  getPriorityColor
}: IncidenciasProps) {
  return (
    <div className="space-y-6">
      {/* Estadísticas de tickets */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Nous</span>
            <AlertCircle className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{tickets.filter(t => t.estado === 'nuevo').length}</div>
          <div className="text-xs text-red-600">+3 últimes 24h</div>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">En procés</span>
            <Clock className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{tickets.filter(t => ['asignado', 'en_proceso'].includes(t.estado)).length}</div>
          <div className="text-xs text-gray-600">4 vencent avui</div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Resolts</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{tickets.filter(t => ['resuelto', 'cerrado'].includes(t.estado)).length}</div>
          <div className="text-xs text-green-600">Aquesta setmana</div>
        </div>

        <div className="rounded-lg p-3 border border-red-200 bg-red-50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-red-700">Crítics</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-700">{tickets.filter(t => t.prioridad === 'critica').length}</div>
          <div className="text-xs text-red-600">Atenció immediata</div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">SLA en risc</span>
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{tickets.filter(t => t.sla && !t.sla.cumplido).length}</div>
          <div className="text-xs text-orange-600">&lt; 2h restants</div>
        </div>

        <div className="rounded-lg p-3 border border-purple-200 bg-purple-50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-purple-700">Resolts per IA</span>
            <Bot className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-700">
            {tickets.length > 0 ? Math.round((tickets.filter(t => t.asignadoA === 'IA' || t.asignadoA?.includes('Bot')).length / tickets.length) * 100) : 0}%
          </div>
          <div className="text-xs text-purple-600">Taxa automatització</div>
        </div>
      </div>

      {/* Filtros y acciones */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <select 
            value={ticketTypeFilter}
            onChange={(e) => setTicketTypeFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm"
          >
            <option value="all">Tots els tickets</option>
            <option value="intern">Només interns</option>
            <option value="extern">Només externs</option>
          </select>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm"
          >
            <option value="all">Totes les prioritats</option>
            <option value="critica">Crítica</option>
            <option value="alta">Alta</option>
            <option value="media">Mitjana</option>
            <option value="baixa">Baixa</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm"
          >
            <option value="all">Tots els estats</option>
            <option value="nuevo">Nou</option>
            <option value="asignado">Assignat</option>
            <option value="en_proceso">En procés</option>
            <option value="esperando">Esperant</option>
            <option value="resuelto">Resolt</option>
            <option value="cerrado">Tancat</option>
          </select>
          <div className="relative">
            <input 
              type="search" 
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar ticket..." 
              className="pl-8 pr-4 py-1.5 border border-gray-300 rounded text-sm w-64"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {(ticketTypeFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all' || searchFilter) && (
            <button
              onClick={() => {
                setTicketTypeFilter('all')
                setPriorityFilter('all')
                setStatusFilter('all')
                setSearchFilter('')
              }}
              className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Netejar filtres
            </button>
          )}
          <span className="text-sm text-gray-600">
            {filteredTickets.length} de {tickets.length} tickets
          </span>
          <button 
            onClick={() => setShowNewTicketModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Nou Ticket
          </button>
        </div>
      </div>

      {/* Tabla de tickets */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Codi</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Títol</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Origen</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Prioritat</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Estat</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Assignat</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">SLA</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">IA</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Accions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="p-3">
                  <span className="font-mono text-sm font-medium text-indigo-600">{ticket.codigo}</span>
                </td>
                <td className="p-3">
                  <div>
                    <div className="font-medium text-sm text-gray-900 max-w-xs truncate">
                      {ticket.titulo}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      <span>{ticket.usuario}</span>
                      {ticket.empresa && (
                        <>
                          <span>•</span>
                          <span>{ticket.empresa}</span>
                        </>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    ticket.origen === 'interno' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {ticket.origen}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${getPriorityColor(ticket.prioridad)}`}>
                    {ticket.prioridad}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    ticket.estado === 'nuevo' ? 'bg-blue-100 text-blue-800' :
                    ticket.estado === 'asignado' ? 'bg-yellow-100 text-yellow-800' :
                    ticket.estado === 'en_proceso' ? 'bg-purple-100 text-purple-800' :
                    ticket.estado === 'esperando' ? 'bg-orange-100 text-orange-800' :
                    ticket.estado === 'resuelto' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {ticket.estado}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    {ticket.asignadoA?.includes('Bot') && <Bot className="w-3 h-3 text-purple-600" />}
                    <span className="text-sm">{ticket.asignadoA || '-'}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-xs">
                    <div className={`font-medium ${!ticket.sla.cumplido ? 'text-red-600' : 'text-gray-600'}`}>
                      {ticket.sla.tiempo}
                    </div>
                    {!ticket.sla.cumplido && (
                      <div className="text-red-500 flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="w-3 h-3" />
                        Vençut
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  {ticket.iaAnalisis ? (
                    <div className="text-center">
                      <div className="text-xs font-bold text-purple-600">{ticket.iaAnalisis.confianza}%</div>
                      <div className="text-xs text-gray-500">{ticket.iaAnalisis.tiempoEstimado}</div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedTicket(ticket)}
                      className="text-gray-600 hover:text-indigo-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-blue-600">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista rápida de ticket seleccionado */}
      {selectedTicket && (
        <div className="bg-white rounded-lg border border-indigo-200 p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{selectedTicket.titulo}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedTicket.descripcion}</p>
            </div>
            <button 
              onClick={() => setSelectedTicket(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {selectedTicket.iaAnalisis && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-sm text-purple-900">Anàlisi IA</span>
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded">
                  {selectedTicket.iaAnalisis.confianza}% confiança
                </span>
              </div>
              <p className="text-sm text-purple-800">{selectedTicket.iaAnalisis.solucionSugerida}</p>
              <div className="mt-2 flex items-center gap-4">
                <button className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">
                  Aplicar solució IA
                </button>
                <span className="text-xs text-purple-600">
                  Temps estimat: {selectedTicket.iaAnalisis.tiempoEstimado}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Departament:</span>
              <span className="ml-2 font-medium">{selectedTicket.departamento}</span>
            </div>
            <div>
              <span className="text-gray-500">Respostes:</span>
              <span className="ml-2 font-medium">{selectedTicket.respuestas}</span>
            </div>
            <div>
              <span className="text-gray-500">Adjunts:</span>
              <span className="ml-2 font-medium">{selectedTicket.adjuntos}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}