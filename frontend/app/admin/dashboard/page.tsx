'use client'

import HeaderAdmin from '../../../src/componentes/comunes/HeaderAdmin'
import SystemStatusGrid from '../../../src/componentes/comunes/SystemStatusGrid'

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
      <div className="p-8">
        <SystemStatusGrid />
      </div>
    </div>
  )
}