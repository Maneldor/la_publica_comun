import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiError } from '../../../utils/ApiError';
import linkPreviewService from '../services/linkPreview.service';

/**
 * Obtiene el preview de una URL específica
 */
export const getLinkPreview = asyncHandler(async (req: Request, res: Response) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    throw new ApiError(400, 'URL es requerida');
  }

  // Validar que sea una URL válida
  const urls = linkPreviewService.detectUrls(url);
  if (urls.length === 0) {
    throw new ApiError(400, 'URL inválida');
  }

  try {
    const preview = await linkPreviewService.extractMetadata(url);
    
    if (!preview) {
      throw new ApiError(404, 'No se pudo obtener información de la URL');
    }

    res.json({
      success: true,
      data: preview
    });
  } catch (error) {
    console.error('Error obteniendo preview de URL:', error);
    throw new ApiError(500, 'Error al procesar la URL');
  }
});

/**
 * Obtiene previews para múltiples URLs
 */
export const getMultipleLinkPreviews = asyncHandler(async (req: Request, res: Response) => {
  const { urls } = req.body;

  if (!urls || !Array.isArray(urls)) {
    throw new ApiError(400, 'Se requiere un array de URLs');
  }

  if (urls.length === 0) {
    throw new ApiError(400, 'El array de URLs no puede estar vacío');
  }

  if (urls.length > 5) {
    throw new ApiError(400, 'Máximo 5 URLs permitidas por solicitud');
  }

  // Validar que todas sean strings
  if (!urls.every(url => typeof url === 'string')) {
    throw new ApiError(400, 'Todas las URLs deben ser strings válidas');
  }

  try {
    const previews = await linkPreviewService.processUrls(urls);

    res.json({
      success: true,
      data: previews
    });
  } catch (error) {
    console.error('Error obteniendo previews de URLs:', error);
    throw new ApiError(500, 'Error al procesar las URLs');
  }
});

/**
 * Detecta URLs en un texto
 */
export const detectUrlsInText = asyncHandler(async (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    throw new ApiError(400, 'Texto es requerido');
  }

  if (text.length > 10000) {
    throw new ApiError(400, 'El texto no puede exceder 10000 caracteres');
  }

  try {
    const urls = linkPreviewService.detectUrls(text);

    res.json({
      success: true,
      data: {
        urls,
        count: urls.length
      }
    });
  } catch (error) {
    console.error('Error detectando URLs en texto:', error);
    throw new ApiError(500, 'Error al detectar URLs');
  }
});