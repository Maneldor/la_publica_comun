'use client'

import { useState, forwardRef, useImperativeHandle } from 'react'
import useAutoModeration from '../../../hooks/useAutoModeration'

interface ModeratedInputProps {
  placeholder?: string
  className?: string
  rows?: number
  multiline?: boolean
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string, moderationResult: any) => Promise<void> | void
  submitText?: string
  showSubmitButton?: boolean
  minLength?: number
  maxLength?: number
  realTimeAnalysis?: boolean
  title?: string // Para análisis conjunto título + contenido
}

export interface ModeratedInputRef {
  getValue: () => string
  setValue: (value: string) => void
  reset: () => void
  checkContent: () => any
  isContentBlocked: () => boolean
}

const ModeratedInput = forwardRef<ModeratedInputRef, ModeratedInputProps>(({
  placeholder = "Escriu el teu missatge...",
  className = "",
  rows = 3,
  multiline = false,
  disabled = false,
  value: controlledValue,
  onChange: onControlledChange,
  onSubmit,
  submitText = "Enviar",
  showSubmitButton = true,
  minLength = 10,
  maxLength,
  realTimeAnalysis = true,
  title
}, ref) => {
  const [internalValue, setInternalValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Usar valor controlado si se proporciona, sino usar valor interno
  const value = controlledValue !== undefined ? controlledValue : internalValue
  const setValue = onControlledChange || setInternalValue

  const {
    moderationResult,
    isBlocked,
    requiresReview,
    handleTextChange,
    checkBeforeSubmit,
    resetModeration,
    getModerationWarningProps,
    getInputClassName,
    getSubmitButtonProps
  } = useAutoModeration({
    realTimeAnalysis,
    minLength,
    onContentBlocked: (result) => {
      console.log('🚫 Contingut bloquejat automàticament:', result)
    },
    onContentFlagged: (result) => {
      console.log('⚠️ Contingut marcat per revisió:', result)
    }
  })

  // Exponer métodos a través de ref
  useImperativeHandle(ref, () => ({
    getValue: () => value,
    setValue: (newValue: string) => setValue(newValue),
    reset: () => {
      setValue('')
      resetModeration()
    },
    checkContent: () => checkBeforeSubmit(value, title),
    isContentBlocked: () => isBlocked
  }))

  const handleChange = (newValue: string) => {
    if (maxLength && newValue.length > maxLength) return
    
    setValue(newValue)
    if (realTimeAnalysis) {
      handleTextChange(newValue, title)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || isBlocked || isSubmitting) return

    // Verificar contenido antes de enviar
    const result = checkBeforeSubmit(value.trim(), title)
    
    if (result && !result.allowed) {
      return // Contenido bloqueado
    }

    if (onSubmit) {
      setIsSubmitting(true)
      try {
        await onSubmit(value.trim(), result)
        setValue('')
        resetModeration()
      } catch (error) {
        console.error('Error al enviar:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const inputBaseClass = `w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all ${className}`
  const inputClass = getInputClassName(inputBaseClass)
  const submitButtonProps = getSubmitButtonProps('px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors')

  return (
    <div className="space-y-3">
      {/* Input/Textarea */}
      <div className="space-y-2">
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className={inputClass}
            rows={rows}
            disabled={disabled || isSubmitting}
            maxLength={maxLength}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className={inputClass}
            disabled={disabled || isSubmitting}
            maxLength={maxLength}
          />
        )}

        {/* Contador de caracteres */}
        {maxLength && (
          <div className="flex justify-end">
            <span className={`text-xs ${
              value.length > maxLength * 0.8 
                ? value.length >= maxLength 
                  ? 'text-red-600' 
                  : 'text-yellow-600'
                : 'text-gray-500'
            }`}>
              {value.length}{maxLength ? `/${maxLength}` : ''}
            </span>
          </div>
        )}

        {/* Advertencia de moderación */}
        {(() => {
          const warningProps = getModerationWarningProps()
          if (!warningProps) return null

          return (
            <div className={`p-2 rounded-md text-sm ${
              warningProps.type === 'block' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
            }`}>
              <div className="flex items-center gap-2">
                {warningProps.isBlocked ? '❌' : '⚠️'}
                <span className="font-medium">
                  {warningProps.isBlocked 
                    ? 'Contingut bloquejat' 
                    : 'Contingut per revisar'}
                </span>
                <span className="text-xs">
                  (Confiança: {warningProps.confidence}%)
                </span>
              </div>
              {warningProps.message && (
                <p className="mt-1 text-xs">{warningProps.message}</p>
              )}
            </div>
          )
        })()}
      </div>

      {/* Botón de envío */}
      {showSubmitButton && onSubmit && (
        <form onSubmit={handleSubmit}>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitButtonProps.disabled || !value.trim() || isSubmitting}
              className={`${submitButtonProps.className} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting 
                ? 'Enviant...' 
                : submitButtonProps.text.replace('Enviar', submitText)
              }
            </button>
          </div>
        </form>
      )}
    </div>
  )
})

ModeratedInput.displayName = 'ModeratedInput'

export default ModeratedInput