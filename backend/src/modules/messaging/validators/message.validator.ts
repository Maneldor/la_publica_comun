import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateSendMessage = [
  body('recipientId')
    .notEmpty().withMessage('El ID del destinatario es requerido')
    .isString().withMessage('El ID del destinatario debe ser una cadena'),
  body('content')
    .notEmpty().withMessage('El contenido del mensaje es requerido')
    .isString().withMessage('El contenido debe ser una cadena')
    .isLength({ min: 1, max: 5000 }).withMessage('El contenido debe tener entre 1 y 5000 caracteres'),
  body('subject')
    .optional()
    .isString().withMessage('El asunto debe ser una cadena')
    .isLength({ max: 200 }).withMessage('El asunto no puede exceder 200 caracteres'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];