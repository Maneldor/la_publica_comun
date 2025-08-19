import prisma from '../../../config/database';
import { ApiError } from '../../../utils/ApiError';
import { AGENT_LEVELS, AGENT_TYPES, AGENT_MISSIONS, AGENT_PRICING } from '../../../config/constants';
import logger from '../../../utils/logger';

export class AIAgentService {
  
  async createAgent(data: {
    name: string;
    description?: string;
    type: keyof typeof AGENT_TYPES;
    level: keyof typeof AGENT_LEVELS;
    companyId?: string;
    userId: string;
    maxDailyTasks?: number;
    monthlyTokenLimit?: number;
    systemPrompt?: string;
  }) {
    // Validar que la empresa existe si se proporciona
    if (data.companyId) {
      const company = await prisma.company.findUnique({
        where: { id: data.companyId },
      });

      if (!company) {
        throw ApiError.notFound('Company not found');
      }
    }

    // Obtener misiones permitidas según el nivel
    const allowedMissions = this.getMissionsForLevel(data.level);

    const agent = await prisma.aIAgent.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        level: data.level,
        companyId: data.companyId,
        userId: data.userId,
        maxDailyTasks: data.maxDailyTasks || AGENT_PRICING[data.level].tokensIncluded / 10,
        monthlyTokenLimit: data.monthlyTokenLimit || AGENT_PRICING[data.level].tokensIncluded,
        allowedMissions,
        systemPrompt: data.systemPrompt || this.getDefaultSystemPrompt(data.type, data.level),
      },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
        company: {
          select: {
            name: true,
            sector: true,
          },
        },
      },
    });

    logger.info(`AI Agent created: ${agent.name}`, { 
      agentId: agent.id, 
      type: agent.type, 
      level: agent.level 
    });

    return agent;
  }

  async updateAgent(agentId: string, data: {
    name?: string;
    description?: string;
    level?: keyof typeof AGENT_LEVELS;
    isActive?: boolean;
    maxDailyTasks?: number;
    monthlyTokenLimit?: number;
    systemPrompt?: string;
    allowedMissions?: string[];
  }) {
    const existingAgent = await prisma.aIAgent.findUnique({
      where: { id: agentId },
    });

    if (!existingAgent) {
      throw ApiError.notFound('AI Agent not found');
    }

    // Si se cambia el nivel, actualizar misiones permitidas
    let allowedMissions = data.allowedMissions;
    if (data.level && data.level !== existingAgent.level) {
      allowedMissions = this.getMissionsForLevel(data.level);
    }

    const agent = await prisma.aIAgent.update({
      where: { id: agentId },
      data: {
        ...data,
        ...(allowedMissions && { allowedMissions }),
      },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
        company: {
          select: {
            name: true,
            sector: true,
          },
        },
      },
    });

    logger.info(`AI Agent updated: ${agent.name}`, { agentId });

    return agent;
  }

  async getAgents(filters: {
    page?: number;
    limit?: number;
    companyId?: string;
    type?: keyof typeof AGENT_TYPES;
    level?: keyof typeof AGENT_LEVELS;
    isActive?: boolean;
    search?: string;
  }) {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 10, 100);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.companyId) where.companyId = filters.companyId;
    if (filters.type) where.type = filters.type;
    if (filters.level) where.level = filters.level;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [agents, total] = await Promise.all([
      prisma.aIAgent.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
              role: true,
            },
          },
          company: {
            select: {
              name: true,
              sector: true,
            },
          },
          _count: {
            select: {
              tasks: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.aIAgent.count({ where }),
    ]);

    return {
      data: agents,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAgentById(agentId: string) {
    const agent = await prisma.aIAgent.findUnique({
      where: { id: agentId },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
        company: {
          select: {
            name: true,
            sector: true,
            status: true,
          },
        },
        tasks: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            mission: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    if (!agent) {
      throw ApiError.notFound('AI Agent not found');
    }

    return agent;
  }

  async deleteAgent(agentId: string) {
    const agent = await prisma.aIAgent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      throw ApiError.notFound('AI Agent not found');
    }

    // Delete agent and associated user
    await prisma.$transaction(async (tx) => {
      await tx.aIAgent.delete({
        where: { id: agentId },
      });
      
      await tx.user.delete({
        where: { id: agent.userId },
      });
    });

    logger.info(`AI Agent deleted: ${agent.name}`, { agentId });

    return { message: 'AI Agent deleted successfully' };
  }

  async getAgentStats(agentId?: string, companyId?: string, period: string = 'month') {
    const where: any = {};
    if (agentId) where.agentId = agentId;
    if (companyId) where.agent = { companyId };

    const periodStart = this.getPeriodStart(period);

    const [taskStats, tokenStats, performanceStats] = await Promise.all([
      // Task statistics
      prisma.agentTask.groupBy({
        by: ['status'],
        where: {
          ...where,
          createdAt: { gte: periodStart },
        },
        _count: true,
      }),
      
      // Token usage
      prisma.agentTask.aggregate({
        where: {
          ...where,
          createdAt: { gte: periodStart },
        },
        _sum: {
          tokensUsed: true,
          cost: true,
        },
      }),
      
      // Performance metrics
      prisma.agentTask.aggregate({
        where: {
          ...where,
          status: 'completed',
          createdAt: { gte: periodStart },
        },
        _avg: {
          duration: true,
        },
      }),
    ]);

    return {
      tasks: {
        total: taskStats.reduce((sum, stat) => sum + stat._count, 0),
        byStatus: taskStats.reduce((acc, stat) => ({
          ...acc,
          [stat.status]: stat._count,
        }), {}),
      },
      tokens: {
        used: tokenStats._sum.tokensUsed || 0,
        cost: tokenStats._sum.cost || 0,
      },
      performance: {
        avgDuration: performanceStats._avg.duration || 0,
        successRate: this.calculateSuccessRate(taskStats),
      },
    };
  }

  async getAvailableMissions(level: keyof typeof AGENT_LEVELS) {
    const missions = this.getMissionsForLevel(level);
    
    return missions.map(missionKey => {
      const mission = this.findMissionByKey(missionKey);
      return {
        id: missionKey,
        ...mission,
        requiredLevel: this.getMissionRequiredLevel(missionKey),
      };
    });
  }

  private getMissionsForLevel(level: keyof typeof AGENT_LEVELS): string[] {
    const missions: string[] = [];
    
    // Agregar misiones básicas
    missions.push(...Object.keys(AGENT_MISSIONS.BASICO));
    
    // Agregar misiones avanzadas si el nivel lo permite
    if (level === 'AVANZADO' || level === 'EXPERTO') {
      missions.push(...Object.keys(AGENT_MISSIONS.AVANZADO));
    }
    
    // Agregar misiones expertas si el nivel lo permite
    if (level === 'EXPERTO') {
      missions.push(...Object.keys(AGENT_MISSIONS.EXPERTO));
    }
    
    return missions;
  }

  private getDefaultSystemPrompt(type: keyof typeof AGENT_TYPES, level: keyof typeof AGENT_LEVELS): string {
    const basePrompt = `Eres un agente IA especializado en ${type.toLowerCase()} de nivel ${level.toLowerCase()} para La Pública, una plataforma que conecta empresas con empleados públicos españoles.`;
    
    const rolePrompts = {
      COMERCIAL: 'Tu objetivo es ayudar a las empresas a conectar con empleados públicos, generar leads y optimizar sus estrategias comerciales.',
      RRHH: 'Te especializas en recursos humanos, gestión de candidatos, procesos de selección y onboarding.',
      DISENADOR: 'Creas contenido visual atractivo, diseños para campañas y materiales de marketing.',
      ANALISTA: 'Analizas datos, generas insights y proporcionas recomendaciones basadas en métricas.',
      SOPORTE: 'Brindas soporte técnico y resuelves consultas de usuarios de manera eficiente.',
      MARKETING: 'Desarrollas estrategias de marketing, creas campañas y optimizas la comunicación.',
    };

    return `${basePrompt}\n\n${rolePrompts[type]}\n\nSiempre mantén un tono profesional, amigable y orientado a resultados.`;
  }

  private findMissionByKey(missionKey: string): any {
    for (const level of Object.values(AGENT_MISSIONS)) {
      if (level[missionKey as keyof typeof level]) {
        return level[missionKey as keyof typeof level];
      }
    }
    return null;
  }

  private getMissionRequiredLevel(missionKey: string): string {
    if (AGENT_MISSIONS.BASICO[missionKey as keyof typeof AGENT_MISSIONS.BASICO]) return 'BASICO';
    if (AGENT_MISSIONS.AVANZADO[missionKey as keyof typeof AGENT_MISSIONS.AVANZADO]) return 'AVANZADO';
    if (AGENT_MISSIONS.EXPERTO[missionKey as keyof typeof AGENT_MISSIONS.EXPERTO]) return 'EXPERTO';
    return 'BASICO';
  }

  private calculateSuccessRate(taskStats: any[]): number {
    const total = taskStats.reduce((sum, stat) => sum + stat._count, 0);
    const completed = taskStats.find(stat => stat.status === 'completed')?._count || 0;
    
    return total > 0 ? (completed / total) * 100 : 0;
  }

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
}