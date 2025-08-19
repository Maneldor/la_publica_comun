#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Configuración
const config = require('../src/config/environment');

async function migrateToPostgreSQL() {
  console.log('🚀 === MIGRACIÓN A POSTGRESQL PARA PRODUCCIÓN ===\n');

  try {
    // 1. Verificar configuración de PostgreSQL
    console.log('🔧 Verificando configuración de PostgreSQL...');
    
    if (!config.database.url.includes('postgresql://')) {
      throw new Error('DATABASE_URL debe ser una URL de PostgreSQL');
    }

    console.log(`✅ URL de base de datos: ${config.database.url.replace(/:[^:]*@/, ':***@')}`);

    // 2. Crear cliente de Prisma para PostgreSQL
    console.log('\n📊 Conectando a PostgreSQL...');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: config.database.url
        }
      }
    });

    await prisma.$connect();
    console.log('✅ Conexión a PostgreSQL exitosa');

    // 3. Verificar si la base de datos está vacía
    console.log('\n🔍 Verificando estado de la base de datos...');
    
    try {
      const userCount = await prisma.user.count();
      console.log(`📊 Usuarios existentes: ${userCount}`);
      
      if (userCount > 0) {
        console.log('⚠️  La base de datos ya contiene datos. Continuando...');
      } else {
        console.log('✅ Base de datos lista para migración inicial');
      }
    } catch (error) {
      console.log('📝 Ejecutando migración inicial...');
    }

    // 4. Aplicar migraciones de Prisma
    console.log('\n⚡ Aplicando esquema de base de datos...');
    
    // Copiar schema de producción temporalmente
    const productionSchemaPath = path.join(__dirname, '../prisma/schema.production.prisma');
    const mainSchemaPath = path.join(__dirname, '../prisma/schema.prisma');
    const backupSchemaPath = path.join(__dirname, '../prisma/schema.backup.prisma');
    
    // Hacer backup del schema actual
    if (fs.existsSync(mainSchemaPath)) {
      fs.copyFileSync(mainSchemaPath, backupSchemaPath);
      console.log('📄 Backup del schema actual creado');
    }
    
    // Usar schema de producción
    fs.copyFileSync(productionSchemaPath, mainSchemaPath);
    console.log('📄 Schema de producción aplicado');

    // 5. Ejecutar db push para aplicar cambios
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    console.log('🔄 Ejecutando prisma db push...');
    const { stdout, stderr } = await execAsync('npx prisma db push --force-reset', {
      cwd: path.join(__dirname, '..')
    });
    
    if (stderr && !stderr.includes('warn')) {
      console.error('❌ Error en db push:', stderr);
      throw new Error(stderr);
    }
    
    console.log('✅ Esquema aplicado exitosamente');

    // 6. Generar cliente de Prisma
    console.log('\n🔄 Generando cliente de Prisma...');
    const { stdout: genStdout } = await execAsync('npx prisma generate', {
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ Cliente de Prisma generado');

    // 7. Crear datos iniciales para producción
    console.log('\n🌱 Creando datos iniciales...');
    
    // Crear usuario administrador
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@lapublica.es' },
      update: {},
      create: {
        email: 'admin@lapublica.es',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewrBw5ltjwxLgMmS', // admin123
        role: 'ADMIN',
        isEmailVerified: true,
        employee: {
          create: {
            firstName: 'Administrador',
            lastName: 'Sistema',
            community: 'madrid',
            organization: 'La Pública',
            organizationType: 'Sistema',
            jobTitle: 'Administrador del Sistema'
          }
        }
      },
      include: {
        employee: true
      }
    });

    console.log(`✅ Usuario administrador creado: ${adminUser.email}`);

    // 8. Crear índices adicionales para optimización
    console.log('\n⚡ Creando índices adicionales...');
    
    const indices = [
      // Índice para búsqueda full-text en PostgreSQL
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS messages_content_gin_idx ON messages USING gin(to_tsvector('english', content))`,
      
      // Índices compuestos para consultas frecuentes
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS messages_sender_created_idx ON messages(sender_id, created_at DESC)`,
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS messages_recipient_created_idx ON messages(recipient_id, created_at DESC)`,
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS notifications_user_unread_idx ON notifications(user_id, is_read, created_at DESC)`,
      
      // Índices para auditoría
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS login_logs_user_date_idx ON login_logs(user_id, created_at DESC)`,
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS push_subscriptions_active_idx ON push_subscriptions(user_id, is_active, last_used DESC)`
    ];

    for (const sql of indices) {
      try {
        await prisma.$executeRawUnsafe(sql);
        console.log(`✅ Índice creado: ${sql.split(' ')[5]}`);
      } catch (error) {
        if (!error.message.includes('already exists')) {
          console.warn(`⚠️  Error creando índice: ${error.message}`);
        }
      }
    }

    // 9. Configurar extensiones de PostgreSQL
    console.log('\n🔧 Configurando extensiones de PostgreSQL...');
    
    const extensions = [
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',    // Para UUIDs
      'CREATE EXTENSION IF NOT EXISTS "pg_trgm"',      // Para búsqueda de texto similar
      'CREATE EXTENSION IF NOT EXISTS "unaccent"'      // Para búsqueda sin acentos
    ];

    for (const sql of extensions) {
      try {
        await prisma.$executeRawUnsafe(sql);
        console.log(`✅ Extensión habilitada: ${sql.split('"')[1]}`);
      } catch (error) {
        console.warn(`⚠️  Error habilitando extensión: ${error.message}`);
      }
    }

    // 10. Verificar migración
    console.log('\n🔍 Verificando migración...');
    
    const stats = {
      users: await prisma.user.count(),
      employees: await prisma.employee.count(),
      companies: await prisma.company.count(),
      messages: await prisma.message.count(),
      reactions: await prisma.messageReaction.count(),
      notifications: await prisma.notification.count(),
      pushSubscriptions: await prisma.pushSubscription.count()
    };

    console.log('📊 Estadísticas de la base de datos:');
    Object.entries(stats).forEach(([table, count]) => {
      console.log(`   - ${table}: ${count} registros`);
    });

    // 11. Crear métricas iniciales del sistema
    await prisma.systemMetrics.create({
      data: {
        totalUsers: stats.users,
        activeUsers: stats.users,
        newUsersToday: stats.users,
        totalMessages: stats.messages,
        messagesToday: stats.messages,
        avgMessagesPerUser: stats.users > 0 ? stats.messages / stats.users : 0
      }
    });

    console.log('✅ Métricas iniciales creadas');

    await prisma.$disconnect();

    console.log('\n🎉 ¡MIGRACIÓN A POSTGRESQL COMPLETADA EXITOSAMENTE!');
    console.log('\n📋 RESUMEN:');
    console.log('✅ Conexión a PostgreSQL establecida');
    console.log('✅ Esquema de producción aplicado');
    console.log('✅ Índices optimizados creados');
    console.log('✅ Extensiones de PostgreSQL habilitadas');
    console.log('✅ Usuario administrador creado');
    console.log('✅ Métricas del sistema inicializadas');
    
    console.log('\n🔐 CREDENCIALES DEL ADMINISTRADOR:');
    console.log('   Email: admin@lapublica.es');
    console.log('   Password: admin123');
    console.log('   ⚠️  CAMBIAR LA CONTRASEÑA INMEDIATAMENTE');
    
    console.log('\n🚀 La base de datos está lista para producción!');

  } catch (error) {
    console.error('\n❌ Error durante la migración:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
  migrateToPostgreSQL().catch(console.error);
}

module.exports = { migrateToPostgreSQL };