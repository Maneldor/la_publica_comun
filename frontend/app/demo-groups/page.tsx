'use client'

import DemoRestriccionGrups from '../../src/componentes/comunes/especificos-comunidad/DemoRestriccionGrups'
import HeaderGlobal from '../../src/componentes/comunes/HeaderGlobal'

export default function DemoGroupsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderGlobal />
      
      <div className="max-w-6xl mx-auto">
        <DemoRestriccionGrups />
      </div>
    </div>
  )
}