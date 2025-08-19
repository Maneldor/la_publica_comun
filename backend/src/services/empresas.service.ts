import prisma from '../config/database';
import { ApiError } from '../utils/ApiError';
import { EmpresasQuery } from '../validators/empresas.validator';

export interface EmpresaPublic {
  id: string;
  name: string;
  logo?: string | null;
  banner?: string | null;
  sector: string;
  descripcionPublica?: string | null;
  descripcionCompleta?: string | null;
  tags?: string | null;
  ubicacionVisible: boolean;
  city?: string | null;
  province?: string | null;
  address?: string | null;
  contactoPublico?: string | null;
  websiteUrl?: string | null;
  redesSociales?: string | null;
  estadoPerfil: string;
  destacada: boolean;
  employeeCount?: string | null;
  verifiedAt?: Date | null;
  fechaCreacionPerfil: Date;
  isFollowing?: boolean;
}

export interface EmpresasResponse {
  empresas: EmpresaPublic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class EmpresasService {
  /**
   * Obtener lista de empresas con filtros y paginación
   */
  async getEmpresas(query: EmpresasQuery, userId?: string): Promise<EmpresasResponse> {
    const {
      search,
      sector,
      ubicacion,
      verificadas,
      destacadas,
      page = 1,
      limit = 12
    } = query;

    const skip = (page - 1) * limit;

    // Construir filtros WHERE
    const where: any = {
      estadoPerfil: 'ACTIVO', // Solo empresas activas
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { descripcionPublica: { contains: search, mode: 'insensitive' } },
        { sector: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (sector) {
      where.sector = { contains: sector, mode: 'insensitive' };
    }

    if (ubicacion) {
      where.OR = [
        ...(where.OR || []),
        { city: { contains: ubicacion, mode: 'insensitive' } },
        { province: { contains: ubicacion, mode: 'insensitive' } }
      ];
    }

    if (verificadas) {
      where.estadoPerfil = 'VERIFICADO';
    }

    if (destacadas) {
      where.destacada = true;
    }

    // Obtener total de empresas
    const total = await prisma.company.count({ where });

    // Obtener empresas con paginación
    const empresas = await prisma.company.findMany({
      where,
      select: {
        id: true,
        name: true,
        logo: true,
        banner: true,
        sector: true,
        descripcionPublica: true,
        descripcionCompleta: true,
        tags: true,
        ubicacionVisible: true,
        city: true,
        province: true,
        address: true,
        contactoPublico: true,
        websiteUrl: true,
        redesSociales: true,
        estadoPerfil: true,
        destacada: true,
        employeeCount: true,
        verifiedAt: true,
        fechaCreacionPerfil: true,
      },
      orderBy: [
        { destacada: 'desc' }, // Destacadas primero
        { fechaCreacionPerfil: 'desc' } // Más recientes después
      ],
      skip,
      take: limit,
    });

    // Si hay usuario autenticado, verificar qué empresas sigue
    let empresasConSeguimiento = empresas;
    if (userId) {
      const colaboraciones = await prisma.empresaColaboracion.findMany({
        where: {
          empleado: {
            userId: userId
          },
          empresaId: {
            in: empresas.map(e => e.id)
          }
        },
        select: {
          empresaId: true
        }
      });

      const empresasSeguidas = new Set(colaboraciones.map(c => c.empresaId));
      
      empresasConSeguimiento = empresas.map(empresa => ({
        ...empresa,
        isFollowing: empresasSeguidas.has(empresa.id)
      }));
    }

    const totalPages = Math.ceil(total / limit);

    return {
      empresas: empresasConSeguimiento,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Obtener detalle de una empresa por ID
   */
  async getEmpresaById(empresaId: string, userId?: string): Promise<EmpresaPublic | null> {
    const empresa = await prisma.company.findFirst({
      where: {
        id: empresaId,
        estadoPerfil: 'ACTIVO'
      },
      select: {
        id: true,
        name: true,
        logo: true,
        banner: true,
        sector: true,
        descripcionPublica: true,
        descripcionCompleta: true,
        tags: true,
        ubicacionVisible: true,
        city: true,
        province: true,
        address: true,
        contactoPublico: true,
        websiteUrl: true,
        redesSociales: true,
        estadoPerfil: true,
        destacada: true,
        employeeCount: true,
        verifiedAt: true,
        fechaCreacionPerfil: true,
      }
    });

    if (!empresa) {
      return null;
    }

    // Si hay usuario autenticado, verificar si sigue la empresa
    let isFollowing = false;
    if (userId) {
      const colaboracion = await prisma.empresaColaboracion.findFirst({
        where: {
          empresaId: empresa.id,
          empleado: {
            userId: userId
          }
        }
      });
      isFollowing = !!colaboracion;
    }

    return {
      ...empresa,
      isFollowing
    };
  }

  /**
   * Seguir una empresa
   */
  async seguirEmpresa(empresaId: string, userId: string) {
    // Verificar que la empresa existe y está activa
    const empresa = await prisma.company.findFirst({
      where: {
        id: empresaId,
        estadoPerfil: 'ACTIVO'
      }
    });

    if (!empresa) {
      throw ApiError.notFound('Empresa no encontrada');
    }

    // Obtener el empleado
    const empleado = await prisma.employee.findFirst({
      where: { userId }
    });

    if (!empleado) {
      throw ApiError.notFound('Perfil de empleado no encontrado');
    }

    // Verificar si ya sigue la empresa
    const existeColaboracion = await prisma.empresaColaboracion.findFirst({
      where: {
        empresaId,
        empleadoId: empleado.id
      }
    });

    if (existeColaboracion) {
      throw ApiError.badRequest('Ya sigues esta empresa');
    }

    // Crear la colaboración
    const colaboracion = await prisma.empresaColaboracion.create({
      data: {
        empresaId,
        empleadoId: empleado.id,
        tipoColaboracion: 'SEGUIMIENTO',
        fechaInicio: new Date(),
        ultimaInteraccion: new Date()
      },
      include: {
        empresa: {
          select: {
            id: true,
            name: true,
            sector: true
          }
        }
      }
    });

    return colaboracion;
  }

  /**
   * Dejar de seguir una empresa
   */
  async dejarDeSeguirEmpresa(empresaId: string, userId: string) {
    // Obtener el empleado
    const empleado = await prisma.employee.findFirst({
      where: { userId }
    });

    if (!empleado) {
      throw ApiError.notFound('Perfil de empleado no encontrado');
    }

    // Buscar y eliminar la colaboración
    const colaboracion = await prisma.empresaColaboracion.findFirst({
      where: {
        empresaId,
        empleadoId: empleado.id
      }
    });

    if (!colaboracion) {
      throw ApiError.notFound('No sigues esta empresa');
    }

    await prisma.empresaColaboracion.delete({
      where: {
        id: colaboracion.id
      }
    });

    return true;
  }

  /**
   * Obtener empresas que sigue un empleado
   */
  async getEmpresasSeguidas(userId: string): Promise<EmpresaPublic[]> {
    // Obtener el empleado
    const empleado = await prisma.employee.findFirst({
      where: { userId }
    });

    if (!empleado) {
      throw ApiError.notFound('Perfil de empleado no encontrado');
    }

    const colaboraciones = await prisma.empresaColaboracion.findMany({
      where: {
        empleadoId: empleado.id
      },
      include: {
        empresa: {
          select: {
            id: true,
            name: true,
            logo: true,
            banner: true,
            sector: true,
            descripcionPublica: true,
            tags: true,
            ubicacionVisible: true,
            city: true,
            province: true,
            estadoPerfil: true,
            destacada: true,
            employeeCount: true,
            verifiedAt: true,
            fechaCreacionPerfil: true,
          }
        }
      },
      orderBy: {
        ultimaInteraccion: 'desc'
      }
    });

    return colaboraciones
      .filter(c => c.empresa.estadoPerfil === 'ACTIVO')
      .map(c => ({
        ...c.empresa,
        isFollowing: true
      }));
  }
}

export const empresasService = new EmpresasService();