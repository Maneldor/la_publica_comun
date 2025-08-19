'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTema } from '../../../hooks/useComunidad';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  taskType?: 'company-profile' | 'job-offer' | 'competitive-analysis' | 'email-campaign' | 'report';
  status?: 'pending' | 'processing' | 'completed' | 'approved';
}

interface TaskSuggestion {
  id: string;
  title: string;
  description: string;
  icon: string;
  taskType: string;
}

const taskSuggestions: TaskSuggestion[] = [
  {
    id: '1',
    title: 'Crear Perfil de Empresa',
    description: 'Te ayudo a completar tu perfil corporativo',
    icon: '🏢',
    taskType: 'company-profile'
  },
  {
    id: '2',
    title: 'Diseñar Oferta Laboral',
    description: 'Crear una nueva oferta de empleo público',
    icon: '💼',
    taskType: 'job-offer'
  },
  {
    id: '3',
    title: 'Análisis Competitivo',
    description: 'Analizar empresas similares en tu sector',
    icon: '🔍',
    taskType: 'competitive-analysis'
  },
  {
    id: '4',
    title: 'Campaña de Email',
    description: 'Crear campaña dirigida a empleados públicos',
    icon: '📧',
    taskType: 'email-campaign'
  }
];

export function AIChatInterface() {
  const tema = useTema();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: '¡Hola! Soy tu Asistente Virtual de La Pública. Estoy aquí para ayudarte a gestionar tu perfil empresarial, crear ofertas de trabajo, analizar la competencia y mucho más. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string, taskType?: string) => {
    if (!message.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      taskType: taskType as any
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular respuesta del AI
    setTimeout(() => {
      const aiResponse = generateAIResponse(message, taskType);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string, taskType?: string): ChatMessage => {
    let content = '';
    let responseTaskType: any = undefined;
    let status: any = 'processing';

    switch (taskType) {
      case 'company-profile':
        content = 'Perfecto, vamos a crear tu perfil de empresa. Necesito algunos datos básicos:\n\n🏢 **Nombre de la empresa**\n📍 **Sector de actividad**\n📧 **Email de contacto**\n📞 **Teléfono**\n🗺️ **Dirección completa**\n\n¿Podrías proporcionarme esta información?';
        responseTaskType = 'company-profile';
        break;
      case 'job-offer':
        content = 'Excelente, vamos a crear una oferta laboral atractiva. Para diseñar la oferta perfecta necesito:\n\n💼 **Puesto/Cargo**\n🎯 **Funciones principales**\n🎓 **Requisitos mínimos**\n💰 **Rango salarial**\n📅 **Tipo de contrato**\n🗺️ **Ubicación**\n\n¡Empecemos por el puesto que quieres cubrir!';
        responseTaskType = 'job-offer';
        break;
      case 'competitive-analysis':
        content = 'Perfecto, haré un análisis competitivo completo. Voy a investigar:\n\n🔍 **Empresas similares en tu sector**\n📊 **Sus ofertas y condiciones**\n💰 **Rangos salariales del mercado**\n🎯 **Estrategias de contratación**\n📈 **Tendencias del sector**\n\nEsto tardará unos minutos. ¿En qué sector te centras principalmente?';
        responseTaskType = 'competitive-analysis';
        break;
      case 'email-campaign':
        content = 'Genial, vamos a crear una campaña de email efectiva. Te ayudaré con:\n\n🎯 **Público objetivo** (empleados públicos)\n📧 **Asunto atractivo**\n✍️ **Contenido personalizado**\n🗺️ **Segmentación geográfica**\n📅 **Programación de envío**\n\n¿Cuál es el objetivo principal de esta campaña?';
        responseTaskType = 'email-campaign';
        break;
      default:
        content = 'He entendido tu consulta. Basado en mi análisis, te recomiendo que empecemos por definir mejor tus objetivos. ¿Podrías darme más detalles sobre lo que necesitas?\n\nMientras tanto, puedo ayudarte con:\n• Crear o actualizar tu perfil de empresa\n• Diseñar ofertas laborales\n• Analizar la competencia\n• Generar campañas de marketing';
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content,
      timestamp: new Date(),
      taskType: responseTaskType,
      status
    };
  };

  const handleTaskSuggestion = (task: TaskSuggestion) => {
    handleSendMessage(task.title, task.taskType);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: `${tema.primario}15` }}>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
            backgroundColor: `${tema.primario}15`
          }}>
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: tema.texto }}>Asistente Virtual IA</h1>
            <p className="text-sm" style={{ color: tema.textoSecundario }}>Tu consultor empresarial personalizado</p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium" style={{ color: tema.primario }}>En línea</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl px-4 py-3 rounded-2xl ${message.type === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`} style={{
                backgroundColor: message.type === 'user' ? tema.primario : `${tema.secundario}10`,
                color: message.type === 'user' ? 'white' : tema.texto
              }}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.status && (
                  <div className="mt-2 flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      message.status === 'processing' ? 'bg-yellow-500 animate-pulse' :
                      message.status === 'completed' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-xs opacity-75">
                      {message.status === 'processing' ? 'Procesando...' :
                       message.status === 'completed' ? 'Completado' : 'Pendiente'}
                    </span>
                  </div>
                )}
                <div className="mt-1 text-xs opacity-60">
                  {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-3xl px-4 py-3 rounded-2xl rounded-bl-md" style={{
                backgroundColor: `${tema.secundario}10`,
                color: tema.texto
              }}>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Task Suggestions */}
        {messages.length === 1 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: tema.texto }}>Tareas Sugeridas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {taskSuggestions.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleTaskSuggestion(task)}
                  className="p-4 rounded-xl border text-left hover:shadow-md transition-all duration-200"
                  style={{
                    borderColor: `${tema.primario}20`,
                    backgroundColor: `${tema.primario}05`
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{task.icon}</span>
                    <div>
                      <h4 className="font-medium mb-1" style={{ color: tema.texto }}>{task.title}</h4>
                      <p className="text-sm" style={{ color: tema.textoSecundario }}>{task.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t" style={{ borderColor: `${tema.primario}15` }}>
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje o pregunta..."
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 resize-none"
              style={{
                borderColor: `${tema.primario}20`,
                focusRingColor: tema.primario
              }}
              disabled={isTyping}
            />
          </div>
          <button
            onClick={() => handleSendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isTyping}
            className="px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
            style={{
              backgroundColor: tema.primario,
              color: 'white'
            }}
          >
            Enviar
          </button>
        </div>
        
        <div className="mt-2 text-xs text-center" style={{ color: tema.textoSecundario }}>
          Presiona Enter para enviar • Shift + Enter para nueva línea
        </div>
      </div>
    </div>
  );
}