import bcrypt from 'bcryptjs';
import prisma from '../../config/database';
import logger from '../../utils/logger';

async function seed() {
  try {
    logger.info('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123456', 12);
    await prisma.user.upsert({
      where: { email: 'admin@lapublica.es' },
      update: {},
      create: {
        email: 'admin@lapublica.es',
        password: adminPassword,
        role: 'ADMIN',
        isEmailVerified: true,
      },
    });

    logger.info('✅ Admin user created');

    // Create sample company
    const companyPassword = await bcrypt.hash('company123456', 12);
    await prisma.user.upsert({
      where: { email: 'empresa@ejemplo.es' },
      update: {},
      create: {
        email: 'empresa@ejemplo.es',
        password: companyPassword,
        role: 'EMPRESA',
        isEmailVerified: true,
        company: {
          create: {
            name: 'Empresa Ejemplo S.L.',
            cif: 'B12345678',
            sector: 'Tecnología',
            email: 'empresa@ejemplo.es',
            description: 'Empresa de ejemplo para testing',
            city: 'Barcelona',
            province: 'Barcelona',
            country: 'España',
            verifiedAt: new Date(),
          },
        },
      },
    });

    logger.info('✅ Sample company created');

    // Create sample employee
    const employeePassword = await bcrypt.hash('employee123456', 12);
    await prisma.user.upsert({
      where: { email: 'empleado@generalitat.cat' },
      update: {},
      create: {
        email: 'empleado@generalitat.cat',
        password: employeePassword,
        role: 'EMPLEADO_PUBLICO',
        isEmailVerified: true,
        employee: {
          create: {
            firstName: 'Joan',
            lastName: 'Martí',
            community: 'CATALUNYA',
            province: 'Barcelona',
            city: 'Barcelona',
            jobTitle: 'Técnico Superior',
            department: 'Tecnologías de la Información',
            organization: 'Generalitat de Catalunya',
            organizationType: 'Comunidad Autónoma',
            employeeCategory: 'A1',
            contractType: 'Funcionario de carrera',
          },
        },
      },
    });

    logger.info('✅ Sample employee created');

    // Sample posts and email templates are not available in SQLite schema
    logger.info('✅ Basic data seeding completed');

    logger.info('🎉 Database seeding completed successfully!');
    
    // Print credentials for development
    logger.info('📋 Development credentials:');
    logger.info('Admin: admin@lapublica.es / admin123456');
    logger.info('Company: empresa@ejemplo.es / company123456');
    logger.info('Employee: empleado@generalitat.cat / employee123456');

  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seed;