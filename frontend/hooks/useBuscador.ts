'use client'

import { useState, useCallback, useMemo } from 'react'
import { Post } from './useFeedSocial'

export interface ResultatBusqueda {
  posts: Post[]
  membres: {
    id: string
    nom: string
    inicials: string
    rol: string
    avatar?: string
  }[]
  grups: {
    id: string
    nom: string
    descripcio: string
    membres: number
  }[]
}

// Mock data per membres i grups
const MEMBRES_MOCK = [
  {
    id: '1',
    nom: 'Maria Garcia',
    inicials: 'MG',
    rol: 'Funcionària Pública',
    avatar: ''
  },
  {
    id: '2',
    nom: 'Joan Pérez',
    inicials: 'JP',
    rol: 'Gestor Empresarial',
    avatar: ''
  },
  {
    id: '3',
    nom: 'Anna López',
    inicials: 'AL',
    rol: 'Administració Pública',
    avatar: ''
  },
  {
    id: '4',
    nom: 'Pere Martí',
    inicials: 'PM',
    rol: 'Sindicat',
    avatar: ''
  },
  {
    id: '5',
    nom: 'Manel Amador',
    inicials: 'MA',
    rol: 'Usuari',
    avatar: ''
  }
]

const GRUPS_MOCK = [
  {
    id: '1',
    nom: 'Funcionaris Catalunya',
    descripcio: 'Grup per a funcionaris de la Generalitat de Catalunya',
    membres: 245
  },
  {
    id: '2',
    nom: 'Administració Digital',
    descripcio: 'Digitalització de l\'administració pública',
    membres: 89
  },
  {
    id: '3',
    nom: 'Sindicats Units',
    descripcio: 'Coordinació sindical del sector públic',
    membres: 156
  },
  {
    id: '4',
    nom: 'Formació Contínua',
    descripcio: 'Recursos i cursos per empleats públics',
    membres: 312
  }
]

export function useBuscador(posts: Post[]) {
  const [terminiBusqueda, setTerminiBusqueda] = useState('')
  const [tipusFiltro, setTipusFiltro] = useState<'tot' | 'posts' | 'membres' | 'grups'>('tot')
  const [carregant, setCarregant] = useState(false)

  const cercar = useCallback((terme: string) => {
    setTerminiBusqueda(terme)
  }, [])

  const canviarFiltre = useCallback((tipus: 'tot' | 'posts' | 'membres' | 'grups') => {
    setTipusFiltro(tipus)
  }, [])

  const resultats = useMemo((): ResultatBusqueda => {
    if (!terminiBusqueda.trim()) {
      return {
        posts: [],
        membres: [],
        grups: []
      }
    }

    const terme = terminiBusqueda.toLowerCase()

    // Buscar en posts
    const postsFiltrats = posts.filter(post => 
      post.contingut.toLowerCase().includes(terme) ||
      post.autor.nom.toLowerCase().includes(terme) ||
      post.comentaris.some(comentari => 
        comentari.contingut.toLowerCase().includes(terme) ||
        comentari.autor.nom.toLowerCase().includes(terme)
      )
    )

    // Buscar en membres
    const membresFiltrats = MEMBRES_MOCK.filter(membre =>
      membre.nom.toLowerCase().includes(terme) ||
      membre.rol.toLowerCase().includes(terme)
    )

    // Buscar en grups
    const grupsFiltrats = GRUPS_MOCK.filter(grup =>
      grup.nom.toLowerCase().includes(terme) ||
      grup.descripcio.toLowerCase().includes(terme)
    )

    return {
      posts: postsFiltrats,
      membres: membresFiltrats,
      grups: grupsFiltrats
    }
  }, [posts, terminiBusqueda])

  const resultatsFilrats = useMemo((): ResultatBusqueda => {
    switch (tipusFiltro) {
      case 'posts':
        return { ...resultats, membres: [], grups: [] }
      case 'membres':
        return { ...resultats, posts: [], grups: [] }
      case 'grups':
        return { ...resultats, posts: [], membres: [] }
      default:
        return resultats
    }
  }, [resultats, tipusFiltro])

  const totalResultats = resultatsFilrats.posts.length + 
                         resultatsFilrats.membres.length + 
                         resultatsFilrats.grups.length

  const netejaBusqueda = useCallback(() => {
    setTerminiBusqueda('')
    setTipusFiltro('tot')
  }, [])

  return {
    terminiBusqueda,
    tipusFiltro,
    resultats: resultatsFilrats,
    totalResultats,
    carregant,
    cercar,
    canviarFiltre,
    netejaBusqueda
  }
}