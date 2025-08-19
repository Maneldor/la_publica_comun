import { Router } from 'express';
import { validate } from '../utils/validation';
import { authenticate, optionalAuth } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import {
  getEmpresas,
  getEmpresaById,
  seguirEmpresa,
  dejarDeSeguirEmpresa,
  getEmpresasSeguidas
} from '../controllers/empresas.controller';
import {
  empresasQuerySchema,
  empresaIdSchema,
  seguirEmpresaSchema
} from '../validators/empresas.validator';

const router = Router();

/**
 * @route   GET /api/empresas
 * @desc    Obtener lista de empresas con filtros
 * @access  Public (opcional auth para seguimiento)
 */
router.get(
  '/',
  optionalAuth,
  validate(empresasQuerySchema, 'query'),
  asyncHandler(getEmpresas)
);

/**
 * @route   GET /api/empresas/:id
 * @desc    Obtener detalle de una empresa
 * @access  Public (opcional auth para seguimiento)
 */
router.get(
  '/:id',
  optionalAuth,
  validate(empresaIdSchema, 'params'),
  asyncHandler(getEmpresaById)
);

/**
 * @route   POST /api/empresas/seguir
 * @desc    Seguir una empresa
 * @access  Private (solo empleados públicos)
 */
router.post(
  '/seguir',
  authenticate,
  validate(seguirEmpresaSchema, 'body'),
  asyncHandler(seguirEmpresa)
);

/**
 * @route   DELETE /api/empresas/seguir/:empresaId
 * @desc    Dejar de seguir una empresa
 * @access  Private (solo empleados públicos)
 */
router.delete(
  '/seguir/:empresaId',
  authenticate,
  validate(empresaIdSchema, 'params'),
  asyncHandler(dejarDeSeguirEmpresa)
);

/**
 * @route   GET /api/empresas/seguidas
 * @desc    Obtener empresas que sigue el empleado actual
 * @access  Private (solo empleados públicos)
 */
router.get(
  '/seguidas',
  authenticate,
  asyncHandler(getEmpresasSeguidas)
);

export default router;