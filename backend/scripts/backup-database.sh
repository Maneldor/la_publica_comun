#!/bin/bash

# =====================================
# SCRIPT DE BACKUP AUTOMÁTICO
# La Pública - Sistema de Mensajería
# =====================================

set -e  # Salir si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
BACKUP_DIR="${BACKUP_DIR:-/app/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
S3_BUCKET="${S3_BUCKET:-}"
POSTGRES_HOST="${POSTGRES_HOST:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-la_publica_prod}"
POSTGRES_USER="${POSTGRES_USER:-la_publica_user}"

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
echo "🗄️  LA PÚBLICA - BACKUP AUTOMÁTICO"
echo "=========================================="
echo -e "${NC}"

# Verificar variables requeridas
if [ -z "$DB_PASSWORD" ]; then
    log_error "Variable DB_PASSWORD no definida"
    exit 1
fi

# Crear directorio de backups
mkdir -p "$BACKUP_DIR"

# Generar nombre del archivo
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="lapublica_backup_${TIMESTAMP}.sql"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

log_info "Iniciando backup de base de datos..."
log_info "Archivo: $BACKUP_FILE"

# Realizar backup de PostgreSQL
export PGPASSWORD="$DB_PASSWORD"

if pg_dump \
    --host="$POSTGRES_HOST" \
    --port=5432 \
    --username="$POSTGRES_USER" \
    --dbname="$POSTGRES_DB" \
    --no-password \
    --verbose \
    --clean \
    --create \
    --if-exists \
    --format=custom \
    --compress=9 \
    --file="$BACKUP_PATH"; then
    
    log_success "Backup completado: $BACKUP_FILE"
    
    # Obtener tamaño del archivo
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    log_info "Tamaño del backup: $BACKUP_SIZE"
    
else
    log_error "Falló el backup de la base de datos"
    exit 1
fi

# Verificar integridad del backup
log_info "Verificando integridad del backup..."

if pg_restore --list "$BACKUP_PATH" > /dev/null 2>&1; then
    log_success "Backup verificado correctamente"
else
    log_error "El backup está corrupto"
    rm -f "$BACKUP_PATH"
    exit 1
fi

# Subir a S3 si está configurado
if [ -n "$S3_BUCKET" ]; then
    log_info "Subiendo backup a S3..."
    
    if command -v aws &> /dev/null; then
        S3_KEY="backups/database/${BACKUP_FILE}"
        
        if aws s3 cp "$BACKUP_PATH" "s3://${S3_BUCKET}/${S3_KEY}" \
           --storage-class STANDARD_IA \
           --metadata "database=${POSTGRES_DB},timestamp=${TIMESTAMP}"; then
            
            log_success "Backup subido a S3: s3://${S3_BUCKET}/${S3_KEY}"
            
            # Opcional: eliminar archivo local después de subir a S3
            if [ "$KEEP_LOCAL_BACKUP" != "true" ]; then
                rm -f "$BACKUP_PATH"
                log_info "Archivo local eliminado (guardado en S3)"
            fi
        else
            log_warning "Falló la subida a S3, manteniendo copia local"
        fi
    else
        log_warning "AWS CLI no instalado, saltando subida a S3"
    fi
fi

# Backup de archivos de uploads
if [ -d "/app/uploads" ] && [ "$(ls -A /app/uploads)" ]; then
    log_info "Creando backup de archivos uploads..."
    
    UPLOADS_BACKUP="${BACKUP_DIR}/uploads_backup_${TIMESTAMP}.tar.gz"
    
    if tar -czf "$UPLOADS_BACKUP" -C /app uploads/; then
        log_success "Backup de uploads completado"
        
        # Subir uploads a S3 si está configurado
        if [ -n "$S3_BUCKET" ] && command -v aws &> /dev/null; then
            S3_UPLOADS_KEY="backups/uploads/uploads_backup_${TIMESTAMP}.tar.gz"
            
            if aws s3 cp "$UPLOADS_BACKUP" "s3://${S3_BUCKET}/${S3_UPLOADS_KEY}"; then
                log_success "Backup de uploads subido a S3"
                
                if [ "$KEEP_LOCAL_BACKUP" != "true" ]; then
                    rm -f "$UPLOADS_BACKUP"
                fi
            fi
        fi
    else
        log_warning "Falló el backup de uploads"
    fi
fi

