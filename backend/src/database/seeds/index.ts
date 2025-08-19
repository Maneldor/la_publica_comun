import bcrypt from 'bcryptjs';
import prisma from '../../config/database';
import logger from '../../utils/logger';

async function seed() {
  try {
    logger.info('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123456', 12);
    const admin = await prisma.user.upsert({
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
    const companyUser = await prisma.user.upsert({
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
            status: 'ACTIVE',
            verifiedAt: new Date(),
          },
        },
      },
    });

    logger.info('✅ Sample company created');

    // Create sample employee
    const employeePassword = await bcrypt.hash('employee123456', 12);
    const employeeUser = await prisma.user.upsert({
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
            salaryRange: '40k-50k',
            contractType: 'Funcionario de carrera',
            status: 'ACTIVE',
          },
        },
      },
    });

    logger.info('✅ Sample employee created');

    // Create sample posts
    const posts = [
      {
        title: 'Nueva Convocatoria de Oposiciones A1',
        slug: 'nueva-convocatoria-oposiciones-a1',
        content: 'Se ha publicado una nueva convocatoria para plazas de Técnico Superior...',
        excerpt: 'Nueva convocatoria para 50 plazas de Técnico Superior en la Generalitat',
        category: 'Oposiciones',
        tags: ['oposiciones', 'A1', 'generalitat'],
        status: 'PUBLISHED',
        publishedAt: new Date(),
        companyId: companyUser.id,
        authorId: companyUser.id,
      },
      {
        title: 'Guía para Preparar Oposiciones 2024',
        slug: 'guia-preparar-oposiciones-2024',
        content: 'Esta guía completa te ayudará a preparar las oposiciones de manera efectiva...',
        excerpt: 'Todo lo que necesitas saber para preparar las oposiciones este año',
        category: 'Formación',
        tags: ['formación', 'guía', 'preparación'],
        status: 'PUBLISHED',
        publishedAt: new Date(),
        companyId: companyUser.id,
        authorId: companyUser.id,
      },
    ];

    for (const post of posts) {
      await prisma.post.upsert({
        where: { slug: post.slug },
        update: {},
        create: post,
      });
    }

    logger.info('✅ Sample posts created');

    // Create sample email template
    await prisma.emailTemplate.upsert({
      where: { id: 'default-template' },
      update: {},
      create: {
        id: 'default-template',
        companyId: companyUser.id,
        name: 'Plantilla por Defecto',
        subject: 'Nueva oportunidad para empleados públicos',
        content: `
          <h1>Hola {{firstName}},</h1>
          <p>Tenemos una nueva oportunidad que puede interesarte:</p>
          <div>{{content}}</div>
          <p>Saludos,<br>{{companyName}}</p>
        `,
        variables: ['firstName', 'content', 'companyName'],
      },
    });

    logger.info('✅ Sample email template created');

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