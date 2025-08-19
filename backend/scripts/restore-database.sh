#!/bin/bash

# =====================================
# SCRIPT DE RESTAURACIÓN DE BACKUP
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

# Función de ayuda
show_help() {
    echo "Uso: $0 [OPTIONS] BACKUP_FILE"
    echo ""
    echo "Opciones:"
    echo "  -f, --file BACKUP_FILE    Archivo de backup a restaurar (requerido)"
    echo "  -s, --from-s3             Descargar backup desde S3"
    echo "  -l, --list                Listar backups disponibles"
    echo "  --dry-run                 Mostrar qué se haría sin ejecutar"
    echo "  --force                   Forzar restauración sin confirmación"
    echo "  -h, --help                Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 -f lapublica_backup_20240101_120000.sql"
    echo "  $0 -s -f lapublica_backup_20240101_120000.sql"
    echo "  $0 -l"
}

# Función para listar backups disponibles
list_backups() {
    echo -e "${BLUE}"
    echo "=========================================="
    echo "📋 BACKUPS DISPONIBLES"
    echo "=========================================="
    echo -e "${NC}"
    
    # Backups locales
    if [ -d "$BACKUP_DIR" ]; then
        echo "🗂️  Backups locales:"
        if ls "$BACKUP_DIR"/lapublica_backup_*.sql 1> /dev/null 2>&1; then
            for backup in "$BACKUP_DIR"/lapublica_backup_*.sql; do
                if [ -f "$backup" ]; then
                    filename=$(basename "$backup")
                    size=$(du -h "$backup" | cut -f1)
                    date=$(stat -f%Sm -t"%Y-%m-%d %H:%M:%S" "$backup" 2>/dev/null || stat -c%y "$backup" 2>/dev/null | cut -d. -f1)
                    echo "  • $filename ($size) - $date"
                fi
            done
        else
            echo "  No hay backups locales"
        fi
    else
        echo "  Directorio de backups no existe: $BACKUP_DIR"
    fi
    
    echo ""
    
    # Backups en S3
    if [ -n "$S3_BUCKET" ] && command -v aws &> /dev/null; then
        echo "☁️  Backups en S3:"
        if aws s3 ls "s3://${S3_BUCKET}/backups/database/" --human-readable | grep "lapublica_backup_" | head -10; then
            echo ""
            echo "  (Mostrando últimos 10. Usa 'aws s3 ls s3://${S3_BUCKET}/backups/database/' para ver todos)"
        else
            echo "  No hay backups en S3 o error al acceder"
        fi
    else
        echo "☁️  S3 no configurado o AWS CLI no disponible"
    fi
}

# Función para verificar backup
verify_backup() {
    local backup_file="$1"
    
    log_info "Verificando integridad del backup..."
    
    if ! pg_restore --list "$backup_file" > /dev/null 2>&1; then
        log_error "El archivo de backup está corrupto o no es válido"
        return 1
    fi
    
    # Mostrar información del backup
    log_info "Información del backup:"
    echo "  • Archivo: $(basename "$backup_file")"
    echo "  • Tamaño: $(du -h "$backup_file" | cut -f1)"
    
    # Mostrar tablas incluidas
    local table_count=$(pg_restore --list "$backup_file" | grep -c "TABLE DATA" || echo "0")
    echo "  • Tablas: $table_count"
    
    return 0
}

