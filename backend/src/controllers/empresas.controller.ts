import { Response } from 'express';
import { AuthRequest } from '../types';
import { ApiError } from '../utils/ApiError';
import { empresasService } from '../services/empresas.service';
import {
  EmpresasQuery,
  EmpresaIdParams,
  SeguirEmpresaBody
} from '../validators/empresas.validator';

/**
 * @desc    Obtener lista de empresas con filtros
 * @route   GET /api/empresas
 * @access  Public (opcional auth)
 */
export const getEmpresas = async (req: AuthRequest, res: Response) => {
  const query = req.query as EmpresasQuery;
  const userId = req.user?.id;

  const result = await empresasService.getEmpresas(query, userId);

  res.json({
    success: true,
    data: result.empresas,
    pagination: result.pagination,
    message: `${result.pagination.total} empresas encontradas`
  });
};

/**
 * @desc    Obtener detalle de una empresa
 * @route   GET /api/empresas/:id
 * @access  Public (opcional auth)
 */
export const getEmpresaById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as EmpresaIdParams;
  const userId = req.user?.id;

  const empresa = await empresasService.getEmpresaById(id, userId);

  if (!empresa) {
    throw ApiError.notFound('Empresa no encontrada');
  }

  res.json({
    success: true,
    data: empresa,
    message: 'Empresa obtenida correctamente'
  });
};

/**
 * @desc    Seguir una empresa
 * @route   POST /api/empresas/seguir
 * @access  Private (solo empleados)
 */
export const seguirEmpresa = async (req: AuthRequest, res: Response) => {
  const { empresaId } = req.body as SeguirEmpresaBody;
  const userId = req.user!.id;

  // Verificar que el usuario sea empleado público
  if (req.user!.role !== 'EMPLEADO_PUBLICO') {
    throw ApiError.forbidden('Solo los empleados públicos pueden seguir empresas');
  }

  const colaboracion = await empresasService.seguirEmpresa(empresaId, userId);

  res.status(201).json({
    success: true,
    data: colaboracion,
    message: 'Empresa seguida correctamente'
  });
};

/**
 * @desc    Dejar de seguir una empresa
 * @route   DELETE /api/empresas/seguir/:empresaId
 * @access  Private (solo empleados)
 */
export const dejarDeSeguirEmpresa = async (req: AuthRequest, res: Response) => {
  const { id: empresaId } = req.params as EmpresaIdParams;
  const userId = req.user!.id;

  // Verificar que el usuario sea empleado público
  if (req.user!.role !== 'EMPLEADO_PUBLICO') {
    throw ApiError.forbidden('Solo los empleados públicos pueden seguir empresas');
  }

  await empresasService.dejarDeSeguirEmpresa(empresaId, userId);

  res.json({
    success: true,
    message: 'Dejaste de seguir la empresa correctamente'
  });
};

/**
 * @desc    Obtener empresas que sigue el empleado actual
 * @route   GET /api/empresas/seguidas
 * @access  Private (solo empleados)
 */
export const getEmpresasSeguidas = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  // Verificar que el usuario sea empleado público
  if (req.user!.role !== 'EMPLEADO_PUBLICO') {
    throw ApiError.forbidden('Solo los empleados públicos pueden ver empresas seguidas');
  }

  const empresas = await empresasService.getEmpresasSeguidas(userId);

  res.json({
    success: true,
    data: empresas,
    message: `${empresas.length} empresas seguidas`
  });
};