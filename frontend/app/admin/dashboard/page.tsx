'use client'

import HeaderAdmin from '../../../src/componentes/comunes/HeaderAdmin'
import SystemStatusGrid from '../../../src/componentes/comunes/SystemStatusGrid'
import SystemStatusGridDepartmental from '../../../src/componentes/comunes/SystemStatusGridDepartmental'

export default function AdminDashboard() {
  // Simulamos datos de alertas para pasar al header
  const alertsData = {
    critical: 2,
    warning: 7
  }
  
  const totalAlerts = alertsData.critical + alertsData.warning

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderAdmin totalAlerts={totalAlerts} />
      <div className="p-8 space-y-8">
        <SystemStatusGrid />
        
        {/* Secciones departamentales añadidas */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Gestió Departamental</h2>
            <p className="text-sm text-gray-600">Organització per departaments especialitzats</p>
          </div>
          <SystemStatusGridDepartmental />
        </div>
      </div>
    </div>
  )
}