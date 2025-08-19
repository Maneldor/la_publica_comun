#!/usr/bin/env node
/**
 * ===================================
 * LA PÚBLICA - BACKGROUND WORKER
 * ===================================
 * 
 * Procesa trabajos en segundo plano:
 * - Scraping de empresas
 * - Envío de emails
 * - Generación de reportes
 * - Análisis competitivo
 */

import dotenv from 'dotenv';
import { BackgroundJobService } from './services/backgroundJobs';
import logger from './utils/logger';

// Cargar configuración
dotenv.config();

// Configurar manejo de señales para graceful shutdown
let isShuttingDown = false;
const jobService = new BackgroundJobService();

async function main() {
  logger.info('🚀 Starting La Pública Background Worker...');

  try {
    // Iniciar procesador de trabajos
    await jobService.startJobProcessor();
    
    logger.info('✅ Background worker started successfully');
    
    // Mantener el proceso vivo
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
    // Log estadísticas cada 5 minutos
    setInterval(async () => {
      try {
        const stats = await BackgroundJobService.getJobStats();
        logger.info('📊 Job Statistics:', stats);
      } catch (error) {
        logger.error('Error getting job stats:', error);
      }
    }, 5 * 60 * 1000);
    
  } catch (error) {
    logger.error('❌ Failed to start background worker:', error);
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string) {
  if (isShuttingDown) {
    logger.warn('⚠️  Force shutdown initiated');
    process.exit(1);
  }
  
  isShuttingDown = true;
  logger.info(`🔄 Graceful shutdown initiated (${signal})`);
  
  try {
    // Parar el procesador de trabajos
    await jobService.stopJobProcessor();
    
    // Dar tiempo para completar trabajos en curso
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    logger.info('✅ Background worker stopped gracefully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
}

// Iniciar worker
main().catch((error) => {
  logger.error('❌ Unhandled error in worker:', error);
  process.exit(1);
});