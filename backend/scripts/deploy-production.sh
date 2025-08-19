#!/bin/bash

# =====================================
# SCRIPT DE DEPLOYMENT PARA PRODUCCIÓN
# La Pública - Sistema de Mensajería
# =====================================

set -e  # Salir si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Banner
echo -e "${BLUE}"
echo "=========================================="
echo "🚀 LA PÚBLICA - DEPLOYMENT PRODUCCIÓN"
echo "=========================================="
echo -e "${NC}"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -f "docker-compose.production.yml" ]; then
    log_error "Este script debe ejecutarse desde el directorio del backend"
    exit 1
fi

# Verificar que Docker está instalado
if ! command -v docker &> /dev/null; then
    log_error "Docker no está instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose no está instalado"
    exit 1
fi

# Verificar variables de entorno requeridas
log_info "Verificando variables de entorno..."

required_vars=(
    "DB_PASSWORD"
    "REDIS_PASSWORD"
    "JWT_SECRET"
    "VAPID_PUBLIC_KEY"
    "VAPID_PRIVATE_KEY"
    "CLIENT_URL"
    "SMTP_USER"
    "SMTP_PASS"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    log_error "Variables de entorno faltantes:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    echo ""
    log_info "Carga las variables desde .env.production:"
    echo "  export \$(cat .env.production | xargs)"
    exit 1
fi

log_success "Variables de entorno verificadas"

# Función para verificar conectividad de base de datos
check_database() {
    log_info "Verificando conectividad de base de datos..."
    
    # Esperar a que PostgreSQL esté listo
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose -f docker-compose.production.yml exec -T postgres pg_isready -U la_publica_user -d la_publica_prod > /dev/null 2>&1; then
            log_success "Base de datos conectada"
            return 0
        fi
        
        log_info "Esperando base de datos... (intento $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_error "No se pudo conectar a la base de datos después de $max_attempts intentos"
    return 1
}

# Función para ejecutar migraciones
run_migrations() {
    log_info "Ejecutando migraciones de base de datos..."
    
    # Copiar schema de producción
    cp prisma/schema.production.prisma prisma/schema.prisma
    
    # Ejecutar migraciones
    docker-compose -f docker-compose.production.yml exec -T api npx prisma db push --force-reset
    
    # Generar cliente
    docker-compose -f docker-compose.production.yml exec -T api npx prisma generate
    
    log_success "Migraciones completadas"
}

# Función para verificar health checks
check_health() {
    log_info "Verificando health checks..."
    
    max_attempts=20
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3001/health > /dev/null 2>&1; then
            log_success "API funcionando correctamente"
            return 0
        fi
        
        log_info "Esperando que la API esté lista... (intento $attempt/$max_attempts)"
        sleep 3
        attempt=$((attempt + 1))
    done
    
    log_error "La API no responde después de $max_attempts intentos"
    return 1
}

# Función de cleanup en caso de error
cleanup() {
    log_warning "Limpiando recursos..."
    docker-compose -f docker-compose.production.yml down
}

# Trap para cleanup en caso de error
trap cleanup ERR

# =====================================
# PROCESO DE DEPLOYMENT
# =====================================

log_info "Iniciando proceso de deployment..."

# 1. Detener servicios existentes
log_info "Deteniendo servicios existentes..."
docker-compose -f docker-compose.production.yml down

# 2. Limpiar contenedores e imágenes huérfanas
log_info "Limpiando contenedores e imágenes huérfanas..."
docker system prune -f

# 3. Construir imágenes
log_info "Construyendo imagen de producción..."
docker-compose -f docker-compose.production.yml build --no-cache

# 4. Iniciar servicios de infraestructura primero
log_info "Iniciando servicios de base de datos..."
docker-compose -f docker-compose.production.yml up -d postgres redis

# 5. Esperar a que la base de datos esté lista
if ! check_database; then
    log_error "Fallo en la verificación de base de datos"
    exit 1
fi

# 6. Iniciar API
log_info "Iniciando API..."
docker-compose -f docker-compose.production.yml up -d api

# 7. Ejecutar migraciones
if ! run_migrations; then
    log_error "Fallo en las migraciones"
    exit 1
fi

# 8. Iniciar NGINX
log_info "Iniciando NGINX..."
docker-compose -f docker-compose.production.yml up -d nginx

# 9. Verificar que todo funciona
if ! check_health; then
    log_error "Fallo en health checks"
    exit 1
fi

# 10. Mostrar estado de servicios
log_info "Estado de servicios:"
docker-compose -f docker-compose.production.yml ps

# 11. Mostrar logs recientes
log_info "Logs recientes de la API:"
docker-compose -f docker-compose.production.yml logs --tail=20 api

# =====================================
# VERIFICACIONES POST-DEPLOYMENT
# =====================================

log_info "Ejecutando verificaciones post-deployment..."

# Verificar endpoints críticos
endpoints=(
    "http://localhost:3001/health"
    "http://localhost:3001/api/auth/login"
)

for endpoint in "${endpoints[@]}"; do
    if curl -f "$endpoint" > /dev/null 2>&1; then
        log_success "✓ $endpoint"
    else
        log_warning "✗ $endpoint no responde"
    fi
done

# =====================================
# FINALIZACIÓN
# =====================================

log_success "¡Deployment completado exitosamente!"
echo ""
log_info "🌟 La Pública está ahora ejecutándose en producción"
echo ""
log_info "📊 URLs importantes:"
echo "  • API: https://api.lapublica.es"
echo "  • Health Check: https://api.lapublica.es/health"
echo "  • Uploads: https://api.lapublica.es/uploads/"
echo ""
log_info "📋 Comandos útiles:"
echo "  • Ver logs: docker-compose -f docker-compose.production.yml logs -f"
echo "  • Estado: docker-compose -f docker-compose.production.yml ps"
echo "  • Detener: docker-compose -f docker-compose.production.yml down"
echo ""
log_info "🔐 Recuerda:"
echo "  • Cambiar la contraseña del administrador (admin@lapublica.es / admin123)"
echo "  • Configurar certificados SSL reales"
echo "  • Configurar backups automáticos"
echo "  • Revisar los logs regularmente"
echo ""
log_success "🚀 ¡Deployment de producción completado!"