import { Response } from 'express';
import { AdminService } from '../services/admin.service';
import { AuthRequest } from '../../../types';
import { asyncHandler } from '../../../utils/asyncHandler';
import { validateRequest } from '../../../middleware/validation';
import { 
  createUserSchema, 
  updateUserSchema, 
  getUsersQuerySchema,
  userParamsSchema,
  bulkActionSchema,
  systemStatsQuerySchema,
  assignMissionsSchema,
  removeMissionsSchema,
  agentLevelParamsSchema,
  agentParamsSchema,
  activityLogsQuerySchema
} from '../validators/admin.validator';

const adminService = new AdminService();

// User Management
export const createUser = [
  validateRequest(createUserSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await adminService.createUser(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  })
];

export const getUsers = [
  validateRequest(getUsersQuerySchema, 'query'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await adminService.getUsers(req.query as any);
    
    res.json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  })
];

export const getUserById = [
  validateRequest(userParamsSchema, 'params'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const user = await adminService.getUserById(id);
    
    res.json({
      success: true,
      data: user,
    });
  })
];

export const updateUser = [
  validateRequest(userParamsSchema, 'params'),
  validateRequest(updateUserSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const user = await adminService.updateUser(id, req.body);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  })
];

export const deleteUser = [
  validateRequest(userParamsSchema, 'params'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await adminService.deleteUser(id);
    
    res.json({
      success: true,
      data: result,
    });
  })
];

export const bulkUserActions = [
  validateRequest(bulkActionSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await adminService.bulkUserActions(req.body);
    
    res.json({
      success: true,
      message: `Bulk action '${req.body.action}' completed successfully`,
      data: result,
    });
  })
];

// Role-specific endpoints
export const getCompanies = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await adminService.getCompaniesList(req.query as any);
  
  res.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

export const getEmployees = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await adminService.getEmployeesList(req.query as any);
  
  res.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

export const getAIAgents = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await adminService.getAIAgentsList(req.query as any);
  
  res.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

export const getAdministraciones = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await adminService.getAdministracionesList(req.query as any);
  
  res.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

export const getSindicatos = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await adminService.getSindicatosList(req.query as any);
  
  res.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

// System Statistics
export const getSystemStats = [
  validateRequest(systemStatsQuerySchema, 'query'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const stats = await adminService.getSystemStats(req.query as any);
    
    res.json({
      success: true,
      data: stats,
    });
  })
];

export const getDashboardMetrics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const metrics = await adminService.getDashboardMetrics();
  
  res.json({
    success: true,
    data: metrics,
  });
});

// AI Agent Mission Management
export const assignMissionsToAgent = [
  validateRequest(agentParamsSchema, 'params'),
  validateRequest(assignMissionsSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { agentId } = req.params;
    const { missions } = req.body;
    
    const result = await adminService.assignMissionsToAgent(agentId, missions);
    
    res.json({
      success: true,
      message: 'Missions assigned successfully',
      data: result,
    });
  })
];

export const removeMissionsFromAgent = [
  validateRequest(agentParamsSchema, 'params'),
  validateRequest(removeMissionsSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { agentId } = req.params;
    const { missions } = req.body;
    
    const result = await adminService.removeMissionsFromAgent(agentId, missions);
    
    res.json({
      success: true,
      message: 'Missions removed successfully',
      data: result,
    });
  })
];

export const getAvailableMissionsForLevel = [
  validateRequest(agentLevelParamsSchema, 'params'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { level } = req.params;
    const missions = await adminService.getAvailableMissionsForLevel(level as any);
    
    res.json({
      success: true,
      data: missions,
    });
  })
];

// Activity logs
export const getActivityLogs = [
  validateRequest(activityLogsQuerySchema, 'query'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const logs = await adminService.getActivityLogs(req.query as any);
    
    res.json({
      success: true,
      data: logs.data,
      meta: logs.meta,
    });
  })
];

// User impersonation for support
export const impersonateUser = [
  validateRequest(userParamsSchema, 'params'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const token = await adminService.impersonateUser(id, req.user!.id);
    
    res.json({
      success: true,
      message: 'Impersonation token created',
      data: { token },
    });
  })
];