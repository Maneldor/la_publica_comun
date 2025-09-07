import React from 'react'
import { Bot, X, Send } from 'lucide-react'
import { useEmpresaStore } from '../../../store/useEmpresaStore'
import { useTranslations } from '../../../hooks/useTranslations'

export default function AIChat() {
  const { showAIChat, setShowAIChat, chatMessage, setChatMessage } = useEmpresaStore()
  const { t } = useTranslations()

  if (!showAIChat) {
    return (
      <button
        onClick={() => setShowAIChat(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
      >
        <Bot className="w-8 h-8" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60 z-50">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-slate-200/60 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold">{t('assessorComercialIA')}</div>
                <div className="text-xs opacity-90">{t('especialistaEmpreses')}</div>
              </div>
            </div>
            <button
              onClick={() => setShowAIChat(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
              <p className="text-sm font-medium text-slate-800">👋 {t('hola')}</p>
              <p className="text-xs text-slate-600 mt-2">
                {t('pucAjudar')}
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200/50">
              <div className="text-xs font-medium text-blue-700 mb-1">💡 {t('recomanacio')}</div>
              <div className="text-sm text-blue-800">
                Les vostres ofertes tenen un 23% més de clicks aquest mes. Considereu incrementar el pressupost en les comunitats amb millor rendiment.
              </div>
            </div>

            <div className="p-3 bg-green-50 rounded-xl border border-green-200/50">
              <div className="text-xs font-medium text-green-700 mb-1">✨ {t('oportunitat')}</div>
              <div className="text-sm text-green-800">
                Catalunya i Madrid mostren alta demanda per perfils tech. Ideal per promocionar ofertes senior.
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-200/60">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={t('pregunteuMetriques')}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80"
            />
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}