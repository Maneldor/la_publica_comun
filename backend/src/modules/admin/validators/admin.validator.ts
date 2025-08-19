import Joi from 'joi';
import { ROLES, COMMUNITIES } from '../../../config/constants';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid(...Object.values(ROLES)).required(),
  isEmailVerified: Joi.boolean().default(false),
  
  // Profile data based on role
  profileData: Joi.object({
    // For companies and organizations
    name: Joi.string().when('$role', {
      is: Joi.string().valid(ROLES.EMPRESA, ROLES.ADMINISTRACION_PUBLICA, ROLES.SINDICATO),
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
    cif: Joi.string().when('$role', {
      is: Joi.string().valid(ROLES.EMPRESA, ROLES.ADMINISTRACION_PUBLICA, ROLES.SINDICATO),
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
    sector: Joi.string().when('$role', {
      is: Joi.string().valid(ROLES.EMPRESA, ROLES.ADMINISTRACION_PUBLICA, ROLES.SINDICATO),
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
    
    // For employees
    firstName: Joi.string().when('$role', {
      is: ROLES.EMPLEADO_PUBLICO,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
    lastName: Joi.string().when('$role', {
      is: ROLES.EMPLEADO_PUBLICO,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
    community: Joi.string().valid(...Object.values(COMMUNITIES)).when('$role', {
      is: ROLES.EMPLEADO_PUBLICO,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
    
    // For AI agents
    agentName: Joi.string().when('$role', {
      is: ROLES.AGENTE_IA,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
    agentType: Joi.string().valid('COMERCIAL', 'RRHH', 'DISENADOR', 'ANALISTA', 'SOPORTE', 'MARKETING').when('$role', {
      is: ROLES.AGENTE_IA,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
    companyId: Joi.string().when('$role', {
      is: ROLES.AGENTE_IA,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
  }).required(),
}).options({ context: { role: Joi.ref('role') } });

export const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  role: Joi.string().valid(...Object.values(ROLES)),
  isEmailVerified: Joi.boolean(),
  status: Joi.string().valid('ACTIVE', 'SUSPENDED', 'PENDING'),
  profileData: Joi.object().unknown(true),
});

export const getUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  role: Joi.string().valid(...Object.values(ROLES)),
  status: Joi.string().valid('ACTIVE', 'SUSPENDED', 'PENDING'),
  search: Joi.string().min(2).max(100),
  community: Joi.string().valid(...Object.values(COMMUNITIES)),
  sortBy: Joi.string().valid('createdAt', 'email', 'role', 'lastLogin').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

export const userParamsSchema = Joi.object({
  id: Joi.string().required(),
});

export const bulkActionSchema = Joi.object({
  userIds: Joi.array().items(Joi.string()).min(1).max(100).required(),
  action: Joi.string().valid('activate', 'suspend', 'delete', 'verify_email').required(),
});

export const systemStatsQuerySchema = Joi.object({
  period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
});

// AI Agent Mission Management Schemas
export const assignMissionsSchema = Joi.object({
  missions: Joi.array().items(Joi.string()).min(1).required(),
});

export const removeMissionsSchema = Joi.object({
  missions: Joi.array().items(Joi.string()).min(1).required(),
});

export const agentLevelParamsSchema = Joi.object({
  level: Joi.string().valid('BASICO', 'AVANZADO', 'EXPERTO').required(),
});

export const agentParamsSchema = Joi.object({
  agentId: Joi.string().required(),
});

// Activity Logs Schema
export const activityLogsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  userId: Joi.string(),
  action: Joi.string(),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
});