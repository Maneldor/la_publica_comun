#!/bin/bash

# =====================================
# SCRIPT DE VERIFICACIÓN DE BACKUPS
# La Pública - Sistema de Mensajería
# =====================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuración
BACKUP_DIR="${BACKUP_DIR:-/app/backups}"
S3_BUCKET="${S3_BUCKET:-}"
MAX_AGE_HOURS="${MAX_AGE_HOURS:-25}"  # Máximo 25 horas sin backup

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
echo "🔍 LA PÚBLICA - VERIFICACIÓN BACKUPS"
echo "=========================================="
echo -e "${NC}"

ERRORS=0
WARNINGS=0

# Verificar que existe el directorio de backups
if [ ! -d "$BACKUP_DIR" ]; then
    log_error "Directorio de backups no existe: $BACKUP_DIR"
    ERRORS=$((ERRORS + 1))
    exit 1
fi

# Verificar backups locales
log_info "Verificando backups locales..."

BACKUP_COUNT=0
LATEST_BACKUP=""
LATEST_BACKUP_TIME=0

if ls "$BACKUP_DIR"/lapublica_backup_*.sql 1> /dev/null 2>&1; then
    for backup in "$BACKUP_DIR"/lapublica_backup_*.sql; do
        if [ -f "$backup" ]; then
            BACKUP_COUNT=$((BACKUP_COUNT + 1))
            
            # Obtener tiempo de modificación
            if [[ "$OSTYPE" == "darwin"* ]]; then
                BACKUP_TIME=$(stat -f%m "$backup")
            else
                BACKUP_TIME=$(stat -c%Y "$backup")
            fi
            
            if [ $BACKUP_TIME -gt $LATEST_BACKUP_TIME ]; then
                LATEST_BACKUP_TIME=$BACKUP_TIME
                LATEST_BACKUP="$backup"
            fi
            
            # Verificar integridad
            if pg_restore --list "$backup" > /dev/null 2>&1; then
                log_success "✓ $(basename "$backup") - Íntegro"
            else
                log_error "✗ $(basename "$backup") - Corrupto"
                ERRORS=$((ERRORS + 1))
            fi
        fi
    done
else
    log_error "No se encontraron backups locales"
    ERRORS=$((ERRORS + 1))
fi

log_info "Backups locales encontrados: $BACKUP_COUNT"

# Verificar antigüedad del último backup
if [ -n "$LATEST_BACKUP" ]; then
    CURRENT_TIME=$(date +%s)
    AGE_SECONDS=$((CURRENT_TIME - LATEST_BACKUP_TIME))
    AGE_HOURS=$((AGE_SECONDS / 3600))
    
    log_info "Último backup: $(basename "$LATEST_BACKUP") (hace $AGE_HOURS horas)"
    
    if [ $AGE_HOURS -gt $MAX_AGE_HOURS ]; then
        log_error "Último backup es muy antiguo (>$MAX_AGE_HOURS horas)"
        ERRORS=$((ERRORS + 1))
    elif [ $AGE_HOURS -gt 24 ]; then
        log_warning "Último backup tiene más de 24 horas"
        WARNINGS=$((WARNINGS + 1))
    else
        log_success "Último backup es reciente"
    fi
fi

# Verificar espacio en disco
log_info "Verificando espacio en disco..."

if command -v df &> /dev/null; then
    DISK_USAGE=$(df "$BACKUP_DIR" | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ "$DISK_USAGE" -gt 90 ]; then
        log_error "Disco casi lleno: ${DISK_USAGE}%"
        ERRORS=$((ERRORS + 1))
    elif [ "$DISK_USAGE" -gt 80 ]; then
        log_warning "Espacio en disco bajo: ${DISK_USAGE}%"
        WARNINGS=$((WARNINGS + 1))
    else
        log_success "Espacio en disco OK: ${DISK_USAGE}%"
    fi
fi