# Limpiar backups antiguos
log_info "Limpiando backups antiguos (>${RETENTION_DAYS} días)..."

DELETED_COUNT=0
while IFS= read -r -d '' file; do
    if rm "$file"; then
        DELETED_COUNT=$((DELETED_COUNT + 1))
        log_info "Eliminado: $(basename "$file")"
    fi
done < <(find "$BACKUP_DIR" -name "lapublica_backup_*.sql" -type f -mtime +${RETENTION_DAYS} -print0)

while IFS= read -r -d '' file; do
    if rm "$file"; then
        DELETED_COUNT=$((DELETED_COUNT + 1))
        log_info "Eliminado: $(basename "$file")"
    fi
done < <(find "$BACKUP_DIR" -name "uploads_backup_*.tar.gz" -type f -mtime +${RETENTION_DAYS} -print0)

if [ $DELETED_COUNT -gt 0 ]; then
    log_success "Eliminados $DELETED_COUNT backups antiguos"
else
    log_info "No hay backups antiguos para eliminar"
fi

# Limpiar backups antiguos de S3
if [ -n "$S3_BUCKET" ] && command -v aws &> /dev/null; then
    log_info "Limpiando backups antiguos de S3..."
    
    CUTOFF_DATE=$(date -d "${RETENTION_DAYS} days ago" +%Y-%m-%d)
    
    # Listar y eliminar backups antiguos de base de datos
    aws s3api list-objects-v2 \
        --bucket "$S3_BUCKET" \
        --prefix "backups/database/" \
        --query "Contents[?LastModified<='${CUTOFF_DATE}'].Key" \
        --output text | while read -r key; do
        if [ -n "$key" ] && [ "$key" != "None" ]; then
            aws s3 rm "s3://${S3_BUCKET}/${key}"
            log_info "Eliminado de S3: $key"
        fi
    done
    
    # Listar y eliminar backups antiguos de uploads
    aws s3api list-objects-v2 \
        --bucket "$S3_BUCKET" \
        --prefix "backups/uploads/" \
        --query "Contents[?LastModified<='${CUTOFF_DATE}'].Key" \
        --output text | while read -r key; do
        if [ -n "$key" ] && [ "$key" != "None" ]; then
            aws s3 rm "s3://${S3_BUCKET}/${key}"
            log_info "Eliminado de S3: $key"
        fi
    done
fi

# Registrar métricas del backup
if command -v curl &> /dev/null; then
    BACKUP_SIZE_BYTES=$(stat -f%z "$BACKUP_PATH" 2>/dev/null || stat -c%s "$BACKUP_PATH" 2>/dev/null || echo "0")
    
    curl -X POST http://localhost:3001/api/internal/backup-metrics \
         -H "Content-Type: application/json" \
         -d "{
             \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)\",
             \"success\": true,
             \"size\": $BACKUP_SIZE_BYTES,
             \"type\": \"database\",
             \"storage\": \"$([ -n "$S3_BUCKET" ] && echo "s3" || echo "local")\"
         }" \
         --silent --show-error || log_warning "No se pudieron registrar métricas del backup"
fi

# Resumen final
echo ""
log_success "¡Backup completado exitosamente!"
echo ""
log_info "📊 Resumen:"
echo "  • Archivo: $BACKUP_FILE"
echo "  • Tamaño: $BACKUP_SIZE"
echo "  • Ubicación: $([ -n "$S3_BUCKET" ] && echo "S3 + Local" || echo "Local")"
echo "  • Retención: $RETENTION_DAYS días"
echo ""
log_info "📋 Comandos útiles:"
echo "  • Listar backups: ls -la $BACKUP_DIR"
echo "  • Restaurar: pg_restore -h postgres -U $POSTGRES_USER -d $POSTGRES_DB /path/to/backup.sql"
echo "  • Ver contenido: pg_restore --list /path/to/backup.sql"
echo ""

# Opcional: enviar notificación
if [ -n "$WEBHOOK_URL" ]; then
    curl -X POST "$WEBHOOK_URL" \
         -H "Content-Type: application/json" \
         -d "{
             \"text\": \"✅ Backup de La Pública completado: $BACKUP_FILE ($BACKUP_SIZE)\",
             \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)\"
         }" \
         --silent || log_warning "No se pudo enviar notificación"
fi

log_success "🗄️ ¡Proceso de backup finalizado!"