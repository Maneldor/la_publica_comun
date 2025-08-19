import OpenAI from 'openai';
import { ApiError } from '../../../utils/ApiError';
import logger from '../../../utils/logger';

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // === FASE 1: IA BÁSICA - GPT-4 API BÁSICO ===
  async generateResponse(message: string, context: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Eres un agente IA especializado en ayudar empresas y administraciones públicas españolas. 
            
            CONTEXTO: ${context}
            
            INSTRUCCIONES:
            - Responde en español de manera profesional
            - Enfócate en generar valor comercial
            - Ofrece acciones concretas
            - Mantén conversación natural pero orientada a resultados
            - Si necesitas más información, pregunta específicamente`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return completion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw ApiError.internal('Error generating AI response');
    }
  }

  // === DETECCIÓN DE INTENCIONES ===
  async detectIntent(message: string, context: string): Promise<{
    taskType: string;
    confidence: number;
    extractedData: any;
  }> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Analiza el mensaje del usuario y determina qué tarea quiere realizar.

            TAREAS DISPONIBLES:
            - create_company_profile: Crear o actualizar perfil empresa
            - create_job_offer: Crear oferta de trabajo
            - analyze_competition: Analizar competencia
            - generate_report: Generar informes/estadísticas
            - engage_with_leads: Contactar con empleados interesados
            - general_conversation: Conversación general
            - schedule_meeting: Programar reunión
            - update_pricing: Actualizar precios
            - strategic_planning: Planificación estratégica

            RESPUESTA EN JSON:
            {
              "taskType": "tipo_de_tarea",
              "confidence": 0.95,
              "extractedData": {
                "datos_relevantes": "extraídos del mensaje"
              }
            }`
          },
          {
            role: 'user',
            content: `CONTEXTO: ${context}\n\nMENSAJE: ${message}`
          }
        ],
        temperature: 0.1,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content;
      return JSON.parse(response || '{"taskType": "general_conversation", "confidence": 0.5, "extractedData": {}}');
    } catch (error) {
      logger.error('Intent detection error:', error);
      return {
        taskType: 'general_conversation',
        confidence: 0.5,
        extractedData: {}
      };
    }
  }

  // === GENERACIÓN DE CONTENIDO AUTOMÁTICO ===
  async generateCompanyDescription(companyData: {
    name: string;
    sector: string;
    services?: string[];
    values?: string[];
    location?: string;
  }): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Eres un copywriter experto en crear descripciones empresariales atractivas para el sector público español.
            
            INSTRUCCIONES:
            - Crea descripción profesional pero accesible
            - Enfócate en beneficios para empleados públicos
            - Incluye credibilidad y confianza
            - Máximo 150 palabras
            - Usa lenguaje directo y convincente`
          },
          {
            role: 'user',
            content: `Crea descripción para: ${JSON.stringify(companyData)}`
          }
        ],
        temperature: 0.8,
        max_tokens: 300,
      });

      return completion.choices[0]?.message?.content || 'Descripción generada automáticamente';
    } catch (error) {
      logger.error('Content generation error:', error);
      return 'Error generando descripción';
    }
  }

  // === OPTIMIZACIÓN DE OFERTAS LABORALES ===
  async optimizeJobOffer(offerData: any, competitorInsights?: any): Promise<{
    title: string;
    description: string;
    benefits: string[];
    requirements: string[];
    optimizations: string[];
  }> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Eres un experto en reclutamiento del sector público español. Optimiza ofertas laborales para maximizar aplicaciones de empleados públicos.

            DIRECTRICES:
            - Títulos atractivos pero profesionales
            - Beneficios específicos para empleados públicos
            - Requisitos claros pero no restrictivos
            - Incluye desarrollo profesional
            - Enfócate en estabilidad y crecimiento
            
            ${competitorInsights ? `INSIGHTS COMPETENCIA: ${JSON.stringify(competitorInsights)}` : ''}
            
            RESPUESTA EN JSON:
            {
              "title": "título optimizado",
              "description": "descripción completa",
              "benefits": ["beneficio1", "beneficio2"],
              "requirements": ["requisito1", "requisito2"],
              "optimizations": ["explicación de mejoras"]
            }`
          },
          {
            role: 'user',
            content: `Optimiza esta oferta: ${JSON.stringify(offerData)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content;
      return JSON.parse(response || '{"title": "", "description": "", "benefits": [], "requirements": [], "optimizations": []}');
    } catch (error) {
      logger.error('Job offer optimization error:', error);
      throw ApiError.internal('Error optimizing job offer');
    }
  }

  // === ANÁLISIS PREDICTIVO BÁSICO ===
  async analyzeLeadScoring(leadData: {
    interactions: any[];
    profile: any;
    engagement: any;
  }): Promise<{
    score: number;
    probability: number;
    nextBestAction: string;
    reasoning: string;
  }> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Eres un analista experto en scoring de leads para el sector público español.

            CRITERIOS DE SCORING:
            - Interacciones recientes (peso 30%)
            - Perfil profesional relevante (peso 25%)
            - Engagement con contenido (peso 20%)
            - Tiempo en plataforma (peso 15%)
            - Completitud perfil (peso 10%)

            RESPUESTA JSON:
            {
              "score": 85,
              "probability": 0.85,
              "nextBestAction": "acción recomendada",
              "reasoning": "explicación del scoring"
            }`
          },
          {
            role: 'user',
            content: `Analiza este lead: ${JSON.stringify(leadData)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 400,
      });

      const response = completion.choices[0]?.message?.content;
      return JSON.parse(response || '{"score": 50, "probability": 0.5, "nextBestAction": "seguimiento", "reasoning": "Análisis básico"}');
    } catch (error) {
      logger.error('Lead scoring error:', error);
      return {
        score: 50,
        probability: 0.5,
        nextBestAction: 'seguimiento_manual',
        reasoning: 'Error en análisis automático'
      };
    }
  }

  // === GENERACIÓN DE EMAILS PERSONALIZADOS ===
  async generatePersonalizedEmail(template: string, leadData: any, companyData: any): Promise<{
    subject: string;
    content: string;
    callToAction: string;
  }> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Eres un experto en email marketing para empleados públicos españoles.

            DIRECTRICES:
            - Asunto atractivo sin ser spam
            - Personalización real (nombre, cargo, organización)
            - Valor inmediato en primeras líneas
            - CTA claro y específico
            - Tono profesional pero cercano
            - Máximo 200 palabras

            RESPUESTA JSON:
            {
              "subject": "asunto personalizado",
              "content": "contenido del email",
              "callToAction": "llamada a la acción"
            }`
          },
          {
            role: 'user',
            content: `TEMPLATE: ${template}\nLEAD: ${JSON.stringify(leadData)}\nEMPRESA: ${JSON.stringify(companyData)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content;
      return JSON.parse(response || '{"subject": "", "content": "", "callToAction": ""}');
    } catch (error) {
      logger.error('Email generation error:', error);
      throw ApiError.internal('Error generating personalized email');
    }
  }

  // === ANÁLISIS DE SENTIMIENTOS Y RESPUESTA ===
  async analyzeSentimentAndRespond(message: string, context: any): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
    suggestedResponse: string;
    escalate: boolean;
  }> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Analiza el sentimiento del mensaje y genera respuesta apropiada.

            ANÁLISIS:
            - positive: Cliente satisfecho/interesado
            - neutral: Consulta informativa
            - negative: Queja/problema

            RESPUESTA JSON:
            {
              "sentiment": "positive/neutral/negative",
              "confidence": 0.95,
              "suggestedResponse": "respuesta apropiada",
              "escalate": false
            }`
          },
          {
            role: 'user',
            content: `MENSAJE: ${message}\nCONTEXTO: ${JSON.stringify(context)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 400,
      });

      const response = completion.choices[0]?.message?.content;
      return JSON.parse(response || '{"sentiment": "neutral", "confidence": 0.5, "suggestedResponse": "", "escalate": false}');
    } catch (error) {
      logger.error('Sentiment analysis error:', error);
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        suggestedResponse: 'Gracias por tu mensaje. Un miembro de nuestro equipo se pondrá en contacto contigo.',
        escalate: true
      };
    }
  }

  // === GENERACIÓN DE INFORMES AUTOMÁTICOS ===
  async generateAutomatedReport(data: {
    metrics: Record<string, number>;
    period: string;
    companyName: string;
    previousPeriod?: Record<string, number>;
  }): Promise<{
    summary: string;
    insights: string[];
    recommendations: string[];
    trends: any[];
  }> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Eres un analista experto que genera informes empresariales claros y accionables.

            ESTRUCTURA:
            - Resumen ejecutivo (2-3 líneas)
            - Insights clave (3-5 puntos)
            - Recomendaciones accionables (3-5 acciones)
            - Tendencias identificadas

            RESPUESTA JSON:
            {
              "summary": "resumen ejecutivo",
              "insights": ["insight1", "insight2"],
              "recommendations": ["recomendación1", "recomendación2"],
              "trends": [{"metric": "nombre", "trend": "up/down/stable", "change": "+15%"}]
            }`
          },
          {
            role: 'user',
            content: `Genera informe para: ${JSON.stringify(data)}`
          }
        ],
        temperature: 0.4,
        max_tokens: 800,
      });

      const response = completion.choices[0]?.message?.content;
      return JSON.parse(response || '{"summary": "", "insights": [], "recommendations": [], "trends": []}');
    } catch (error) {
      logger.error('Report generation error:', error);
      throw ApiError.internal('Error generating automated report');
    }
  }

  // === OPTIMIZACIÓN DE PRECIOS BÁSICA ===
  async suggestPricing(serviceData: any, marketData?: any): Promise<{
    suggestedPrice: number;
    confidence: number;
    reasoning: string;
    alternatives: Array<{price: number, rationale: string}>;
  }> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Eres un consultor de pricing especializado en servicios para el sector público español.

            FACTORES:
            - Presupuestos públicos limitados
            - Procesos de licitación
            - Valor percibido
            - Competencia

            RESPUESTA JSON:
            {
              "suggestedPrice": 1500,
              "confidence": 0.85,
              "reasoning": "explicación del precio",
              "alternatives": [
                {"price": 1200, "rationale": "opción conservadora"},
                {"price": 1800, "rationale": "opción premium"}
              ]
            }`
          },
          {
            role: 'user',
            content: `SERVICIO: ${JSON.stringify(serviceData)}\nMERCADO: ${JSON.stringify(marketData)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content;
      return JSON.parse(response || '{"suggestedPrice": 0, "confidence": 0.5, "reasoning": "", "alternatives": []}');
    } catch (error) {
      logger.error('Pricing optimization error:', error);
      throw ApiError.internal('Error optimizing pricing');
    }
  }
}