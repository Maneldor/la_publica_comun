'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Tipos de privacidad
type NivelPrivacidad = 'publico' | 'conexiones' | 'privado'

interface CampoPrivacidad {
  valor: any
  privacidad: NivelPrivacidad
}

interface DatosUsuario {
  // Datos básicos (del registro)
  id: string
  nick: string
  nombre?: CampoPrivacidad
  apellidos?: CampoPrivacidad
  email: string // Siempre privado
  comunidad: string
  
  // Datos del perfil/tarjeta
  rol?: 'embaixador' | 'administrador' | 'moderador' | 'miembro' | 'membre'
  estado?: 'activo' | 'inactivo'
  fechaRegistro?: string
  ultimaActividad?: string
  verificado?: boolean
  
  // Estadísticas
  posts?: number
  comentarios?: number
  conexiones?: number
  
  // Datos opcionales
  fechaNacimiento?: CampoPrivacidad
  genero?: CampoPrivacidad
  biografia?: CampoPrivacidad
  ubicacion?: CampoPrivacidad
  
  // Información laboral/profesional
  puesto?: CampoPrivacidad
  organizacion?: CampoPrivacidad
  departamento?: CampoPrivacidad
  anyosExperiencia?: CampoPrivacidad
  grupoFuncionario?: CampoPrivacidad
  especialidades?: CampoPrivacidad
  
  // Fotos
  fotoPerfil?: string
  fotoPortada?: string
  
  // Configuración general
  mostrarPublicaciones?: NivelPrivacidad
  mostrarConexiones?: NivelPrivacidad
  mostrarGrupos?: NivelPrivacidad
}

interface UsuarioContextType {
  usuario: DatosUsuario | null
  actualizarUsuario: (datosNuevos: Partial<DatosUsuario>) => void
  cargarUsuario: (id: string) => Promise<DatosUsuario | null>
  guardarUsuario: (datos: DatosUsuario) => Promise<boolean>
}

const UsuarioContext = createContext<UsuarioContextType | null>(null)

interface UsuarioProviderProps {
  children: ReactNode
}

