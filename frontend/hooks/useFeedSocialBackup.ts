'use client'

import { useState } from 'react'
import { Comentari } from '../src/componentes/comunes/especificos-comunidad/ComentarisPost'

export interface Post {
  id: string
  autor: {
    nom: string
    avatar: string
    inicials: string
    rol: string
  }
  contingut: string
  imatge?: string
  dataCreacio: string
  interaccions: {
    likes: number
    comentaris: number
    comparticions: number
    usuariHaFetLike: boolean
  }
  comentaris: Comentari[]
  esPropiPost: boolean
  estaPinnat?: boolean
}

export interface NovaPublicacio {
  contingut: string
  imatge?: File
}

const POSTS_MOCK: Post[] = [
  {
    id: '1',
    autor: {
      nom: 'Gestor Empresa',
      avatar: '',
      inicials: 'GE',
      rol: 'Gestor Empresarial'
    },
    contingut: 'Fent proves amb arxius',
    dataCreacio: '5 ago 2025',
    interaccions: {
      likes: 3,
      comentaris: 1,
      comparticions: 0,
      usuariHaFetLike: false
    },
    comentaris: [],
    esPropiPost: false
  }
]

export function useFeedSocial() {
  const [posts] = useState<Post[]>(POSTS_MOCK)
  const [filtre, setFiltre] = useState<'tots' | 'nous'>('tots')
  const [carregant] = useState(false)

  const crearPost = async (novaPublicacio: NovaPublicacio): Promise<Post> => {
    return posts[0] // Retorna el primer post como placeholder
  }

  const ferLike = (postId: string) => {
    // Función vacía por ahora
  }

  const compartir = (postId: string) => {
    // Función vacía por ahora
  }

  const afegirComentari = (postId: string, contingut: string) => {
    // Función vacía por ahora
  }

  const eliminarPost = (postId: string) => {
    // Función vacía por ahora
  }

  const editarPost = (postId: string, nouContingut: string) => {
    // Función vacía por ahora
  }

  const pinnarPost = (postId: string) => {
    // Función vacía por ahora
  }

  const postsFiltrats = posts.filter(post => {
    if (filtre === 'nous') {
      return post.dataCreacio?.includes('ara mateix') || post.dataCreacio?.includes('ago')
    }
    return true
  })

  return {
    posts: postsFiltrats,
    filtre,
    setFiltre,
    crearPost,
    ferLike,
    compartir,
    afegirComentari,
    eliminarPost,
    editarPost,
    pinnarPost,
    carregant
  }
}