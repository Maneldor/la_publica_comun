'use client'

import { useState, useCallback } from 'react'
import { analyzeContent, ModerationResult } from '../src/utils/autoModeration'

interface UseAutoModerationProps {
  onContentBlocked?: (result: ModerationResult) => void
  onContentFlagged?: (result: ModerationResult) => void
  realTimeAnalysis?: boolean
  minLength?: number
}

export const useAutoModeration = ({
  onContentBlocked,
  onContentFlagged,
  realTimeAnalysis = true,
  minLength = 10
}: UseAutoModerationProps = {}) => {
  const [moderationResult, setModerationResult] = useState<ModerationResult | null>(null)
  const [isBlocked, setIsBlocked] = useState(false)
  const [requiresReview, setRequiresReview] = useState(false)

  // Función para analizar contenido
  const analyzeText = useCallback((text: string, title?: string) => {
    if (!text || text.trim().length < minLength) {
      setModerationResult(null)
      setIsBlocked(false)
      setRequiresReview(false)
      return null
    }

    const result = analyzeContent(text.trim(), title)
    setModerationResult(result)
    setIsBlocked(!result.allowed)
    setRequiresReview(result.requiresReview)

    // Callbacks
    if (!result.allowed && onContentBlocked) {
      onContentBlocked(result)
    } else if (result.requiresReview && onContentFlagged) {
      onContentFlagged(result)
    }

    return result
  }, [minLength, onContentBlocked, onContentFlagged])

  // Función para manejar cambios de texto en tiempo real
  const handleTextChange = useCallback((text: string, title?: string) => {
    if (realTimeAnalysis) {
      return analyzeText(text, title)
    }
    return null
  }, [analyzeText, realTimeAnalysis])

  // Función para verificar antes de enviar
  const checkBeforeSubmit = useCallback((text: string, title?: string) => {
    return analyzeText(text, title)
  }, [analyzeText])

  // Función para resetear el estado
  const resetModeration = useCallback(() => {
    setModerationResult(null)
    setIsBlocked(false)
    setRequiresReview(false)
  }, [])

  // Función para obtener las props del componente de advertencia
  const getModerationWarningProps = useCallback(() => {
    if (!moderationResult || moderationResult.detected.length === 0) return null

    return {
      isVisible: true,
      type: moderationResult.action,
      message: moderationResult.message,
      confidence: moderationResult.confidence,
      isBlocked: moderationResult.action === 'block',
      requiresReview: moderationResult.action === 'review'
    }
  }, [moderationResult])

  // Función para obtener clases CSS del input
  const getInputClassName = useCallback((baseClassName: string = '') => {
    let className = baseClassName
    
    if (moderationResult?.action === 'block') {
      className += ' ring-2 ring-red-500 focus:ring-red-500'
    } else if (moderationResult?.action === 'review') {
      className += ' ring-2 ring-yellow-500 focus:ring-yellow-500'
    }
    
    return className
  }, [moderationResult])

  // Función para obtener el estado del botón de envío
  const getSubmitButtonProps = useCallback((baseClassName: string = '') => {
    const disabled = isBlocked
    let className = baseClassName
    
    if (isBlocked) {
      className += ' bg-red-500 hover:bg-red-600 focus:ring-red-500 cursor-not-allowed'
    } else if (requiresReview) {
      className += ' bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500'
    }
    
    const text = isBlocked 
      ? 'Contingut Bloquejat'
      : requiresReview
      ? 'Enviar (Revisió)'
      : 'Enviar'
    
    return { disabled, className, text }
  }, [isBlocked, requiresReview])

  return {
    // Estado
    moderationResult,
    isBlocked,
    requiresReview,
    
    // Funciones principales
    analyzeText,
    handleTextChange,
    checkBeforeSubmit,
    resetModeration,
    
    // Utilidades UI
    getModerationWarningProps,
    getInputClassName,
    getSubmitButtonProps,
    
    // Datos útiles
    confidence: moderationResult?.confidence || 0,
    detectedCategories: moderationResult?.detected.map(d => d.category) || [],
    worstCategory: moderationResult?.worstCategory,
    message: moderationResult?.message || ''
  }
}

export default useAutoModeration