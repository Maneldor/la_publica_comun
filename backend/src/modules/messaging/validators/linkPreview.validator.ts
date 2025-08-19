import { body, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateGetLinkPreview = [
  query('url')
    .notEmpty().withMessage('URL es requerida')
    .isString().withMessage('URL debe ser una cadena')
    .isLength({ min: 1, max: 2000 }).withMessage('URL debe tener entre 1 y 2000 caracteres')
    .matches(/^https?:\/\//, 'i').withMessage('URL debe comenzar con http:// o https://'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    return next();
  }
];

export const validateGetMultipleLinkPreviews = [
  body('urls')
    .isArray({ min: 1, max: 5 }).withMessage('URLs debe ser un array de 1 a 5 elementos')
    .custom((urls) => {
      // Validar que todos los elementos sean strings válidos
      if (!urls.every((url: any) => typeof url === 'string' && url.length > 0 && url.length <= 2000)) {
        throw new Error('Cada URL debe ser una cadena válida de 1 a 2000 caracteres');
      }
      
      // Validar que todas las URLs tengan protocolo
      if (!urls.every((url: string) => /^https?:\/\//i.test(url))) {
        throw new Error('Todas las URLs deben comenzar con http:// o https://');
      }
      
      return true;
    }),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    return next();
  }
];

export const validateDetectUrlsInText = [
  body('text')
    .notEmpty().withMessage('Texto es requerido')
    .isString().withMessage('Texto debe ser una cadena')
    .isLength({ min: 1, max: 10000 }).withMessage('Texto debe tener entre 1 y 10000 caracteres'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    return next();
  }
];