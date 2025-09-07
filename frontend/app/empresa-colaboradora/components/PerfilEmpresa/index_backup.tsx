'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { 
  Building2, Edit3, Eye, Save, Upload, Globe, MapPin,
  Users, Briefcase, Trophy, Star, Camera, Link, 
  CheckCircle, Clock, AlertTriangle, X, Plus,
  Award, Shield, TrendingUp, FileText, Image,
  Mail, Phone, ExternalLink
} from 'lucide-react'
import { TarjetaEmpresa } from '../../../../src/componentes/empresas/TarjetaEmpresa'
import type { CompanyProfile } from '../../../../src/componentes/empresas/TarjetaEmpresa'

export default function PerfilEmpresa() {
  const [previewMode, setPreviewMode] = useState<'card' | 'page'>('card')

  return (
    <div className="min-h-screen">
      <h1>Perfil de l'Empresa - FUNCIONANDO</h1>
      
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setPreviewMode('card')}
          className={`px-4 py-2 rounded ${previewMode === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Targeta
        </button>
        <button
          onClick={() => setPreviewMode('page')}
          className={`px-4 py-2 rounded ${previewMode === 'page' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Pàgina completa
        </button>
      </div>

      {previewMode === 'card' ? (
        <div className="w-96 h-64 bg-blue-100 rounded-lg p-4">
          <h2>Vista Tarjeta</h2>
          <p>Contenido compacto</p>
        </div>
      ) : (
        <div className="w-full min-h-screen bg-green-100 rounded-lg p-8">
          <h2>Vista Página Completa</h2>
          <p>Contenido expandido que ocupa todo el ancho</p>
          <div className="grid grid-cols-3 gap-8 mt-8">
            <div className="bg-white p-4 rounded">Sección 1</div>
            <div className="bg-white p-4 rounded">Sección 2</div>
            <div className="bg-white p-4 rounded">Sección 3</div>
          </div>
        </div>
      )}
    </div>
  )
}