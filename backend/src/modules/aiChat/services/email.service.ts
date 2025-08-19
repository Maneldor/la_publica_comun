import nodemailer from 'nodemailer';
import { ApiError } from '../../../utils/ApiError';
import logger from '../../../utils/logger';
import prisma from '../../../config/database';
import { OpenAIService } from './openai.service';

export class EmailService {
  private transporter: nodemailer.Transporter;
  private openai: OpenAIService;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    this.openai = new OpenAIService();
  }

  // === FASE 1: EMAIL AUTOMATION CON TEMPLATES + TRIGGERS ===
  async sendAutomatedEmail(templateType: string, recipientData: any, companyData: any) {
    try {
      const template = await this.getEmailTemplate(templateType, companyData.id);
      const personalizedContent = await this.personalizeEmailContent(template, recipientData, companyData);
      
      const mailOptions = {
        from: `${companyData.name} <${process.env.SMTP_FROM}>`,
        to: recipientData.email,
        subject: personalizedContent.subject,
        html: personalizedContent.html,
        text: personalizedContent.text,
        headers: {
          'X-Company-ID': companyData.id,
          'X-Campaign-Type': templateType,
          'X-Recipient-ID': recipientData.id
        }
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      // Registrar envío
      await this.logEmailSent(companyData.id, recipientData.id, templateType, result.messageId);
      
      logger.info(`Automated email sent`, {
        companyId: companyData.id,
        recipientId: recipientData.id,
        templateType,
        messageId: result.messageId
      });

      return {
        success: true,
        messageId: result.messageId,
        recipientEmail: recipientData.email
      };
    } catch (error) {
      logger.error('Email sending error:', error);
      throw ApiError.internal('Failed to send automated email');
    }
  }

  // === TRIGGERS AUTOMÁTICOS ===
  async setupEmailTriggers(companyId: string, triggers: Array<{
    event: string;
    delay: number; // minutos
    templateType: string;
    conditions?: any;
  }>) {
    for (const trigger of triggers) {
      await prisma.emailTrigger.create({
        data: {
          companyId,
          event: trigger.event,
          delayMinutes: trigger.delay,
          templateType: trigger.templateType,
          conditions: trigger.conditions || {},
          isActive: true
        }
      });
    }

    logger.info(`Email triggers setup for company ${companyId}`, { triggersCount: triggers.length });
    return { triggersCreated: triggers.length };
  }

  // === PROCESAR TRIGGERS PENDIENTES ===
  async processPendingTriggers() {
    const pendingTriggers = await prisma.emailTriggerQueue.findMany({
      where: {
        status: 'pending',
        scheduledAt: { lte: new Date() }
      },
      include: {
        company: true,
        employee: true,
        trigger: true
      }
    });

    let processed = 0;
    for (const triggerItem of pendingTriggers) {
      try {
        await this.executeTrigger(triggerItem);
        
        await prisma.emailTriggerQueue.update({
          where: { id: triggerItem.id },
          data: { 
            status: 'completed',
            processedAt: new Date()
          }
        });
        
        processed++;
      } catch (error) {
        logger.error(`Failed to process trigger ${triggerItem.id}:`, error);
        
        await prisma.emailTriggerQueue.update({
          where: { id: triggerItem.id },
          data: { 
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            processedAt: new Date()
          }
        });
      }
    }

    logger.info(`Processed ${processed} email triggers`);
    return { processed, total: pendingTriggers.length };
  }

  // === CAMPAÑAS DE EMAIL MARKETING ===
  async createEmailCampaign(companyId: string, campaignData: {
    name: string;
    subject: string;
    content: string;
    targetAudience: {
      communities?: string[];
      categories?: string[];
      minScore?: number;
    };
    scheduledAt?: Date;
  }) {
    // Obtener audiencia objetivo
    const recipients = await this.getTargetAudience(campaignData.targetAudience);
    
    // Crear campaña
    const campaign = await prisma.emailCampaign.create({
      data: {
        companyId,
        name: campaignData.name,
        subject: campaignData.subject,
        content: campaignData.content,
        targetAudience: campaignData.targetAudience,
        scheduledAt: campaignData.scheduledAt || new Date(),
        recipientCount: recipients.length,
        status: 'scheduled'
      }
    });

    // Programar envíos
    for (const recipient of recipients) {
      await prisma.emailCampaignRecipient.create({
        data: {
          campaignId: campaign.id,
          employeeId: recipient.id,
          status: 'pending'
        }
      });
    }

    logger.info(`Email campaign created`, {
      campaignId: campaign.id,
      recipientCount: recipients.length
    });

    return campaign;
  }

  // === EJECUTAR CAMPAÑAS PENDIENTES ===
  async executePendingCampaigns() {
    const campaigns = await prisma.emailCampaign.findMany({
      where: {
        status: 'scheduled',
        scheduledAt: { lte: new Date() }
      },
      include: {
        company: true,
        recipients: {
          where: { status: 'pending' },
          include: { employee: { include: { user: true } } }
        }
      }
    });

    for (const campaign of campaigns) {
      await this.executeCampaign(campaign);
    }

    return { campaignsProcessed: campaigns.length };
  }

  // === PERSONALIZACIÓN INTELIGENTE ===
  private async personalizeEmailContent(template: any, recipientData: any, companyData: any) {
    const personalizedContent = await this.openai.generatePersonalizedEmail(
      template.content,
      recipientData,
      companyData
    );

    return {
      subject: this.replacePlaceholders(personalizedContent.subject, recipientData, companyData),
      html: this.generateHTMLContent(personalizedContent.content, companyData),
      text: personalizedContent.content
    };
  }

  // === SEGUIMIENTO Y ANALYTICS ===
  async trackEmailOpen(messageId: string, recipientId: string) {
    await prisma.emailTracking.create({
      data: {
        messageId,
        recipientId,
        event: 'open',
        timestamp: new Date()
      }
    });

    // Actualizar score del lead
    await this.updateLeadScore(recipientId, 'email_open', 5);
  }

  async trackEmailClick(messageId: string, recipientId: string, linkUrl: string) {
    await prisma.emailTracking.create({
      data: {
        messageId,
        recipientId,
        event: 'click',
        metadata: { linkUrl },
        timestamp: new Date()
      }
    });

    // Actualizar score del lead
    await this.updateLeadScore(recipientId, 'email_click', 10);
  }

  // === LEAD NURTURING AUTOMÁTICO ===
  async setupLeadNurturing(companyId: string, leadId: string) {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { employee: true }
    });

    if (!lead) return;

    // Secuencia de nurturing basada en el score del lead
    const nurtureSequence = this.getNurtureSequence(lead.score);
    
    for (let i = 0; i < nurtureSequence.length; i++) {
      const step = nurtureSequence[i];
      const scheduledAt = new Date(Date.now() + step.delayHours * 60 * 60 * 1000);
      
      await prisma.emailTriggerQueue.create({
        data: {
          companyId,
          employeeId: lead.employeeId,
          triggerId: await this.getOrCreateTrigger(companyId, step.templateType),
          scheduledAt,
          status: 'pending',
          metadata: { nurtureStep: i + 1, totalSteps: nurtureSequence.length }
        }
      });
    }
  }

  // === A/B TESTING DE EMAILS ===
  async createABTest(companyId: string, testData: {
    name: string;
    variants: Array<{
      subject: string;
      content: string;
      weight: number; // Porcentaje de audiencia
    }>;
    targetAudience: any;
    testDuration: number; // horas
  }) {
    const test = await prisma.emailABTest.create({
      data: {
        companyId,
        name: testData.name,
        variants: testData.variants,
        targetAudience: testData.targetAudience,
        testDuration: testData.testDuration,
        status: 'running',
        startedAt: new Date()
      }
    });

    // Distribuir audiencia entre variantes
    const recipients = await this.getTargetAudience(testData.targetAudience);
    const shuffled = this.shuffleArray(recipients);
    
    let currentIndex = 0;
    for (const variant of testData.variants) {
      const variantSize = Math.floor(recipients.length * variant.weight / 100);
      const variantRecipients = shuffled.slice(currentIndex, currentIndex + variantSize);
      
      for (const recipient of variantRecipients) {
        await prisma.emailABTestRecipient.create({
          data: {
            testId: test.id,
            employeeId: recipient.id,
            variantIndex: testData.variants.indexOf(variant),
            status: 'pending'
          }
        });
      }
      
      currentIndex += variantSize;
    }

    return test;
  }

  // === HELPERS PRIVADOS ===
  private async getEmailTemplate(templateType: string, companyId: string) {
    let template = await prisma.emailTemplate.findFirst({
      where: { companyId, type: templateType }
    });

    if (!template) {
      // Usar template por defecto
      template = await this.createDefaultTemplate(templateType, companyId);
    }

    return template;
  }

  private async createDefaultTemplate(templateType: string, companyId: string) {
    const defaultTemplates = {
      welcome: {
        subject: 'Bienvenido a {{companyName}}',
        content: 'Hola {{firstName}}, gracias por tu interés en {{companyName}}...'
      },
      follow_up: {
        subject: 'Seguimiento de tu consulta - {{companyName}}',
        content: 'Hola {{firstName}}, queremos hacer seguimiento...'
      },
      offer_notification: {
        subject: 'Nueva oportunidad que puede interesarte',
        content: 'Hola {{firstName}}, hemos publicado una nueva oferta...'
      }
    };

    const template = defaultTemplates[templateType as keyof typeof defaultTemplates];
    
    return prisma.emailTemplate.create({
      data: {
        companyId,
        type: templateType,
        subject: template.subject,
        content: template.content,
        isActive: true
      }
    });
  }

  private replacePlaceholders(text: string, recipientData: any, companyData: any): string {
    return text
      .replace(/{{firstName}}/g, recipientData.firstName || 'Estimado/a')
      .replace(/{{lastName}}/g, recipientData.lastName || '')
      .replace(/{{companyName}}/g, companyData.name)
      .replace(/{{position}}/g, recipientData.jobTitle || '')
      .replace(/{{organization}}/g, recipientData.organization || '');
  }

  private generateHTMLContent(textContent: string, companyData: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${companyData.name}</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px;">
              <h1 style="color: #007bff;">${companyData.name}</h1>
              <div style="background-color: white; padding: 20px; border-radius: 5px;">
                  ${textContent.replace(/\n/g, '<br>')}
              </div>
              <p style="font-size: 12px; color: #666; margin-top: 20px;">
                  Este email fue enviado por ${companyData.name}. 
                  Si no deseas recibir más emails, 
                  <a href="{{unsubscribeUrl}}">haz clic aquí</a>.
              </p>
          </div>
      </body>
      </html>
    `;
  }

  private async getTargetAudience(criteria: any) {
    const where: any = {};
    
    if (criteria.communities?.length) {
      where.community = { in: criteria.communities };
    }
    
    if (criteria.categories?.length) {
      where.employeeCategory = { in: criteria.categories };
    }

    return prisma.employee.findMany({
      where,
      include: { user: true },
      take: 1000 // Límite de seguridad
    });
  }

  private async executeTrigger(triggerItem: any) {
    const { company, employee, trigger } = triggerItem;
    
    await this.sendAutomatedEmail(
      trigger.templateType,
      {
        id: employee.id,
        email: employee.user.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
        jobTitle: employee.jobTitle,
        organization: employee.organization
      },
      company
    );
  }

  private async executeCampaign(campaign: any) {
    await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: { status: 'sending', startedAt: new Date() }
    });

    let sent = 0;
    let failed = 0;

    for (const recipient of campaign.recipients) {
      try {
        await this.sendAutomatedEmail(
          'campaign',
          {
            id: recipient.employee.id,
            email: recipient.employee.user.email,
            firstName: recipient.employee.firstName,
            lastName: recipient.employee.lastName,
            jobTitle: recipient.employee.jobTitle,
            organization: recipient.employee.organization
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

      // Delay entre envíos para evitar límites
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: { 
        status: 'completed',
        sentCount: sent,
        failedCount: failed,
        completedAt: new Date()
      }
    });
  }

  private async logEmailSent(companyId: string, recipientId: string, templateType: string, messageId: string) {
    await prisma.emailLog.create({
      data: {
        companyId,
        recipientId,
        templateType,
        messageId,
        status: 'sent',
        sentAt: new Date()
      }
    });
  }

  private async updateLeadScore(recipientId: string, event: string, points: number) {
    const lead = await prisma.lead.findFirst({
      where: { employeeId: recipientId }
    });

    if (lead) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { 
          score: { increment: points },
          lastInteraction: new Date()
        }
      });
    }
  }

  private getNurtureSequence(leadScore: number) {
    if (leadScore >= 80) {
      return [
        { templateType: 'high_value_offer', delayHours: 1 },
        { templateType: 'case_study', delayHours: 24 },
        { templateType: 'call_to_action', delayHours: 72 }
      ];
    } else if (leadScore >= 50) {
      return [
        { templateType: 'educational_content', delayHours: 2 },
        { templateType: 'service_showcase', delayHours: 48 },
        { templateType: 'soft_offer', delayHours: 120 }
      ];
    } else {
      return [
        { templateType: 'welcome', delayHours: 4 },
        { templateType: 'company_introduction', delayHours: 96 },
        { templateType: 'value_proposition', delayHours: 168 }
      ];
    }
  }

  private async getOrCreateTrigger(companyId: string, templateType: string) {
    let trigger = await prisma.emailTrigger.findFirst({
      where: { companyId, templateType }
    });

    if (!trigger) {
      trigger = await prisma.emailTrigger.create({
        data: {
          companyId,
          event: 'manual_nurture',
          templateType,
          delayMinutes: 0,
          isActive: true
        }
      });
    }

    return trigger.id;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}