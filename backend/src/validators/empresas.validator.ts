import { z } from 'zod';

// Schema para query parameters de listado de empresas
export const empresasQuerySchema = z.object({
  search: z.string().optional(),
  sector: z.string().optional(),
  ubicacion: z.string().optional(),
  verificadas: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
  destacadas: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 12)
}).refine(data => {
  return data.page >= 1 && data.limit >= 1 && data.limit <= 50;
}, {
  message: "Page debe ser >= 1 y limit entre 1 y 50"
});

// Schema para parámetro ID de empresa
export const empresaIdSchema = z.object({
  id: z.string().min(1, 'ID de empresa requerido')
});

// Schema para seguir empresa
export const seguirEmpresaSchema = z.object({
  empresaId: z.string().min(1, 'ID de empresa requerido')
});

// Tipos derivados
export type EmpresasQuery = z.infer<typeof empresasQuerySchema>;
export type EmpresaIdParams = z.infer<typeof empresaIdSchema>;
export type SeguirEmpresaBody = z.infer<typeof seguirEmpresaSchema>;