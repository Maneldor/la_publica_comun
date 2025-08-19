import { Router } from 'express';
import { authenticate, authorize } from '../../../middleware/auth';
import * as chatController from '../controllers/chat.controller';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// === RUTAS DE CHAT EMPRESA-AGENTE ===
router.post('/sessions', 
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.initiateChat
);

router.get('/sessions/:sessionId', 
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.getChatSession
);

router.post('/sessions/:sessionId/messages',
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.sendMessage
);

router.get('/sessions/:sessionId/messages',
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.getChatHistory
);

// === RUTAS DE GESTIÓN DE TAREAS ===
router.post('/tasks/:taskId/approve',
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.approveTask
);

router.post('/tasks/:taskId/reject',
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.rejectTask
);

// === RUTAS DE PERFILES DE EMPRESA ===
router.get('/company-profile',
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.getCompanyProfile
);

router.post('/company-profile/publish',
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.publishCompanyProfile
);

// === RUTAS DE OFERTAS DE TRABAJO ===
router.get('/job-offers',
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.getJobOffers
);

router.post('/job-offers/:offerId/publish',
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.publishJobOffer
);

// === RUTAS DE ANÁLISIS COMPETITIVO ===
router.get('/competitive-analysis',
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.getCompetitiveAnalysis
);

router.post('/competitive-analysis/request',
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.requestCompetitiveAnalysis
);

// === RUTAS DE REPORTES ===
router.get('/reports',
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.getReports
);

router.post('/reports/generate',
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.generateReport
);

// === RUTAS DE CONFIGURACIÓN DE IA ===
router.get('/ai-config',
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.getAIConfiguration
);

router.put('/ai-config',
  authorize(['EMPRESA', 'ADMINISTRACION_PUBLICA', 'SINDICATO']),
  chatController.updateAIConfiguration
);

export default router;