export function UsuarioProvider({ children }: UsuarioProviderProps) {
  const [usuario, setUsuario] = useState<DatosUsuario | null>(null)

  // Cargar usuari des de localStorage en inicialitzar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario-actual')
    if (usuarioGuardado) {
      try {
        const usuarioData = JSON.parse(usuarioGuardado)
        setUsuario(usuarioData)
      } catch (error) {
        console.error('Error carregant usuari des de localStorage:', error)
      }
    } else {
      // Si no hi ha usuari guardat, crear un usuari per defecte
      const usuarioDefecto: DatosUsuario = {
        id: 'user-1',
        nick: '@manel_dor',
        nombre: { valor: 'Manel', privacidad: 'publico' },
        apellidos: { valor: 'Dor', privacidad: 'publico' },
        email: 'manel@lapublica.es',
        comunidad: 'Catalunya',
        
        // Datos del perfil/tarjeta
        rol: 'miembro',
        estado: 'activo',
        fechaRegistro: '2015-03-15',
        ultimaActividad: 'En línea',
        verificado: false,
        
        // Estadísticas
        posts: 12,
        comentarios: 45,
        conexiones: 8,
        
        // Información personal
        biografia: { valor: 'Funcionario público especializado en innovación administrativa y gestión de proyectos. Apasionado por la transformación digital del sector público.', privacidad: 'publico' },
        ubicacion: { valor: 'Barcelona, Catalunya', privacidad: 'conexiones' },
        
        // Información laboral
        puesto: { valor: 'Técnico Superior', privacidad: 'publico' },
        organizacion: { valor: 'Generalitat de Catalunya', privacidad: 'publico' },
        departamento: { valor: 'Innovación y Transformación Digital', privacidad: 'conexiones' },
        anyosExperiencia: { valor: '10', privacidad: 'conexiones' },
        grupoFuncionario: { valor: 'A1', privacidad: 'publico' },
        especialidades: { valor: ['Contratación Pública', 'Gestión de Proyectos', 'Innovación'], privacidad: 'publico' },
        
        // Configuración de privacidad
        mostrarPublicaciones: 'publico',
        mostrarConexiones: 'conexiones',
        mostrarGrupos: 'publico'
      }
      setUsuario(usuarioDefecto)
      localStorage.setItem('usuario-actual', JSON.stringify(usuarioDefecto))
    }
  }, [])

  const actualizarUsuario = (datosNuevos: Partial<DatosUsuario>) => {
    setUsuario(prev => {
      if (!prev) return prev
      
      const usuarioActualizado = { ...prev, ...datosNuevos }
      
      // Guardar a localStorage
      localStorage.setItem('usuario-actual', JSON.stringify(usuarioActualizado))
      
      return usuarioActualizado
    })
  }

  const cargarUsuario = async (id: string): Promise<DatosUsuario | null> => {
    // En un sistema real, faria una crida a l'API
    // Per ara, simulem la càrrega
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (id === 'user-1' || id === usuario?.id) {
      return usuario
    }
    
    // Simulació d'altres usuaris amb dades més realistes
    const usuariosMock: { [key: string]: DatosUsuario } = {
      'user-2': {
        id: 'user-2',
        nick: '@maria_santos',
        nombre: { valor: 'Maria', privacidad: 'publico' },
        apellidos: { valor: 'Santos', privacidad: 'publico' },
        email: 'maria.santos@diputacio.cat',
        comunidad: 'Catalunya',
        biografia: { valor: 'Coordinadora de projectes socials i comunitaris', privacidad: 'publico' },
        organizacion: { valor: 'Diputació de Girona', privacidad: 'publico' },
        puesto: { valor: 'Coordinadora de Projectes', privacidad: 'publico' },
        departamento: { valor: 'Àrea Social', privacidad: 'publico' },
        ubicacion: { valor: 'Girona, Catalunya', privacidad: 'publico' },
        mostrarPublicaciones: 'publico',
        mostrarConexiones: 'conexiones',
        mostrarGrupos: 'publico'
      },
      'user-3': {
        id: 'user-3',
        nick: '@jordi_dev',
        nombre: { valor: 'Jordi', privacidad: 'publico' },
        apellidos: { valor: 'Puig', privacidad: 'publico' },
        email: 'jordi.puig@techcat.cat',
        comunidad: 'Catalunya',
        biografia: { valor: 'Desenvolupador web especialitzat en solucions per al sector públic', privacidad: 'publico' },
        organizacion: { valor: 'Empresa Tecnològica SL', privacidad: 'publico' },
        puesto: { valor: 'Desenvolupador Senior', privacidad: 'publico' },
        departamento: { valor: 'Departament IT', privacidad: 'publico' },
        ubicacion: { valor: 'Tarragona, Catalunya', privacidad: 'publico' },
        mostrarPublicaciones: 'publico',
        mostrarConexiones: 'conexiones',
        mostrarGrupos: 'publico'
      },
      'user-4': {
        id: 'user-4',
        nick: '@anna_public',
        nombre: { valor: 'Anna', privacidad: 'publico' },
        apellidos: { valor: 'Martínez', privacidad: 'publico' },
        email: 'anna.martinez@gencat.cat',
        comunidad: 'Catalunya',
        biografia: { valor: 'Especialista en polítiques públiques i desenvolupament territorial', privacidad: 'publico' },
        organizacion: { valor: 'Generalitat de Catalunya', privacidad: 'publico' },
        puesto: { valor: 'Tècnica Superior', privacidad: 'publico' },
        departamento: { valor: 'Departament de Territori', privacidad: 'publico' },
        ubicacion: { valor: 'Lleida, Catalunya', privacidad: 'publico' },
        mostrarPublicaciones: 'publico',
        mostrarConexiones: 'conexiones',
        mostrarGrupos: 'publico'
      },
      'user-5': {
        id: 'user-5',
        nick: '@syndic_bcn',
        nombre: { valor: 'Pere', privacidad: 'publico' },
        apellidos: { valor: 'Vila', privacidad: 'publico' },
        email: 'pere.vila@ccoo.cat',
        comunidad: 'Catalunya',
        biografia: { valor: 'Representant sindical amb experiència en negociació col·lectiva', privacidad: 'publico' },
        organizacion: { valor: 'CCOO Catalunya', privacidad: 'publico' },
        puesto: { valor: 'Delegat Sindical', privacidad: 'publico' },
        departamento: { valor: 'Secció Sindical Administració Pública', privacidad: 'publico' },
        ubicacion: { valor: 'Barcelona, Catalunya', privacidad: 'publico' },
        mostrarPublicaciones: 'publico',
        mostrarConexiones: 'conexiones',
        mostrarGrupos: 'publico'
      }
    }
    
    // Si trobem l'usuari al mock, retornar-lo
    if (usuariosMock[id]) {
      return usuariosMock[id]
    }
    
    // Si no, generar un usuari genèric
    const usuarioMock: DatosUsuario = {
      id,
      nick: `@usuario_${id}`,
      nombre: { valor: `Usuario ${id}`, privacidad: 'publico' },
      email: `usuario${id}@lapublica.es`,
      comunidad: 'Catalunya',
      biografia: { valor: 'Biografia d\'exemple', privacidad: 'publico' },
      mostrarPublicaciones: 'publico',
      mostrarConexiones: 'conexiones',
      mostrarGrupos: 'publico'
    }
    
    return usuarioMock
  }

  const guardarUsuario = async (datos: DatosUsuario): Promise<boolean> => {
    try {
      // Simular crida a l'API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('💾 Guardant dades d\'usuari:', datos)
      
      // Actualitzar estat local i localStorage
      setUsuario(datos)
      localStorage.setItem('usuario-actual', JSON.stringify(datos))
      
      console.log('✅ Dades guardades correctament')
      return true
      
    } catch (error) {
      console.error('❌ Error guardant dades d\'usuari:', error)
      return false
    }
  }

  const value: UsuarioContextType = {
    usuario,
    actualizarUsuario,
    cargarUsuario,
    guardarUsuario
  }

  return (
    <UsuarioContext.Provider value={value}>
      {children}
    </UsuarioContext.Provider>
  )
}

export function useUsuario() {
  const context = useContext(UsuarioContext)
  if (!context) {
    throw new Error('useUsuario ha de ser usat dins d\'un UsuarioProvider')
  }
  return context
}

export type { DatosUsuario, CampoPrivacidad, NivelPrivacidad }