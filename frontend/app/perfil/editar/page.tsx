'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ModalEditarPerfil from '../../../src/componentes/comunes/especificos-comunidad/ModalEditarPerfil'
import LayoutXarxaSocial from '../../../src/componentes/comunes/LayoutXarxaSocial'
import { useUsuario } from '../../../src/contextos/UsuarioContext'

export default function EditarPerfilPage() {
  const router = useRouter()
  const { usuario, guardarUsuario } = useUsuario()
  const [guardando, setGuardando] = useState(false)

  const handleGuardar = async (datos: any) => {
    setGuardando(true)
    
    try {
      console.log('🔄 Iniciando procés de guardat...')
      console.log('📊 Datos recibidos del modal:', datos)
      console.log('👤 Usuario actual en contexto:', usuario)
      
      // Convertir los datos del modal al formato del contexto
      const datosParaGuardar = {
        ...usuario, // Mantener datos existentes
        ...datos,   // Sobrescribir con nuevos datos
        id: usuario?.id || 'user-1' // Asegurar que tenga ID
      }
      
      console.log('💾 Datos finales para guardar:', datosParaGuardar)
      
      const exito = await guardarUsuario(datosParaGuardar)
      console.log('🔍 Resultado del guardado:', exito)
      
      if (exito) {
        console.log('✅ Datos guardados correctamente!')
        
        // Verificar que se guardó en localStorage
        const saved = localStorage.getItem('usuario-actual')
        console.log('🗄️ Datos en localStorage:', saved)
        
        // Mostrar mensaje de éxito
        alert('¡Perfil guardado correctamente!')
        
        // Navegar a la página de perfil
        setTimeout(() => {
          console.log('🔄 Navegando de vuelta al perfil...')
          router.push('/perfil')
          window.location.reload() // Forzar recarga completa de la página
        }, 1500)
        
      } else {
        console.error('❌ Error guardando los datos')
        alert('Error guardando los datos. Inténtalo de nuevo.')
      }
      
    } catch (error) {
      console.error('❌ Error inesperado:', error)
      console.error('Stack trace:', error)
      alert('Error inesperado. Inténtalo de nuevo.')
    }
    
    setGuardando(false)
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregant perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <LayoutXarxaSocial paginaActual="perfil">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <ModalEditarPerfil 
          isOpen={true}
          onClose={() => router.back()}
          datosActuales={usuario}
          onGuardar={handleGuardar}
          guardando={guardando}
        />
      </div>
    </LayoutXarxaSocial>
  )
}