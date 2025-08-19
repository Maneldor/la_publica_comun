import prisma from '../../../config/database';
import { ApiError } from '../../../utils/ApiError';
import { hashPassword } from '../../../utils/auth';
import { ROLES, AGENT_MISSIONS, AGENT_LEVELS, AGENT_TYPES } from '../../../config/constants';
import logger from '../../../utils/logger';
import jwt from 'jsonwebtoken';

export class AdminService {

  // User Management
  async createUser(data: {
    email: string;
    password: string;
    role: keyof typeof ROLES;
    isEmailVerified?: boolean;
    profileData: any;
  }) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw ApiError.badRequest('User with this email already exists');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: data.role,
          isEmailVerified: data.isEmailVerified || false,
        },
      });

      // Create profile based on role
      switch (data.role) {
        case 'EMPRESA':
        case 'ADMINISTRACION_PUBLICA':
        case 'SINDICATO':
          await tx.company.create({
            data: {
              userId: newUser.id,
              name: data.profileData.name,
              cif: data.profileData.cif,
              sector: data.profileData.sector,
              email: data.email,
              status: 'ACTIVE',
            },
          });
          break;

        case 'EMPLEADO_PUBLICO':
          await tx.employee.create({
            data: {
              userId: newUser.id,
              firstName: data.profileData.firstName,
              lastName: data.profileData.lastName,
              community: data.profileData.community,
            },
          });
          break;

        case 'AGENTE_IA':
          await tx.aIAgent.create({
            data: {
              userId: newUser.id,
              name: data.profileData.agentName,
              type: data.profileData.agentType.toUpperCase(),
              level: 'BASICO',
              companyId: data.profileData.companyId,
              allowedMissions: this.getMissionsForLevel('BASICO'),
            },
          });
          break;
      }

      return newUser;
    });

    logger.info(`User created by admin: ${user.email}`, { 
      userId: user.id, 
      role: user.role 
    });

    return this.getUserById(user.id);
  }

  async getUsers(filters: {
    page?: number;
    limit?: number;
    role?: keyof typeof ROLES;
    status?: string;
    search?: string;
    community?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 10, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    const orderBy: any = {};

    if (filters.role) where.role = filters.role;
    if (filters.search) {
      where.email = { contains: filters.search, mode: 'insensitive' };
    }

    // Handle sorting
    if (filters.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          company: {
            select: {
              name: true,
              sector: true,
              status: true,
            },
          },
          employee: {
            select: {
              firstName: true,
              lastName: true,
              community: true,
              status: true,
            },
          },
          aiAgent: {
            select: {
              name: true,
              type: true,
              level: true,
              isActive: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: true,
        employee: true,
        aiAgent: {
          include: {
            company: {
              select: { name: true, sector: true },
            },
            _count: {
              select: { tasks: true },
            },
          },
        },
        _count: {
          select: {
            sentMessages: true,
            receivedMessages: true,
            posts: true,
          },
        },
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }

  async updateUser(userId: string, data: {
    email?: string;
    role?: keyof typeof ROLES;
    isEmailVerified?: boolean;
    status?: string;
    profileData?: any;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true, employee: true, aiAgent: true },
    });

    if (!existingUser) {
      throw ApiError.notFound('User not found');
    }

    const updates: any = {};
    if (data.email) updates.email = data.email;
    if (data.role) updates.role = data.role;
    if (data.isEmailVerified !== undefined) updates.isEmailVerified = data.isEmailVerified;

    const user = await prisma.$transaction(async (tx) => {
      // Update user
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: updates,
      });

      // Update profile data if provided
      if (data.profileData) {
        switch (existingUser.role) {
          case 'EMPRESA':
          case 'ADMINISTRACION_PUBLICA':
          case 'SINDICATO':
            if (existingUser.company) {
              await tx.company.update({
                where: { userId },
                data: data.profileData,
              });
            }
            break;

          case 'EMPLEADO_PUBLICO':
            if (existingUser.employee) {
              await tx.employee.update({
                where: { userId },
                data: data.profileData,
              });
            }
            break;

          case 'AGENTE_IA':
            if (existingUser.aiAgent) {
              await tx.aIAgent.update({
                where: { userId },
                data: data.profileData,
              });
            }
            break;
        }
      }

      return updatedUser;
    });

    logger.info(`User updated by admin: ${user.email}`, { userId });

    return this.getUserById(userId);
  }

  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    logger.info(`User deleted by admin: ${user.email}`, { userId });

    return { message: 'User deleted successfully' };
  }

  async bulkUserActions(data: {
    userIds: string[];
    action: 'activate' | 'suspend' | 'delete' | 'verify_email';
  }) {
    const { userIds, action } = data;

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const userId of userIds) {
      try {
        switch (action) {
          case 'activate':
            await prisma.user.update({
              where: { id: userId },
              data: { /* Add status field if needed */ },
            });
            break;
          case 'suspend':
            await prisma.user.update({
              where: { id: userId },
              data: { /* Add status field if needed */ },
            });
            break;
          case 'delete':
            await this.deleteUser(userId);
            break;
          case 'verify_email':
            await prisma.user.update({
              where: { id: userId },
              data: { isEmailVerified: true },
            });
            break;
        }
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to ${action} user ${userId}: ${error}`);
      }
    }

    logger.info(`Bulk action ${action} completed`, { results });

    return results;
  }

  // Role-specific lists
  async getCompaniesList(filters: any) {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 10, 100);
    const skip = (page - 1) * limit;

    const where: any = {
      user: {
        role: { in: ['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO'] },
      },
    };

    if (filters.sector) where.sector = filters.sector;
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
              role: true,
              createdAt: true,
              lastLogin: true,
            },
          },
          _count: {
            select: {
              posts: true,
              campaigns: true,
              aiAgents: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.company.count({ where }),
    ]);

    return {
      data: companies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEmployeesList(filters: any) {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 10, 100);
    const skip = (page - 1) * limit;

    const where: any = {
      user: { role: 'EMPLEADO_PUBLICO' },
    };

    if (filters.community) where.community = filters.community;
    if (filters.category) where.employeeCategory = filters.category;
    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
              createdAt: true,
              lastLogin: true,
            },
          },
          _count: {
            select: {
              leads: true,
              messagesSent: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.employee.count({ where }),
    ]);

    return {
      data: employees,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAIAgentsList(filters: any) {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 10, 100);
    const skip = (page - 1) * limit;

    const where: any = {
      user: { role: 'AGENTE_IA' },
    };

    if (filters.type) where.type = filters.type;
    if (filters.level) where.level = filters.level;
    if (filters.companyId) where.companyId = filters.companyId;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    const [agents, total] = await Promise.all([
      prisma.aIAgent.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
              createdAt: true,
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

  async getAdministracionesList(filters: any) {
    return this.getCompaniesList({
      ...filters,
      role: 'ADMINISTRACION_PUBLICA',
    });
  }

  async getSindicatosList(filters: any) {
    return this.getCompaniesList({
      ...filters,
      role: 'SINDICATO',
    });
  }

  // System Statistics
  async getSystemStats(filters: {
    period?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const periodStart = this.getPeriodStart(filters.period || 'month');
    const periodEnd = filters.endDate || new Date();

    const [
      userStats,
      companyStats,
      employeeStats,
      agentStats,
      activityStats,
    ] = await Promise.all([
      // User statistics
      prisma.user.groupBy({
        by: ['role'],
        _count: true,
        where: {
          createdAt: { gte: periodStart, lte: periodEnd },
        },
      }),

      // Company statistics
      prisma.company.groupBy({
        by: ['status'],
        _count: true,
        where: {
          createdAt: { gte: periodStart, lte: periodEnd },
        },
      }),

      // Employee statistics by community
      prisma.employee.groupBy({
        by: ['community'],
        _count: true,
        where: {
          createdAt: { gte: periodStart, lte: periodEnd },
        },
      }),

      // AI Agent statistics
      prisma.aIAgent.groupBy({
        by: ['level', 'type'],
        _count: true,
        where: {
          createdAt: { gte: periodStart, lte: periodEnd },
        },
      }),

      // Activity statistics (posts, messages, etc.)
      Promise.all([
        prisma.post.count({
          where: { createdAt: { gte: periodStart, lte: periodEnd } },
        }),
        prisma.message.count({
          where: { createdAt: { gte: periodStart, lte: periodEnd } },
        }),
        prisma.campaign.count({
          where: { createdAt: { gte: periodStart, lte: periodEnd } },
        }),
      ]),
    ]);

    return {
      users: {
        total: userStats.reduce((sum, stat) => sum + stat._count, 0),
        byRole: userStats.reduce((acc, stat) => {
          acc[stat.role] = stat._count;
          return acc;
        }, {} as Record<string, number>),
      },
      companies: {
        total: companyStats.reduce((sum, stat) => sum + stat._count, 0),
        byStatus: companyStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count;
          return acc;
        }, {} as Record<string, number>),
      },
      employees: {
        total: employeeStats.reduce((sum, stat) => sum + stat._count, 0),
        byCommunity: employeeStats.reduce((acc, stat) => {
          acc[stat.community] = stat._count;
          return acc;
        }, {} as Record<string, number>),
      },
      aiAgents: {
        total: agentStats.reduce((sum, stat) => sum + stat._count, 0),
        byLevel: agentStats.reduce((acc, stat) => {
          if (!acc[stat.level]) acc[stat.level] = 0;
          acc[stat.level] += stat._count;
          return acc;
        }, {} as Record<string, number>),
        byType: agentStats.reduce((acc, stat) => {
          if (!acc[stat.type]) acc[stat.type] = 0;
          acc[stat.type] += stat._count;
          return acc;
        }, {} as Record<string, number>),
      },
      activity: {
        posts: activityStats[0],
        messages: activityStats[1],
        campaigns: activityStats[2],
      },
    };
  }

  async getDashboardMetrics() {
    const [
      totalUsers,
      totalCompanies,
      totalEmployees,
      totalAgents,
      activeAgents,
      recentActivity,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.employee.count(),
      prisma.aIAgent.count(),
      prisma.aIAgent.count({ where: { isActive: true } }),
      prisma.agentTask.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        companies: totalCompanies,
        employees: totalEmployees,
        agents: totalAgents,
      },
      activity: {
        activeAgents,
        tasksLast24h: recentActivity,
      },
    };
  }

  // AI Agent Mission Management
  async assignMissionsToAgent(agentId: string, missions: string[]) {
    const agent = await prisma.aIAgent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      throw ApiError.notFound('AI Agent not found');
    }

    // Validate missions are available for agent level
    const availableMissions = this.getMissionsForLevel(agent.level);
    const invalidMissions = missions.filter(m => !availableMissions.includes(m));

    if (invalidMissions.length > 0) {
      throw ApiError.badRequest(
        `Missions not available for agent level: ${invalidMissions.join(', ')}`
      );
    }

    // Update agent with new missions
    const updatedAgent = await prisma.aIAgent.update({
      where: { id: agentId },
      data: {
        allowedMissions: [...new Set([...agent.allowedMissions, ...missions])],
      },
    });

    logger.info(`Missions assigned to agent ${agent.name}`, {
      agentId,
      missions,
    });

    return updatedAgent;
  }

  async removeMissionsFromAgent(agentId: string, missions: string[]) {
    const agent = await prisma.aIAgent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      throw ApiError.notFound('AI Agent not found');
    }

    const updatedMissions = agent.allowedMissions.filter(m => !missions.includes(m));

    const updatedAgent = await prisma.aIAgent.update({
      where: { id: agentId },
      data: {
        allowedMissions: updatedMissions,
      },
    });

    logger.info(`Missions removed from agent ${agent.name}`, {
      agentId,
      missions,
    });

    return updatedAgent;
  }

  async getAvailableMissionsForLevel(level: keyof typeof AGENT_LEVELS) {
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

  // Activity Logs
  async getActivityLogs(filters: any) {
    // This would typically come from a separate audit log table
    // For now, return a placeholder structure
    return {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    };
  }

  // User Impersonation
  async impersonateUser(targetUserId: string, adminUserId: string) {
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw ApiError.notFound('Target user not found');
    }

    // Create impersonation token
    const token = jwt.sign(
      {
        userId: targetUserId,
        adminId: adminUserId,
        type: 'impersonation',
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    logger.info(`Admin impersonation started`, {
      adminId: adminUserId,
      targetUserId,
    });

    return token;
  }

  // Helper methods
  private getMissionsForLevel(level: keyof typeof AGENT_LEVELS): string[] {
    const missions: string[] = [];

    missions.push(...Object.keys(AGENT_MISSIONS.BASICO));

    if (level === 'AVANZADO' || level === 'EXPERTO') {
      missions.push(...Object.keys(AGENT_MISSIONS.AVANZADO));
    }

    if (level === 'EXPERTO') {
      missions.push(...Object.keys(AGENT_MISSIONS.EXPERTO));
    }

    return missions;
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