# Verificar backups en S3
if [ -n "$S3_BUCKET" ] && command -v aws &> /dev/null; then
    log_info "Verificando backups en S3..."
    
    S3_COUNT=0
    if aws s3 ls "s3://${S3_BUCKET}/backups/database/" | grep "lapublica_backup_"; then
        S3_COUNT=$(aws s3 ls "s3://${S3_BUCKET}/backups/database/" | grep -c "lapublica_backup_" || echo "0")
        log_info "Backups en S3: $S3_COUNT"
        
        # Verificar backup reciente en S3
        LATEST_S3=$(aws s3 ls "s3://${S3_BUCKET}/backups/database/" | grep "lapublica_backup_" | sort | tail -1)
        if [ -n "$LATEST_S3" ]; then
            log_success "Último backup en S3: $(echo "$LATEST_S3" | awk '{print $4}')"
        else
            log_warning "No se pudo determinar el último backup en S3"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        log_error "No se encontraron backups en S3"
        ERRORS=$((ERRORS + 1))
    fi
else
    log_info "S3 no configurado o AWS CLI no disponible"
fi

# Verificar conectividad de base de datos
log_info "Verificando conectividad de base de datos..."

if [ -n "$DB_PASSWORD" ]; then
    export PGPASSWORD="$DB_PASSWORD"
    
    if pg_isready -h "${POSTGRES_HOST:-postgres}" -p 5432 -U "${POSTGRES_USER:-la_publica_user}" -d "${POSTGRES_DB:-la_publica_prod}" -q; then
        log_success "Base de datos accesible"
        
        # Obtener estadísticas básicas
        USER_COUNT=$(psql -h "${POSTGRES_HOST:-postgres}" -U "${POSTGRES_USER:-la_publica_user}" -d "${POSTGRES_DB:-la_publica_prod}" -t -c "SELECT COUNT(*) FROM \"User\";" 2>/dev/null | tr -d ' ')
        MESSAGE_COUNT=$(psql -h "${POSTGRES_HOST:-postgres}" -U "${POSTGRES_USER:-la_publica_user}" -d "${POSTGRES_DB:-la_publica_prod}" -t -c "SELECT COUNT(*) FROM \"Message\";" 2>/dev/null | tr -d ' ')
        
        if [ -n "$USER_COUNT" ] && [ "$USER_COUNT" -gt 0 ]; then
            log_info "Datos en la base: $USER_COUNT usuarios, $MESSAGE_COUNT mensajes"
        else
            log_warning "No se pudieron obtener estadísticas de la base de datos"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        log_error "No se puede conectar a la base de datos"
        ERRORS=$((ERRORS + 1))
    fi
else
    log_warning "DB_PASSWORD no definida, saltando verificación de BD"
    WARNINGS=$((WARNINGS + 1))
fi

# Verificar proceso de backup automático
log_info "Verificando configuración de cron..."

if crontab -l 2>/dev/null | grep -q "backup-database.sh"; then
    log_success "Cron job configurado para backups"
else
    log_warning "No se encontró cron job para backups automáticos"
    WARNINGS=$((WARNINGS + 1))
fi

# Verificar logs de backup
log_info "Verificando logs de backup..."

LOG_FILES=(
    "/app/logs/backup.log"
    "/app/logs/backup-incremental.log"
    "$BACKUP_DIR/../logs/backup.log"
)

FOUND_LOGS=false
for log_file in "${LOG_FILES[@]}"; do
    if [ -f "$log_file" ]; then
        FOUND_LOGS=true
        
        # Verificar errores recientes en logs
        if tail -100 "$log_file" | grep -q "ERROR\|FAILED\|failed"; then
            log_warning "Errores encontrados en $log_file"
            WARNINGS=$((WARNINGS + 1))
        else
            log_success "Log de backup sin errores: $log_file"
        fi
        break
    fi
done

