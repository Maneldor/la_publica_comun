'use client'

import { useState, useCallback } from 'react'

export function useCrearPostModal() {
  const [modalObert, setModalObert] = useState(false)

  const obrirModal = useCallback(() => {
    setModalObert(true)
  }, [])

  const tancarModal = useCallback(() => {
    setModalObert(false)
  }, [])

  return {
    modalObert,
    obrirModal,
    tancarModal
  }
}