# Función principal de restauración
restore_backup() {
    local backup_file="$1"
    local dry_run="$2"
    local force="$3"
    
    # Banner
    echo -e "${BLUE}"
    echo "=========================================="
    echo "🔄 LA PÚBLICA - RESTAURACIÓN BACKUP"
    echo "=========================================="
    echo -e "${NC}"
    
    # Verificar que el archivo existe
    if [ ! -f "$backup_file" ]; then
        log_error "Archivo de backup no encontrado: $backup_file"
        return 1
    fi
    
    # Verificar integridad
    if ! verify_backup "$backup_file"; then
        return 1
    fi
    
    # Verificar variables requeridas
    if [ -z "$DB_PASSWORD" ]; then
        log_error "Variable DB_PASSWORD no definida"
        return 1
    fi
    
    # Verificar conectividad de base de datos
    export PGPASSWORD="$DB_PASSWORD"
    
    if ! pg_isready -h "$POSTGRES_HOST" -p 5432 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -q; then
        log_error "No se puede conectar a la base de datos"
        return 1
    fi
    
    # Mostrar advertencia
    echo -e "${YELLOW}"
    echo "⚠️  ADVERTENCIA:"
    echo "   Esta operación reemplazará TODOS los datos existentes"
    echo "   Base de datos: $POSTGRES_DB"
    echo "   Servidor: $POSTGRES_HOST"
    echo "   Backup: $(basename "$backup_file")"
    echo -e "${NC}"
    
    if [ "$dry_run" = "true" ]; then
        log_info "DRY RUN - No se realizarán cambios"
        log_info "Se ejecutaría:"
        echo "  1. Detener conexiones activas"
        echo "  2. Hacer backup de seguridad de datos actuales"
        echo "  3. Restaurar desde: $backup_file"
        echo "  4. Verificar restauración"
        echo "  5. Reiniciar servicios"
        return 0
    fi
    
    # Confirmación del usuario
    if [ "$force" != "true" ]; then
        echo -n "¿Continuar con la restauración? (yes/NO): "
        read -r confirmation
        if [ "$confirmation" != "yes" ]; then
            log_info "Restauración cancelada por el usuario"
            return 0
        fi
    fi
    
    # Crear backup de seguridad de la base actual
    log_info "Creando backup de seguridad de datos actuales..."
    SAFETY_BACKUP="${BACKUP_DIR}/safety_backup_$(date +%Y%m%d_%H%M%S).sql"
    mkdir -p "$BACKUP_DIR"
    
    if pg_dump \
        --host="$POSTGRES_HOST" \
        --port=5432 \
        --username="$POSTGRES_USER" \
        --dbname="$POSTGRES_DB" \
        --no-password \
        --format=custom \
        --compress=9 \
        --file="$SAFETY_BACKUP"; then
        
        log_success "Backup de seguridad creado: $(basename "$SAFETY_BACKUP")"
    else
        log_warning "No se pudo crear backup de seguridad, continuando..."
    fi
    
    # Detener conexiones activas (opcional, requiere privilegios de superusuario)
    log_info "Preparando base de datos para restauración..."
    
    # Restaurar desde backup
    log_info "Iniciando restauración desde backup..."
    log_warning "Este proceso puede tomar varios minutos..."
    
    if pg_restore \
        --host="$POSTGRES_HOST" \
        --port=5432 \
        --username="$POSTGRES_USER" \
        --dbname="$POSTGRES_DB" \
        --no-password \
        --verbose \
        --clean \
        --if-exists \
        --no-owner \
        --no-privileges \
        "$backup_file"; then
        
        log_success "Restauración completada exitosamente"
    else
        log_error "Falló la restauración"
        log_info "Backup de seguridad disponible en: $SAFETY_BACKUP"
        return 1
    fi
    
    # Verificar restauración
    log_info "Verificando restauración..."
    
    local user_count table_count
    user_count=$(psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ')
    table_count=$(psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
    
    if [ -n "$user_count" ] && [ "$user_count" -gt 0 ]; then
        log_success "Verificación exitosa - $user_count usuarios, $table_count tablas"
    else
        log_warning "La verificación no pudo confirmar datos, revisa manualmente"
    fi
    
    # Limpiar backup de seguridad si todo salió bien
    if [ -f "$SAFETY_BACKUP" ] && [ "$user_count" -gt 0 ]; then
        log_info "Limpiando backup de seguridad..."
        rm -f "$SAFETY_BACKUP"
    fi
    
    # Mostrar resumen
    echo ""
    log_success "¡Restauración completada exitosamente!"
    echo ""
    log_info "📊 Resumen:"
    echo "  • Archivo restaurado: $(basename "$backup_file")"
    echo "  • Usuarios: $user_count"
    echo "  • Tablas: $table_count"
    echo ""
    log_info "📋 Próximos pasos:"
    echo "  • Reiniciar servicios de la aplicación"
    echo "  • Verificar funcionalidad de la aplicación"
    echo "  • Revisar logs de la aplicación"
    echo ""
}

# Función para descargar desde S3
download_from_s3() {
    local s3_file="$1"
    local local_file="$BACKUP_DIR/$(basename "$s3_file")"
    
    if [ -z "$S3_BUCKET" ]; then
        log_error "S3_BUCKET no está configurado"
        return 1
    fi
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI no está instalado"
        return 1
    fi
    
    log_info "Descargando desde S3: $s3_file"
    
    mkdir -p "$BACKUP_DIR"
    
    if aws s3 cp "s3://${S3_BUCKET}/backups/database/$s3_file" "$local_file"; then
        log_success "Descargado: $local_file"
        echo "$local_file"
    else
        log_error "Falló la descarga desde S3"
        return 1
    fi
}

# Parsear argumentos
BACKUP_FILE=""
FROM_S3=false
LIST_BACKUPS=false
DRY_RUN=false
FORCE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--file)
            BACKUP_FILE="$2"
            shift 2
            ;;
        -s|--from-s3)
            FROM_S3=true
            shift
            ;;
        -l|--list)
            LIST_BACKUPS=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            if [ -z "$BACKUP_FILE" ]; then
                BACKUP_FILE="$1"
            fi
            shift
            ;;
    esac
done

# Ejecutar según argumentos
if [ "$LIST_BACKUPS" = true ]; then
    list_backups
    exit 0
fi

if [ -z "$BACKUP_FILE" ]; then
    log_error "Archivo de backup requerido"
    echo ""
    show_help
    exit 1
fi

# Descargar desde S3 si es necesario
if [ "$FROM_S3" = true ]; then
    LOCAL_FILE=$(download_from_s3 "$BACKUP_FILE")
    if [ $? -eq 0 ]; then
        BACKUP_FILE="$LOCAL_FILE"
    else
        exit 1
    fi
elif [ ! -f "$BACKUP_FILE" ]; then
    # Intentar buscar en directorio de backups
    if [ -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
        BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
    else
        log_error "Archivo no encontrado: $BACKUP_FILE"
        log_info "Usa -l para listar backups disponibles"
        exit 1
    fi
fi

# Ejecutar restauración
restore_backup "$BACKUP_FILE" "$DRY_RUN" "$FORCE"