if [ "$FOUND_LOGS" = false ]; then
    log_warning "No se encontraron logs de backup"
    WARNINGS=$((WARNINGS + 1))
fi

# Simulación de restauración (opcional)
if [ "$VERIFY_RESTORE" = "true" ] && [ -n "$LATEST_BACKUP" ]; then
    log_info "Realizando prueba de restauración..."
    
    # Crear base de datos temporal para prueba
    TEST_DB="la_publica_test_$(date +%s)"
    
    if createdb -h "${POSTGRES_HOST:-postgres}" -U "${POSTGRES_USER:-la_publica_user}" "$TEST_DB" 2>/dev/null; then
        if pg_restore -h "${POSTGRES_HOST:-postgres}" -U "${POSTGRES_USER:-la_publica_user}" -d "$TEST_DB" --no-owner --no-privileges "$LATEST_BACKUP" > /dev/null 2>&1; then
            log_success "Prueba de restauración exitosa"
            
            # Verificar datos restaurados
            TEST_USERS=$(psql -h "${POSTGRES_HOST:-postgres}" -U "${POSTGRES_USER:-la_publica_user}" -d "$TEST_DB" -t -c "SELECT COUNT(*) FROM \"User\";" 2>/dev/null | tr -d ' ')
            if [ -n "$TEST_USERS" ] && [ "$TEST_USERS" -gt 0 ]; then
                log_success "Datos restaurados correctamente: $TEST_USERS usuarios"
            else
                log_warning "La restauración no contiene datos esperados"
                WARNINGS=$((WARNINGS + 1))
            fi
        else
            log_error "Falló la prueba de restauración"
            ERRORS=$((ERRORS + 1))
        fi
        
        # Limpiar base de datos de prueba
        dropdb -h "${POSTGRES_HOST:-postgres}" -U "${POSTGRES_USER:-la_publica_user}" "$TEST_DB" 2>/dev/null || true
    else
        log_warning "No se pudo crear base de datos de prueba"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

# Resumen final
echo ""
echo "=========================================="
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "=========================================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    log_success "✅ Todos los backups están correctos"
    STATUS="OK"
elif [ $ERRORS -eq 0 ]; then
    log_warning "⚠️  Verificación completada con $WARNINGS advertencias"
    STATUS="WARNING"
else
    log_error "❌ Verificación falló con $ERRORS errores y $WARNINGS advertencias"
    STATUS="ERROR"
fi

echo ""
log_info "Estado: $STATUS"
log_info "Errores: $ERRORS"
log_info "Advertencias: $WARNINGS"
log_info "Backups locales: $BACKUP_COUNT"
if [ -n "$S3_BUCKET" ]; then
    log_info "Backups en S3: $S3_COUNT"
fi

# Registrar resultado en métricas
if command -v curl &> /dev/null; then
    curl -X POST http://localhost:3001/api/internal/backup-verification \
         -H "Content-Type: application/json" \
         -d "{
             \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)\",
             \"status\": \"$STATUS\",
             \"errors\": $ERRORS,
             \"warnings\": $WARNINGS,
             \"localBackups\": $BACKUP_COUNT,
             \"s3Backups\": ${S3_COUNT:-0}
         }" \
         --silent --show-error || log_warning "No se pudieron registrar métricas"
fi

# Notificación si hay errores críticos
if [ $ERRORS -gt 0 ] && [ -n "$WEBHOOK_URL" ]; then
    curl -X POST "$WEBHOOK_URL" \
         -H "Content-Type: application/json" \
         -d "{
             \"text\": \"🚨 Verificación de backups La Pública: $ERRORS errores críticos\",
             \"status\": \"$STATUS\",
             \"errors\": $ERRORS,
             \"warnings\": $WARNINGS
         }" \
         --silent || log_warning "No se pudo enviar notificación"
fi

# Código de salida según resultado
if [ $ERRORS -gt 0 ]; then
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    exit 2
else
    exit 0
fi