import { Router } from 'express';
import { authenticate, authorize } from '../../../middleware/auth';
import * as adminController from '../controllers/admin.controller';
import * as aiAgentController from '../controllers/aiAgent.controller';

const router = Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize(['ADMIN']));

// User Management Routes
router.post('/users', adminController.createUser);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users/bulk-actions', adminController.bulkUserActions);

// Role-specific Management Routes
router.get('/companies', adminController.getCompanies);
router.get('/employees', adminController.getEmployees);
router.get('/ai-agents', adminController.getAIAgents);
router.get('/administraciones', adminController.getAdministraciones);
router.get('/sindicatos', adminController.getSindicatos);

// AI Agent Management Routes
router.post('/ai-agents', aiAgentController.createAgent);
router.get('/ai-agents/:id', aiAgentController.getAgentById);
router.put('/ai-agents/:id', aiAgentController.updateAgent);
router.delete('/ai-agents/:id', aiAgentController.deleteAgent);
router.get('/ai-agents/:id/stats', aiAgentController.getAgentStats);

// AI Agent Mission Management
router.post('/ai-agents/:agentId/missions/assign', adminController.assignMissionsToAgent);
router.post('/ai-agents/:agentId/missions/remove', adminController.removeMissionsFromAgent);
router.get('/missions/level/:level', adminController.getAvailableMissionsForLevel);
router.get('/missions/level/:level/available', aiAgentController.getAvailableMissions);
router.get('/ai-agents/pricing', aiAgentController.getAgentPricing);

// System Statistics and Dashboard
router.get('/stats/system', adminController.getSystemStats);
router.get('/dashboard/metrics', adminController.getDashboardMetrics);
router.get('/activity-logs', adminController.getActivityLogs);

// User Impersonation (for support)
router.post('/users/:id/impersonate', adminController.impersonateUser);

export default router;