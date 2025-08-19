import { Response } from 'express';
import { AIAgentService } from '../services/aiAgent.service';
import { AuthRequest } from '../../../types';
import { asyncHandler } from '../../../utils/asyncHandler';

const aiAgentService = new AIAgentService();

export const createAgent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const agent = await aiAgentService.createAgent(req.body);
  
  res.status(201).json({
    success: true,
    message: 'AI Agent created successfully',
    data: agent,
  });
});

export const updateAgent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const agent = await aiAgentService.updateAgent(id, req.body);
  
  res.json({
    success: true,
    message: 'AI Agent updated successfully',
    data: agent,
  });
});

export const getAgents = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await aiAgentService.getAgents(req.query as any);
  
  res.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

export const getAgentById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const agent = await aiAgentService.getAgentById(id);
  
  res.json({
    success: true,
    data: agent,
  });
});

export const deleteAgent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const result = await aiAgentService.deleteAgent(id);
  
  res.json({
    success: true,
    data: result,
  });
});

export const getAgentStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { period, companyId } = req.query;
  
  const stats = await aiAgentService.getAgentStats(
    id, 
    companyId as string, 
    period as string
  );
  
  res.json({
    success: true,
    data: stats,
  });
});

export const getAvailableMissions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { level } = req.params;
  const missions = await aiAgentService.getAvailableMissions(level as any);
  
  res.json({
    success: true,
    data: missions,
  });
});

export const getAgentPricing = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      levels: ['BASICO', 'AVANZADO', 'EXPERTO'],
      pricing: {
        BASICO: {
          name: 'Agente Básico',
          price: 99,
          tokensIncluded: 10000,
          maxAgents: 1,
          features: [
            'Responder emails básicos',
            'Clasificar leads',
            'Crear contenido simple',
            'Soporte por email',
          ],
        },
        AVANZADO: {
          name: 'Agente Avanzado', 
          price: 299,
          tokensIncluded: 50000,
          maxAgents: 3,
          features: [
            'Todo lo del plan Básico',
            'Análisis de comportamiento',
            'Campañas personalizadas',
            'Optimización de perfiles',
            'Soporte prioritario',
          ],
        },
        EXPERTO: {
          name: 'Agente Experto',
          price: 999,
          tokensIncluded: 200000,
          maxAgents: 10,
          features: [
            'Todo lo de planes anteriores',
            'Estrategias completas',
            'Automatización de procesos',
            'Predicciones avanzadas',
            'Soporte 24/7',
            'Integración personalizada',
          ],
        },
      },
    },
  });
});