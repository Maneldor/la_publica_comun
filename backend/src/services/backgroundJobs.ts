import prisma from '../config/database';
import logger from '../utils/logger';
import { ScrapingService } from '../modules/aiChat/services/scraping.service';
import { EmailService } from '../modules/aiChat/services/email.service';
import { OpenAIService } from '../modules/aiChat/services/openai.service';

export class BackgroundJobService {
  private scrapingService: ScrapingService;
  private emailService: EmailService;
  private openaiService: OpenAIService;
  private isRunning = false;

  constructor() {
    this.scrapingService = new ScrapingService();
    this.emailService = new EmailService();
    this.openaiService = new OpenAIService();
  }

  // === INICIAR PROCESADOR DE TRABAJOS ===
  async startJobProcessor() {
    if (this.isRunning) {
      logger.warn('Job processor is already running');
      return;
    }

    this.isRunning = true;
    logger.info('Background job processor started');

    // Procesar trabajos cada 30 segundos
    const processingInterval = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(processingInterval);
        return;
      }

      try {
        await this.processNextJob();
      } catch (error) {
        logger.error('Error processing background job:', error);
      }
    }, 30000);

    // Procesar emails cada minuto
    const emailInterval = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(emailInterval);
        return;
      }

      try {
        await this.emailService.processPendingTriggers();
        await this.emailService.executePendingCampaigns();
      } catch (error) {
        logger.error('Error processing email jobs:', error);
      }
    }, 60000);
  }

  async stopJobProcessor() {
    this.isRunning = false;
    logger.info('Background job processor stopped');
  }

  // === PROCESAR SIGUIENTE TRABAJO ===
  private async processNextJob() {
    const job = await prisma.backgroundJob.findFirst({
      where: {
        status: 'pending',
        scheduledAt: { lte: new Date() }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' }
      ]
    });

    if (!job) {
      return; // No hay trabajos pendientes
    }

    // Marcar trabajo como en ejecución
    await prisma.backgroundJob.update({
      where: { id: job.id },
      data: {
        status: 'running',
        startedAt: new Date()
      }
    });

    try {
      await this.executeJob(job);

      // Marcar como completado
      await prisma.backgroundJob.update({
        where: { id: job.id },
        data: {
          status: 'completed',
          completedAt: new Date()
        }
      });

      logger.info(`Background job completed: ${job.type}`, { jobId: job.id });
    } catch (error) {
      const attempts = job.attempts + 1;
      const shouldRetry = attempts < job.maxAttempts;

      await prisma.backgroundJob.update({
        where: { id: job.id },
        data: {
          status: shouldRetry ? 'pending' : 'failed',
          attempts,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          scheduledAt: shouldRetry 
            ? new Date(Date.now() + Math.pow(2, attempts) * 60000) // Exponential backoff
            : job.scheduledAt
        }
      });

      logger.error(`Background job ${shouldRetry ? 'failed, retrying' : 'failed permanently'}: ${job.type}`, {
        jobId: job.id,
        error: error instanceof Error ? error.message : error
      });
    }
  }

  // === EJECUTAR TRABAJO ESPECÍFICO ===
  private async executeJob(job: any) {
    const data = job.data;

    switch (job.type) {
      case 'competitive_analysis':
        await this.executeCompetitiveAnalysis(data);
        break;
      
      case 'report_generation':
        await this.executeReportGeneration(data);
        break;
      
      case 'email_campaign':
        await this.executeEmailCampaign(data);
        break;
      
      case 'scraping_batch':
        await this.executeScrapingBatch(data);
        break;
      
      case 'lead_scoring_update':
        await this.executeLeadScoringUpdate(data);
        break;
      
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  }

  // === ANÁLISIS COMPETITIVO ===
  private async executeCompetitiveAnalysis(data: any) {
    const { companyId, sector, competitors, analysisDepth } = data;

    logger.info(`Starting competitive analysis for company ${companyId}`);

    const analysis = await this.scrapingService.performCompetitiveAnalysis(
      sector,
      competitors,
      analysisDepth
    );

    // Guardar análisis en base de datos
    await prisma.competitiveAnalysis.create({
      data: {
        companyId,
        targetSector: sector,
        competitors: analysis.competitors,
        insights: analysis.insights,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
      }
    });

    logger.info(`Competitive analysis completed for company ${companyId}`);
  }

  // === GENERACIÓN DE REPORTES ===
  private async executeReportGeneration(data: any) {
    const { companyId, reportType, period } = data;

    logger.info(`Generating ${reportType} report for company ${companyId}`);

    // Obtener datos de la empresa
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        posts: { where: { status: 'PUBLISHED' } },
        campaigns: true,
        leads: true,
        analyticsEvents: {
          where: {
            timestamp: {
              gte: this.getPeriodStart(period)
            }
          }
        }
      }
    });

    if (!company) {
      throw new Error(`Company ${companyId} not found`);
    }

    // Generar métricas
    const metrics = this.calculateMetrics(company);

    // Generar insights con IA
    const reportData = await this.openaiService.generateAutomatedReport({
      metrics,
      period,
      companyName: company.name,
    });

    // Guardar reporte
    await prisma.automatedReport.create({
      data: {
        companyId,
        type: reportType,
        data: {
          ...reportData,
          metrics
        },
        period: {
          start: this.getPeriodStart(period),
          end: new Date()
        },
        generatedAt: new Date()
      }
    });

    logger.info(`Report generated successfully for company ${companyId}`);
  }

  // === CAMPAÑA DE EMAIL ===
  private async executeEmailCampaign(data: any) {
    const { campaignId } = data;

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: campaignId },
      include: {
        company: true,
        recipients: {
          where: { status: 'pending' },
          include: { employee: { include: { user: true } } }
        }
      }
    });

    if (!campaign) {
      throw new Error(`Email campaign ${campaignId} not found`);
    }

    logger.info(`Executing email campaign: ${campaign.name}`);

    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: { status: 'sending', startedAt: new Date() }
    });

    let sent = 0;
    let failed = 0;

    for (const recipient of campaign.recipients) {
      try {
        await this.emailService.sendAutomatedEmail(
          'campaign',
          {
            id: recipient.employee.id,
            email: recipient.employee.user.email,
            firstName: recipient.employee.firstName,
            lastName: recipient.employee.lastName,
          },
          campaign.company
        );

        await prisma.emailCampaignRecipient.update({
          where: { id: recipient.id },
          data: { status: 'sent', sentAt: new Date() }
        });

        sent++;
      } catch (error) {
        await prisma.emailCampaignRecipient.update({
          where: { id: recipient.id },
          data: { 
            status: 'failed', 
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          }
        });

        failed++;
      }

      // Pausa entre envíos
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: { 
        status: 'completed',
        sentCount: sent,
        failedCount: failed,
        completedAt: new Date()
      }
    });

    logger.info(`Email campaign completed: ${sent} sent, ${failed} failed`);
  }

  // === SCRAPING EN LOTE ===
  private async executeScrapingBatch(data: any) {
    const { targets, agentLevel } = data;

    logger.info(`Starting batch scraping of ${targets.length} targets`);

    const results = await this.scrapingService.massiveScraping(targets, agentLevel);

    logger.info(`Batch scraping completed: ${results.length} successful`);
  }

  // === ACTUALIZACIÓN DE SCORING DE LEADS ===
  private async executeLeadScoringUpdate(data: any) {
    const { companyId } = data;

    logger.info(`Updating lead scoring for company ${companyId}`);

    const leads = await prisma.lead.findMany({
      where: { companyId },
      include: {
        employee: {
          include: {
            user: {
              include: {
                analyticsEvents: {
                  where: {
                    timestamp: {
                      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 días
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    for (const lead of leads) {
      const leadData = {
        interactions: [], // Implementar obtención de interacciones
        profile: lead.employee,
        engagement: lead.employee.user.analyticsEvents
      };

      const scoring = await this.openaiService.analyzeLeadScoring(leadData);

      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          score: Math.round(scoring.score),
          lastInteraction: new Date()
        }
      });
    }

    logger.info(`Lead scoring updated for ${leads.length} leads`);
  }

  // === MÉTODOS AUXILIARES ===
  private getPeriodStart(period: string): Date {
    const now = new Date();
    
    switch (period) {
      case 'day':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        return weekStart;
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        return new Date(now.getFullYear(), quarter * 3, 1);
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
  }

  private calculateMetrics(company: any): Record<string, number> {
    return {
      totalPosts: company.posts?.length || 0,
      totalCampaigns: company.campaigns?.length || 0,
      totalLeads: company.leads?.length || 0,
      totalEvents: company.analyticsEvents?.length || 0,
      averageEngagement: this.calculateAverageEngagement(company.analyticsEvents || []),
      conversionRate: this.calculateConversionRate(company.leads || [])
    };
  }

  private calculateAverageEngagement(events: any[]): number {
    if (events.length === 0) return 0;
    
    const engagementEvents = events.filter(e => ['click', 'view', 'interaction'].includes(e.event));
    return engagementEvents.length / events.length * 100;
  }

  private calculateConversionRate(leads: any[]): number {
    if (leads.length === 0) return 0;
    
    const convertedLeads = leads.filter(l => l.status === 'converted');
    return convertedLeads.length / leads.length * 100;
  }

  // === CREAR TRABAJOS ===
  static async createJob(type: string, data: any, priority: number = 0, scheduledAt?: Date) {
    return prisma.backgroundJob.create({
      data: {
        type,
        data,
        priority,
        scheduledAt: scheduledAt || new Date()
      }
    });
  }

  // === OBTENER ESTADÍSTICAS ===
  static async getJobStats() {
    const [pending, running, completed, failed] = await Promise.all([
      prisma.backgroundJob.count({ where: { status: 'pending' } }),
      prisma.backgroundJob.count({ where: { status: 'running' } }),
      prisma.backgroundJob.count({ where: { status: 'completed' } }),
      prisma.backgroundJob.count({ where: { status: 'failed' } })
    ]);

    return { pending, running, completed, failed };
  }
}