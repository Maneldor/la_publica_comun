import { Response } from 'express';
import { ChatService } from '../services/chatService';
import { AuthRequest } from '../../../types';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiError } from '../../../utils/ApiError';
import prisma from '../../../config/database';

const chatService = new ChatService();

// === GESTIÓN DE SESIONES DE CHAT ===
export const initiateChat = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { agentId, initialMessage } = req.body;

  // Obtener empresa del usuario
  const company = await prisma.company.findUnique({
    where: { userId },
    include: { aiAgents: true }
  });

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  // Verificar que el agente pertenece a la empresa
  const agent = company.aiAgents.find(a => a.id === agentId);
  if (!agent) {
    throw ApiError.badRequest('Agent not found or not assigned to your company');
  }

  const session = await chatService.initiateChatSession(
    company.id, 
    agentId, 
    initialMessage
  );

  res.status(201).json({
    success: true,
    message: 'Chat session initiated',
    data: session,
  });
});

export const getChatSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { sessionId } = req.params;
  const userId = req.user!.id;

  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: {
      company: { where: { userId } },
      agent: true,
      messages: {
        orderBy: { timestamp: 'desc' },
        take: 50
      }
    }
  });

  if (!session || !session.company) {
    throw ApiError.notFound('Chat session not found');
  }

  res.json({
    success: true,
    data: session,
  });
});

export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { sessionId } = req.params;
  const { content } = req.body;
  const userId = req.user!.id;

  if (!content || content.trim().length === 0) {
    throw ApiError.badRequest('Message content is required');
  }

  const result = await chatService.sendMessage(sessionId, content, userId);

  res.json({
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

export const getChatHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { sessionId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const userId = req.user!.id;

  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: { company: { where: { userId } } }
  });

  if (!session || !session.company) {
    throw ApiError.notFound('Chat session not found');
  }

  const messages = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { timestamp: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit)
  });

  res.json({
    success: true,
    data: messages.reverse(), // Mostrar en orden cronológico
  });
});

// === GESTIÓN DE TAREAS ===
export const approveTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;
  const userId = req.user!.id;

  const task = await prisma.taskExecution.findUnique({
    where: { id: taskId },
    include: {
      session: {
        include: { company: true }
      }
    }
  });

  if (!task || task.session.company.userId !== userId) {
    throw ApiError.notFound('Task not found');
  }

  if (!task.approvalRequired) {
    throw ApiError.badRequest('Task does not require approval');
  }

  const updatedTask = await prisma.taskExecution.update({
    where: { id: taskId },
    data: {
      status: 'completed',
      approvedAt: new Date(),
      completedAt: new Date()
    }
  });

  // Ejecutar la tarea aprobada
  await executeApprovedTask(updatedTask);

  res.json({
    success: true,
    message: 'Task approved and executed',
    data: updatedTask,
  });
});

export const rejectTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;
  const { reason } = req.body;
  const userId = req.user!.id;

  const task = await prisma.taskExecution.findUnique({
    where: { id: taskId },
    include: {
      session: {
        include: { company: true }
      }
    }
  });

  if (!task || task.session.company.userId !== userId) {
    throw ApiError.notFound('Task not found');
  }

  await prisma.taskExecution.update({
    where: { id: taskId },
    data: {
      status: 'failed',
      output: { rejection_reason: reason }
    }
  });

  res.json({
    success: true,
    message: 'Task rejected',
  });
});

// === PERFILES DE EMPRESA ===
export const getCompanyProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const company = await prisma.company.findUnique({
    where: { userId },
    include: { profiles: true }
  });

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  res.json({
    success: true,
    data: company.profiles || null,
  });
});

export const publishCompanyProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { profileId } = req.body;
  const userId = req.user!.id;

  const profile = await prisma.companyProfile.findUnique({
    where: { id: profileId },
    include: { company: true }
  });

  if (!profile || profile.company.userId !== userId) {
    throw ApiError.notFound('Company profile not found');
  }

  const updatedProfile = await prisma.companyProfile.update({
    where: { id: profileId },
    data: {
      status: 'published',
      publishedAt: new Date()
    }
  });

  res.json({
    success: true,
    message: 'Company profile published successfully',
    data: updatedProfile,
  });
});

