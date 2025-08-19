'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useFeedSocial } from '../../hooks/useFeedSocial'
import type { Post, NovaPublicacio } from '../../hooks/useFeedSocial'

interface PostsContextType {
  posts: Post[]
  crearPost: (publicacio: NovaPublicacio) => Promise<Post>
  ferLike: (postId: string) => void
  compartir: (postId: string) => void
  afegirComentari: (postId: string, contingut: string) => void
  eliminarPost: (postId: string) => void
  editarPost: (postId: string, nouContingut: string) => void
  pinnarPost: (postId: string) => void
  carregant: boolean
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

interface PostsProviderProps {
  children: ReactNode
}

export function PostsProvider({ children }: PostsProviderProps) {
  const feedSocial = useFeedSocial()

  return (
    <PostsContext.Provider value={feedSocial}>
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostsContext)
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider')
  }
  return context
}