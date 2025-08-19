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
  const [posts, setPosts] = useState<Post[]>(POSTS_MOCK)
  const [filtre, setFiltre] = useState<'tots' | 'nous'>('tots')
  const [carregant, setCarregant] = useState(false)

  const crearPost = async (novaPublicacio: NovaPublicacio): Promise<Post> => {
    setCarregant(true)
    
    // Simular delay d'API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const nouPost: Post = {
      id: `post-${posts.length + 1}`,
      autor: {
        nom: 'Manel Amador',
        avatar: '',
        inicials: 'MA',
        rol: 'Usuari'
      },
      contingut: novaPublicacio.contingut,
      imatge: novaPublicacio.imatge ? 'nova-imatge' : undefined,
      dataCreacio: 'ara mateix',
      interaccions: {
        likes: 0,
        comentaris: 0,
        comparticions: 0,
        usuariHaFetLike: false
      },
      comentaris: [],
      esPropiPost: true
    }
    
    setPosts(prevPosts => [nouPost, ...prevPosts])
    setCarregant(false)
    
    return nouPost
  }

  const ferLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId
          ? {
              ...post,
              interaccions: {
                ...post.interaccions,
                likes: post.interaccions.usuariHaFetLike 
                  ? post.interaccions.likes - 1 
                  : post.interaccions.likes + 1,
                usuariHaFetLike: !post.interaccions.usuariHaFetLike
              }
            }
          : post
      )
    )
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