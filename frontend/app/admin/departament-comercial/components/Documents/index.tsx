'use client'

import { 
  Folder, FileText, Image, Video, Download, Upload, 
  Search, Filter, Plus, Edit, Eye, Trash2, Share2,
  Star, Tag, Clock, User
} from 'lucide-react'

interface DocumentsProps {
  // Props que s'afegiran quan es desenvolupi completament
}

export default function Documents({}: DocumentsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Folder className="w-8 h-8 text-blue-600" />
              Biblioteca de Documents
            </h2>
            <p className="text-gray-600 mt-2">
              Materials de venda, presentacions i recursos comercials centralitzats
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Pujar Document
          </button>
        </div>

        {/* Tipus de documents */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <FileText className="w-6 h-6 text-red-600 mb-2 mx-auto" />
            <h3 className="font-medium text-red-900">Propostes</h3>
            <p className="text-xs text-red-700">Templates i models</p>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <Image className="w-6 h-6 text-green-600 mb-2 mx-auto" />
            <h3 className="font-medium text-green-900">Presentacions</h3>
            <p className="text-xs text-green-700">Slides i materials</p>
          </div>
          
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
            <Video className="w-6 h-6 text-purple-600 mb-2 mx-auto" />
            <h3 className="font-medium text-purple-900">Demos</h3>
            <p className="text-xs text-purple-700">Vídeos producte</p>
          </div>
          
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
            <Star className="w-6 h-6 text-orange-600 mb-2 mx-auto" />
            <h3 className="font-medium text-orange-900">Casos d'èxit</h3>
            <p className="text-xs text-orange-700">References</p>
          </div>
          
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
            <Tag className="w-6 h-6 text-indigo-600 mb-2 mx-auto" />
            <h3 className="font-medium text-indigo-900">Recursos</h3>
            <p className="text-xs text-indigo-700">Documentació</p>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Buscar documents..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded w-full text-sm"
            />
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded text-sm">
            <option>Tots els tipus</option>
            <option>Propostes</option>
            <option>Presentacions</option>
            <option>Demos</option>
            <option>Casos d'èxit</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded text-sm">
            <option>Més recents</option>
            <option>Més descarregats</option>
            <option>Alfabètic</option>
            <option>Per tamany</option>
          </select>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Biblioteca de Documents en desenvolupament
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Sistema complet de gestió documental amb organització per categories, 
            cerca avançada i control de versions.
          </p>
          
          {/* Features previstes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Gestió Arxius
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Pujada múltiple</li>
                <li>• Previsualització</li>
                <li>• Control versions</li>
                <li>• Etiquetatge</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-green-600" />
                Compartició
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Enllaços segurs</li>
                <li>• Permisos granulars</li>
                <li>• Seguiment descàrregues</li>
                <li>• Caducitat enllaços</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-600" />
                Cerca Avançada
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cerca full-text</li>
                <li>• Filtres múltiples</li>
                <li>• Categories</li>
                <li>• Metadades</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}