// === OFERTAS DE TRABAJO ===
export const getJobOffers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { status, page = 1, limit = 10 } = req.query;

  const company = await prisma.company.findUnique({
    where: { userId }
  });

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  const where: any = { companyId: company.id };
  if (status) where.status = status;

  const offers = await prisma.jobOffer.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    include: {
      agent: {
        select: { name: true, type: true, level: true }
      }
    }
  });

  const total = await prisma.jobOffer.count({ where });

  res.json({
    success: true,
    data: offers,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

export const publishJobOffer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { offerId } = req.params;
  const userId = req.user!.id;

  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
    include: { company: true }
  });

  if (!offer || offer.company.userId !== userId) {
    throw ApiError.notFound('Job offer not found');
  }

  const updatedOffer = await prisma.jobOffer.update({
    where: { id: offerId },
    data: {
      status: 'published',
      publishedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
    }
  });

  res.json({
    success: true,
    message: 'Job offer published successfully',
    data: updatedOffer,
  });
});

// === ANÁLISIS COMPETITIVO ===
export const getCompetitiveAnalysis = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const company = await prisma.company.findUnique({
    where: { userId },
    include: {
      competitiveAnalyses: {
        orderBy: { lastUpdated: 'desc' },
        take: 10
      }
    }
  });

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  res.json({
    success: true,
    data: company.competitiveAnalyses,
  });
});

export const requestCompetitiveAnalysis = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { competitors, analysisDepth = 'standard' } = req.body;
  const userId = req.user!.id;

  const company = await prisma.company.findUnique({
    where: { userId }
  });

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  // Crear job en background para análisis competitivo
  const job = await prisma.backgroundJob.create({
    data: {
      type: 'competitive_analysis',
      data: {
        companyId: company.id,
        sector: company.sector,
        competitors: competitors || [],
        analysisDepth
      },
      priority: 1
    }
  });

  res.json({
    success: true,
    message: 'Competitive analysis requested. You will receive results shortly.',
    data: { jobId: job.id },
  });
});

// === REPORTES ===
export const getReports = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { type, page = 1, limit = 10 } = req.query;

  const company = await prisma.company.findUnique({
    where: { userId }
  });

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  const where: any = { companyId: company.id };
  if (type) where.type = type;

  const reports = await prisma.automatedReport.findMany({
    where,
    orderBy: { generatedAt: 'desc' },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit)
  });

  const total = await prisma.automatedReport.count({ where });

  res.json({
    success: true,
    data: reports,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

export const generateReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { reportType, period = 'week' } = req.body;
  const userId = req.user!.id;

  const company = await prisma.company.findUnique({
    where: { userId }
  });

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  // Crear job en background para generar reporte
  const job = await prisma.backgroundJob.create({
    data: {
      type: 'report_generation',
      data: {
        companyId: company.id,
        reportType,
        period
      },
      priority: 2
    }
  });

  res.json({
    success: true,
    message: 'Report generation requested. It will be available shortly.',
    data: { jobId: job.id },
  });
});

// === CONFIGURACIÓN DE IA ===
export const getAIConfiguration = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const company = await prisma.company.findUnique({
    where: { userId },
    include: { aiConfiguration: true }
  });

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  res.json({
    success: true,
    data: company.aiConfiguration,
  });
});

export const updateAIConfiguration = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { plan, features, customPrompts, automationRules } = req.body;
  const userId = req.user!.id;

  const company = await prisma.company.findUnique({
    where: { userId }
  });

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  const config = await prisma.aIConfiguration.upsert({
    where: { companyId: company.id },
    update: {
      plan,
      features,
      customPrompts,
      automationRules,
      lastUpdated: new Date()
    },
    create: {
      companyId: company.id,
      plan: plan || 'BASICO',
      features: features || {},
      customPrompts,
      automationRules
    }
  });

  res.json({
    success: true,
    message: 'AI configuration updated successfully',
    data: config,
  });
});

// === HELPERS ===
async function executeApprovedTask(task: any) {
  try {
    switch (task.taskType) {
      case 'create_company_profile':
        await publishCompanyProfileAction(task);
        break;
      case 'create_job_offer':
        await publishJobOfferAction(task);
        break;
      default:
        console.log(`No execution handler for task type: ${task.taskType}`);
    }
  } catch (error) {
    console.error('Error executing approved task:', error);
  }
}

async function publishCompanyProfileAction(task: any) {
  const profileId = task.input.profileId;
  if (profileId) {
    await prisma.companyProfile.update({
      where: { id: profileId },
      data: {
        status: 'published',
        publishedAt: new Date()
      }
    });
  }
}

async function publishJobOfferAction(task: any) {
  const offerId = task.input.offerId;
  if (offerId) {
    await prisma.jobOffer.update({
      where: { id: offerId },
      data: {
        status: 'published',
        publishedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
  }
}