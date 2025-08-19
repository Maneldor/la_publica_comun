import prisma from '../../../config/database';
import { ApiError } from '../../../utils/ApiError';
import { AGENT_MISSIONS, PLAN_FEATURES } from '../../../config/constants';
import logger from '../../../utils/logger';
import { OpenAIService } from './openai.service';
import { ScrapingService } from './scraping.service';
import { EmailService } from './email.service';

export class ChatService {
  private openai: OpenAIService;
  private scraping: ScrapingService;
  private email: EmailService;

  constructor() {
    this.openai = new OpenAIService();
    this.scraping = new ScrapingService();
    this.email = new EmailService();
  }

  // === CHAT EMPRESA-AGENTE ===
  async initiateChatSession(companyId: string, agentId: string, initialMessage?: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { user: true, aiAgents: true }
    });

    if (!company) {
      throw ApiError.notFound('Company not found');
    }

    const agent = await prisma.aIAgent.findUnique({
      where: { id: agentId, companyId }
    });

    if (!agent) {
      throw ApiError.notFound('AI Agent not found or not assigned to company');
    }

    // Crear sesión de chat
    const session = await prisma.$transaction(async (tx) => {
      const chatSession = await tx.chatSession.create({
        data: {
          companyId,
          agentId,
          status: 'active',
          context: this.buildInitialContext(company, agent),
        }
      });

      // Mensaje inicial del agente
      await tx.chatMessage.create({
        data: {
          sessionId: chatSession.id,
          type: 'agent',
          content: this.generateWelcomeMessage(agent, company),
          metadata: {
            taskType: 'welcome',
            suggestedActions: this.getSuggestedActions(agent.level, company)
          }
        }
      });

      // Si hay mensaje inicial del usuario
      if (initialMessage) {
        await tx.chatMessage.create({
          data: {
            sessionId: chatSession.id,
            type: 'user',
            content: initialMessage
          }
        });
      }

      return chatSession;
    });

    logger.info(`Chat session initiated`, { companyId, agentId, sessionId: session.id });

    return session;
  }

  async sendMessage(sessionId: string, content: string, userId: string) {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        company: { include: { user: true } },
        agent: true,
        messages: { orderBy: { timestamp: 'desc' }, take: 10 }
      }
    });

    if (!session) {
      throw ApiError.notFound('Chat session not found');
    }

    // Verificar autorización
    if (session.company.userId !== userId) {
      throw ApiError.forbidden('Not authorized to access this chat');
    }

    // Guardar mensaje del usuario
    const userMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        type: 'user',
        content
      }
    });

    // Procesar mensaje con IA
    const aiResponse = await this.processMessage(session, content);

    // Guardar respuesta del agente
    const agentMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        type: 'agent',
        content: aiResponse.content,
        metadata: aiResponse.metadata
      }
    });

    // Ejecutar acciones si es necesario
    if (aiResponse.taskExecution) {
      await this.executeTask(session, aiResponse.taskExecution);
    }

    // Actualizar sesión
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        lastInteraction: new Date(),
        context: aiResponse.newContext || session.context
      }
    });

    return {
      userMessage,
      agentMessage,
      taskExecution: aiResponse.taskExecution
    };
  }

  // === PROCESAMIENTO DE MENSAJES ===
  private async processMessage(session: any, userMessage: string) {
    const { company, agent, messages } = session;
    
    // Construir contexto para OpenAI
    const context = this.buildConversationContext(session, messages, userMessage);
    
    // Determinar intención del usuario
    const intent = await this.openai.detectIntent(userMessage, context);
    
    // Verificar si el agente puede ejecutar esta tarea
    const canExecute = this.canExecuteTask(agent, intent.taskType);
    
    if (!canExecute) {
      return {
        content: `Lo siento, esta funcionalidad requiere un plan superior. Tu agente ${agent.level} no incluye "${intent.taskType}". ¿Te gustaría actualizar tu plan?`,
        metadata: {
          taskType: 'upgrade_required',
          suggestedActions: ['upgrade_plan', 'contact_support']
        }
      };
    }

    // Procesar según el tipo de tarea
    switch (intent.taskType) {
      case 'create_company_profile':
        return await this.handleCreateCompanyProfile(session, userMessage, intent);
      
      case 'create_job_offer':
        return await this.handleCreateJobOffer(session, userMessage, intent);
      
      case 'analyze_competition':
        return await this.handleAnalyzeCompetition(session, userMessage, intent);
      
      case 'generate_report':
        return await this.handleGenerateReport(session, userMessage, intent);
      
      case 'engage_with_leads':
        return await this.handleLeadEngagement(session, userMessage, intent);
      
      default:
        return await this.handleGeneralConversation(session, userMessage, intent);
    }
  }

  // === MANEJO DE TAREAS ESPECÍFICAS ===
  private async handleCreateCompanyProfile(session: any, userMessage: string, intent: any) {
    const { company } = session;
    
    // Verificar si ya existe perfil
    const existingProfile = await prisma.companyProfile.findUnique({
      where: { companyId: company.id }
    });

    if (existingProfile && existingProfile.status === 'published') {
      return {
        content: `Ya tienes un perfil publicado. ¿Quieres actualizarlo o crear una nueva versión?`,
        metadata: {
          taskType: 'update_profile',
          suggestedActions: ['update_profile', 'view_current_profile']
        }
      };
    }

    // Solicitar datos faltantes
    const missingData = this.getMissingProfileData(company, intent.extractedData);
    
    if (missingData.length > 0) {
      return {
        content: `Para crear tu perfil empresarial necesito algunos datos adicionales:\n\n${missingData.map((field, i) => `${i + 1}. ${field.question}`).join('\n')}\n\n¿Puedes proporcionarme esta información?`,
        metadata: {
          taskType: 'collect_profile_data',
          requiredFields: missingData,
          currentData: intent.extractedData
        }
      };
    }

    // Crear perfil
    const profileData = await this.generateCompanyProfile(company, intent.extractedData);
    
    const profile = await prisma.companyProfile.create({
      data: {
        companyId: company.id,
        data: profileData,
        status: 'review',
        createdBy: 'ai'
      }
    });

    return {
      content: `He creado tu perfil empresarial. Aquí tienes una vista previa:\n\n**${profileData.basicInfo.name}**\n${profileData.basicInfo.description}\n\n**Servicios:**\n${profileData.basicInfo.services.map(s => `• ${s}`).join('\n')}\n\n¿Te parece bien así o quieres que modifique algo antes de publicarlo?`,
      metadata: {
        taskType: 'approve_profile',
        profileId: profile.id,
        suggestedActions: ['approve_profile', 'modify_profile', 'preview_profile']
      },
      taskExecution: {
        type: 'create_company_profile',
        status: 'awaiting_approval',
        data: { profileId: profile.id }
      }
    };
  }

  private async handleCreateJobOffer(session: any, userMessage: string, intent: any) {
    const { company, agent } = session;
    
    // Analizar competencia para sugerencias
    let competitiveInsights = null;
    if (this.canExecuteTask(agent, 'competitive_analysis')) {
      competitiveInsights = await this.scraping.analyzeCompetitorOffers(company.sector);
    }

    const missingData = this.getMissingOfferData(intent.extractedData);
    
    if (missingData.length > 0) {
      return {
        content: `Para crear una oferta atractiva necesito más información:\n\n${missingData.map((field, i) => `${i + 1}. ${field.question}`).join('\n')}\n\n${competitiveInsights ? `\n💡 **Insight del mercado:** ${competitiveInsights.suggestion}` : ''}`,
        metadata: {
          taskType: 'collect_offer_data',
          requiredFields: missingData,
          competitiveInsights
        }
      };
    }

    // Generar oferta optimizada
    const offerData = await this.generateJobOffer(
      company, 
      intent.extractedData, 
      competitiveInsights
    );

    const offer = await prisma.jobOffer.create({
      data: {
        ...offerData,
        companyId: company.id,
        agentId: agent.id,
        status: 'review'
      }
    });

    return {
      content: `He creado tu oferta de trabajo optimizada:\n\n**${offer.title}**\n\n${offer.description}\n\n**Beneficios destacados:**\n${offer.benefits.map(b => `• ${b}`).join('\n')}\n\n${competitiveInsights ? `\n📊 **Ventaja competitiva:** Esta oferta está optimizada basándose en análisis de ${competitiveInsights.competitorsAnalyzed} empresas similares.` : ''}\n\n¿Quieres publicarla así o modificar algo?`,
      metadata: {
        taskType: 'approve_offer',
        offerId: offer.id,
        competitiveAdvantage: competitiveInsights?.advantages,
        suggestedActions: ['publish_offer', 'modify_offer', 'analyze_targeting']
      },
      taskExecution: {
        type: 'create_job_offer',
        status: 'awaiting_approval',
        data: { offerId: offer.id }
      }
    };
  }

  private async handleAnalyzeCompetition(session: any, userMessage: string, intent: any) {
    const { company, agent } = session;

    if (!this.canExecuteTask(agent, 'competitive_intelligence')) {
      return {
        content: `El análisis competitivo está disponible en el plan Avanzado. ¿Te gustaría actualizar tu plan para acceder a inteligencia de mercado en tiempo real?`,
        metadata: {
          taskType: 'upgrade_required',
          requiredPlan: 'AVANZADO'
        }
      };
    }

    // Ejecutar análisis competitivo
    const analysis = await this.scraping.performCompetitiveAnalysis(
      company.sector,
      intent.extractedData?.specificCompetitors || [],
      intent.extractedData?.analysisDepth || 'standard'
    );

    // Guardar análisis
    await prisma.competitiveAnalysis.create({
      data: {
        companyId: company.id,
        targetSector: company.sector,
        competitors: analysis.competitors,
        insights: analysis.insights,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Próxima actualización en 24h
      }
    });

    return {
      content: `📊 **Análisis Competitivo Completado**\n\n**Tu posición en el mercado:** ${analysis.insights.marketPosition}\n\n**🎯 Oportunidades detectadas:**\n${analysis.insights.opportunities.map(o => `• ${o}`).join('\n')}\n\n**⚠️ Amenazas a vigilar:**\n${analysis.insights.threats.map(t => `• ${t}`).join('\n')}\n\n**💡 Recomendaciones estratégicas:**\n${analysis.insights.recommendations.map(r => `• ${r}`).join('\n')}\n\n*Análisis basado en ${analysis.competitors.length} competidores principales.*`,
      metadata: {
        taskType: 'competitive_analysis_complete',
        analysisId: analysis.id,
        suggestedActions: ['implement_recommendations', 'schedule_followup', 'create_strategy']
      }
    };
  }

  private async handleGenerateReport(session: any, userMessage: string, intent: any) {
    const { company, agent } = session;
    
    const reportType = intent.extractedData?.reportType || 'performance';
    const period = intent.extractedData?.period || 'week';

    // Generar reporte según el plan
    const reportData = await this.generateAutomatedReport(company, reportType, period, agent.level);

    const report = await prisma.automatedReport.create({
      data: {
        companyId: company.id,
        type: reportType,
        data: reportData,
        period: {
          start: reportData.period.start,
          end: reportData.period.end
        },
        generatedAt: new Date()
      }
    });

    return {
      content: `📈 **Reporte ${reportType.toUpperCase()} generado**\n\n**Período:** ${reportData.period.start.toLocaleDateString()} - ${reportData.period.end.toLocaleDateString()}\n\n**📊 Métricas clave:**\n${Object.entries(reportData.metrics).map(([key, value]) => `• ${key}: ${value}`).join('\n')}\n\n**💡 Insights:**\n${reportData.insights.map(i => `• ${i}`).join('\n')}\n\n**🎯 Recomendaciones:**\n${reportData.recommendations.map(r => `• ${r}`).join('\n')}`,
      metadata: {
        taskType: 'report_generated',
        reportId: report.id,
        suggestedActions: ['download_report', 'schedule_regular_reports', 'implement_recommendations']
      }
    };
  }

  private async handleLeadEngagement(session: any, userMessage: string, intent: any) {
    const { company, agent } = session;

    if (!this.canExecuteTask(agent, 'lead_engagement')) {
      return {
        content: `El engagement inteligente con leads está disponible en el plan Avanzado. Esta funcionalidad permite contactar automáticamente empleados que muestran interés.`,
        metadata: {
          taskType: 'upgrade_required',
          requiredPlan: 'AVANZADO'
        }
      };
    }

    // Identificar leads calientes
    const hotLeads = await this.identifyHotLeads(company.id);
    
    // Generar estrategias de engagement
    const engagementStrategies = await this.generateEngagementStrategies(hotLeads, company);

    // Ejecutar engagement automático si está autorizado
    if (intent.extractedData?.autoExecute) {
      await this.executeLeadEngagement(engagementStrategies);
    }

    return {
      content: `🎯 **${hotLeads.length} leads calientes identificados**\n\nHe detectado empleados que han mostrado interés en tu empresa:\n\n${hotLeads.slice(0, 3).map(lead => `• ${lead.employee.firstName} ${lead.employee.lastName} - ${lead.employee.organization} (Score: ${lead.score})`).join('\n')}\n\n**Estrategias de engagement preparadas:**\n${engagementStrategies.map(s => `• ${s.description}`).join('\n')}\n\n¿Quieres que inicie el contacto automático?`,
      metadata: {
        taskType: 'lead_engagement_ready',
        leadsCount: hotLeads.length,
        strategies: engagementStrategies,
        suggestedActions: ['start_engagement', 'review_leads', 'customize_approach']
      }
    };
  }

  // === EJECUCIÓN DE TAREAS ===
  private async executeTask(session: any, taskExecution: any) {
    const task = await prisma.taskExecution.create({
      data: {
        sessionId: session.id,
        taskType: taskExecution.type,
        status: taskExecution.status,
        input: taskExecution.data,
        approvalRequired: taskExecution.requiresApproval || false
      }
    });

    // Registrar tarea en el agente
    await prisma.agentTask.create({
      data: {
        agentId: session.agentId,
        missionId: this.getMissionIdForTask(taskExecution.type),
        input: taskExecution.data,
        status: 'pending'
      }
    });

    return task;
  }

  // === HELPERS ===
  private buildInitialContext(company: any, agent: any): string {
    return JSON.stringify({
      companyName: company.name,
      sector: company.sector,
      agentLevel: agent.level,
      agentType: agent.type,
      allowedMissions: agent.allowedMissions,
      companyStatus: company.status
    });
  }

  private generateWelcomeMessage(agent: any, company: any): string {
    const agentPersonality = {
      COMERCIAL: '👋 ¡Hola! Soy tu agente comercial IA',
      MARKETING: '🎯 ¡Hola! Soy tu especialista en marketing',
      ANALISTA: '📊 ¡Hola! Soy tu analista de datos',
      RRHH: '👥 ¡Hola! Soy tu especialista en recursos humanos',
      SOPORTE: '🛟 ¡Hola! Soy tu asistente de soporte',
      DISENADOR: '🎨 ¡Hola! Soy tu diseñador creativo'
    };

    return `${agentPersonality[agent.type as keyof typeof agentPersonality]} especializado en el sector ${company.sector}. 

Estoy aquí para ayudarte a hacer crecer tu negocio. Puedo ayudarte con:
${this.getAgentCapabilities(agent.level, agent.allowedMissions).map(cap => `• ${cap}`).join('\n')}

¿En qué te gustaría que te ayude hoy?`;
  }

  private getSuggestedActions(agentLevel: string, company: any): string[] {
    const actions = ['create_company_profile', 'generate_report'];
    
    if (agentLevel === 'AVANZADO' || agentLevel === 'EXPERTO') {
      actions.push('analyze_competition', 'create_job_offer', 'engage_leads');
    }
    
    if (agentLevel === 'EXPERTO') {
      actions.push('strategic_planning', 'automate_processes');
    }
    
    return actions;
  }

  private canExecuteTask(agent: any, taskType: string): boolean {
    const planFeatures = PLAN_FEATURES[agent.level as keyof typeof PLAN_FEATURES];
    
    const taskRequirements = {
      'create_company_profile': 'company_profile_management',
      'generate_report': 'basic_analytics',
      'competitive_analysis': 'competitive_intelligence',
      'create_job_offer': 'offer_creation',
      'lead_engagement': 'lead_engagement',
      'strategic_planning': 'strategic_planning',
      'process_automation': 'process_automation'
    };

    const requiredFeature = taskRequirements[taskType as keyof typeof taskRequirements];
    return requiredFeature ? planFeatures[requiredFeature as keyof typeof planFeatures] : true;
  }

  private getAgentCapabilities(level: string, allowedMissions: string[]): string[] {
    return allowedMissions.map(mission => {
      const missionData = this.findMissionData(mission);
      return missionData?.name || mission;
    });
  }

  private findMissionData(missionKey: string): any {
    for (const level of Object.values(AGENT_MISSIONS)) {
      if (level[missionKey as keyof typeof level]) {
        return level[missionKey as keyof typeof level];
      }
    }
    return null;
  }

  private async generateCompanyProfile(company: any, extractedData: any) {
    // Implementar generación de perfil con IA
    return {
      basicInfo: {
        name: company.name,
        sector: company.sector,
        description: extractedData.description || `Empresa líder en ${company.sector}`,
        services: extractedData.services || [],
        website: company.website
      },
      branding: {
        colors: {
          primary: extractedData.primaryColor || '#007bff',
          secondary: extractedData.secondaryColor || '#6c757d'
        },
        tone: extractedData.tone || 'professional'
      },
      contact: {
        email: company.email,
        phone: company.phone,
        address: company.address
      }
    };
  }

  private getMissingProfileData(company: any, extractedData: any): any[] {
    const required = [];
    if (!extractedData?.description) required.push({ field: 'description', question: '¿Cómo describirías tu empresa?' });
    if (!extractedData?.services?.length) required.push({ field: 'services', question: '¿Qué servicios principales ofreces?' });
    if (!extractedData?.values) required.push({ field: 'values', question: '¿Cuáles son los valores de tu empresa?' });
    return required;
  }

  private getMissingOfferData(extractedData: any): any[] {
    const required = [];
    if (!extractedData?.title) required.push({ field: 'title', question: '¿Cuál es el título del puesto?' });
    if (!extractedData?.requirements?.length) required.push({ field: 'requirements', question: '¿Qué requisitos debe cumplir el candidato?' });
    if (!extractedData?.salary) required.push({ field: 'salary', question: '¿Cuál es el rango salarial?' });
    return required;
  }

  private async generateJobOffer(company: any, extractedData: any, competitiveInsights: any) {
    // Implementar generación de ofertas optimizadas
    return {
      title: extractedData.title,
      description: extractedData.description,
      requirements: extractedData.requirements,
      benefits: extractedData.benefits,
      salary: extractedData.salary,
      location: extractedData.location || company.city,
      remote: extractedData.remote || false,
      type: extractedData.type || 'full_time',
      targetAudience: extractedData.targetAudience || {}
    };
  }

  private getMissionIdForTask(taskType: string): string {
    // Mapear tipos de tarea a misiones
    const taskMissionMap = {
      'create_company_profile': 'CREAR_FICHA_EMPRESA',
      'generate_report': 'ACTUALIZAR_ESTADISTICAS',
      'competitive_analysis': 'SCRAPING_COMPETENCIA',
      'create_job_offer': 'CREAR_OFERTAS',
      'lead_engagement': 'ENGAGEMENT_INTELIGENTE'
    };
    
    return taskMissionMap[taskType as keyof typeof taskMissionMap] || 'DEFAULT_MISSION';
  }

  private async identifyHotLeads(companyId: string) {
    // Implementar identificación de leads calientes
    return [];
  }

  private async generateEngagementStrategies(leads: any[], company: any) {
    // Implementar generación de estrategias de engagement
    return [];
  }

  private async executeLeadEngagement(strategies: any[]) {
    // Implementar ejecución de engagement automático
  }

  private async generateAutomatedReport(company: any, reportType: string, period: string, agentLevel: string) {
    // Implementar generación de reportes automáticos
    return {
      metrics: {},
      insights: [],
      recommendations: [],
      period: {
        start: new Date(),
        end: new Date()
      }
    };
  }

  private buildConversationContext(session: any, messages: any[], currentMessage: string): string {
    return JSON.stringify({
      session: session.context,
      recentMessages: messages,
      currentMessage,
      company: session.company,
      agent: session.agent
    });
  }

  private async handleGeneralConversation(session: any, userMessage: string, intent: any) {
    const response = await this.openai.generateResponse(
      userMessage,
      this.buildConversationContext(session, [], userMessage)
    );

    return {
      content: response,
      metadata: {
        taskType: 'conversation'
      }
    };
  }
}