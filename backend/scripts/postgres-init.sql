-- =====================================
-- SCRIPT DE INICIALIZACIÓN POSTGRESQL
-- La Pública - Sistema de Mensajería
-- =====================================

-- Configurar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Configurar localización española
SET default_text_search_config = 'spanish';

-- Crear función para búsqueda de texto sin acentos
CREATE OR REPLACE FUNCTION unaccent_spanish(text)
RETURNS text AS $$
BEGIN
    RETURN lower(unaccent($1));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Configuraciones de rendimiento para producción
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET log_statement = 'mod';
ALTER SYSTEM SET log_min_duration_statement = 1000;
ALTER SYSTEM SET log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h ';
ALTER SYSTEM SET log_checkpoints = on;
ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;
ALTER SYSTEM SET log_lock_waits = on;

-- Configuraciones de memoria
ALTER SYSTEM SET effective_cache_size = '512MB';
ALTER SYSTEM SET shared_buffers = '128MB';
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';

-- Configuraciones de checkpoint
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET max_wal_size = '1GB';
ALTER SYSTEM SET min_wal_size = '80MB';

-- Configuraciones de conexiones
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET idle_in_transaction_session_timeout = '10min';

-- Crear usuario de solo lectura para métricas
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'metrics_reader') THEN
        CREATE ROLE metrics_reader WITH LOGIN PASSWORD 'metrics_readonly_2024';
    END IF;
END
$$;

-- Permisos para usuario de métricas
GRANT CONNECT ON DATABASE la_publica_prod TO metrics_reader;
GRANT USAGE ON SCHEMA public TO metrics_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO metrics_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO metrics_reader;

-- Función para limpiar sesiones antiguas
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM "UserSession"
    WHERE "expiresAt" < NOW() - INTERVAL '1 day';
    
    DELETE FROM "LoginLog"
    WHERE "createdAt" < NOW() - INTERVAL '30 days';
    
    RAISE NOTICE 'Sesiones y logs antiguos limpiados';
END;
$$ LANGUAGE plpgsql;

-- Función para estadísticas de la aplicación
CREATE OR REPLACE FUNCTION get_app_stats()
RETURNS TABLE(
    total_users bigint,
    active_users_24h bigint,
    total_messages bigint,
    messages_today bigint,
    avg_messages_per_user numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM "User") as total_users,
        (SELECT COUNT(*) FROM "User" 
         WHERE "lastLogin" > NOW() - INTERVAL '24 hours') as active_users_24h,
        (SELECT COUNT(*) FROM "Message") as total_messages,
        (SELECT COUNT(*) FROM "Message" 
         WHERE "createdAt" >= CURRENT_DATE) as messages_today,
        CASE 
            WHEN (SELECT COUNT(*) FROM "User") > 0 THEN
                (SELECT COUNT(*)::numeric FROM "Message") / (SELECT COUNT(*) FROM "User")
            ELSE 0
        END as avg_messages_per_user;
END;
$$ LANGUAGE plpgsql;

-- Crear vista para métricas del sistema
CREATE OR REPLACE VIEW system_health AS
SELECT 
    NOW() as check_time,
    pg_database_size(current_database()) as db_size_bytes,
    pg_size_pretty(pg_database_size(current_database())) as db_size_human,
    (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active') as active_connections,
    (SELECT COUNT(*) FROM pg_stat_activity) as total_connections,
    (SELECT stats.* FROM get_app_stats() stats);

-- Comentarios en las funciones
COMMENT ON FUNCTION cleanup_old_sessions() IS 'Limpia sesiones expiradas y logs antiguos';
COMMENT ON FUNCTION get_app_stats() IS 'Obtiene estadísticas de la aplicación';
COMMENT ON VIEW system_health IS 'Vista con métricas de salud del sistema';

-- Configurar autovacuum más agresivo para tablas con mucha actividad
ALTER TABLE "Message" SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE "Notification" SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE "UserSession" SET (autovacuum_vacuum_scale_factor = 0.05);
ALTER TABLE "LoginLog" SET (autovacuum_vacuum_scale_factor = 0.05);

-- Log de inicialización completada
DO $$
BEGIN
    RAISE NOTICE 'Base de datos La Pública inicializada correctamente';
    RAISE NOTICE 'Extensiones habilitadas: uuid-ossp, pg_trgm, unaccent';
    RAISE NOTICE 'Configuración: Español, optimizada para producción';
    RAISE NOTICE 'Usuario de métricas: metrics_reader';
END
$$;