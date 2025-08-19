# 🚀 La Pública - Guía de Configuración Técnica

## 📋 Índice
- [Requisitos Previos](#requisitos-previos)
- [Configuración Rápida](#configuración-rápida)
- [Configuración Manual](#configuración-manual)
- [Variables de Entorno](#variables-de-entorno)
- [API Endpoints](#api-endpoints)
- [Desarrollo](#desarrollo)
- [Producción](#producción)
- [Troubleshooting](#troubleshooting)

## 🔧 Requisitos Previos

### Para Docker (Recomendado)
- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM mínimo
- 10GB espacio libre

### Para Desarrollo Local
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- OpenAI API Key

## ⚡ Configuración Rápida

### 1. Clonar y Configurar
```bash
# Configurar variables de entorno
cp .env.example .env
# ¡IMPORTANTE! Edita .env con tus credenciales reales

# Setup completo automático
make setup
```

### 2. Verificar Instalación
```bash
# Verificar servicios
make status

# Health check
curl http://localhost:3001/api/v1/health

# Ver logs
make logs
```

### 3. Acceso a la Aplicación
- **API**: http://localhost:3001
- **Documentación**: http://localhost:3001/api/docs
- **Prometheus**: http://localhost:9090 (si habilitado)
- **Grafana**: http://localhost:3000 (si habilitado)

## 🔧 Configuración Manual

### Paso 1: Variables de Entorno
```bash
cp .env.example .env
```

**Variables CRÍTICAS que debes cambiar:**
```env
# Seguridad
JWT_SECRET="tu-secreto-super-seguro-y-largo"
JWT_REFRESH_SECRET="otro-secreto-diferente"

# OpenAI (Obligatorio para IA)
OPENAI_API_KEY="sk-tu-clave-openai-aqui"

# Email (Para funcionalidades de email)
SMTP_HOST="smtp.tuproveedor.com"
SMTP_USER="tu-email@dominio.com"
SMTP_PASS="tu-password"
```

### Paso 2: Iniciar Servicios
```bash
# Desarrollo
make dev

# Producción
make build && make start
```

### Paso 3: Base de Datos
```bash
# Migrar esquema
make db-migrate

# Poblar con datos de ejemplo
make db-seed
```

## 🌐 Variables de Entorno Críticas

### 🔐 Seguridad
```env
JWT_SECRET="min-32-caracteres-super-seguros"
JWT_REFRESH_SECRET="otro-secreto-diferente-igual-largo"
BCRYPT_ROUNDS=12
```

### 🤖 OpenAI (Para Agentes IA)
```env
OPENAI_API_KEY="sk-proj-..."
OPENAI_MODEL="gpt-4"
OPENAI_MAX_TOKENS=1000
```

### 📧 Email (Para Marketing Automation)
```env
# Opción 1: SMTP Básico
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-app-password"

# Opción 2: SendGrid (Recomendado)
SENDGRID_API_KEY="SG.tu-api-key-aqui"
```

### 🗄️ Base de Datos
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/lapublica_db"
REDIS_URL="redis://localhost:6379"
```

## 🎯 API Endpoints Principales

### Autenticación
```
POST /api/v1/auth/login      # Login
POST /api/v1/auth/register   # Registro
POST /api/v1/auth/refresh    # Refresh token
```

### Admin Panel
```
GET  /api/v1/admin/users           # Listar usuarios
POST /api/v1/admin/users           # Crear usuario
GET  /api/v1/admin/ai-agents       # Listar agentes IA
POST /api/v1/admin/ai-agents       # Crear agente IA
```

### Chat IA Empresarial
```
POST /api/v1/ai-chat/sessions                    # Iniciar chat
POST /api/v1/ai-chat/sessions/:id/messages       # Enviar mensaje
GET  /api/v1/ai-chat/company-profile             # Ver perfil
POST /api/v1/ai-chat/competitive-analysis/request # Análisis competitivo
```

### Health & Monitoring
```
GET /api/v1/health           # Health check
GET /api/v1/metrics          # Métricas Prometheus
```

## 💻 Desarrollo

### Comandos Útiles
```bash
# Iniciar en modo desarrollo
make dev

# Ver logs en tiempo real
make logs

# Acceder al contenedor
make shell

# Ejecutar tests
make test

# Linting
make lint
```

### Desarrollo Local (Sin Docker)
```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Migrar base de datos
npx prisma migrate dev

# Seed datos
npm run db:seed

# Iniciar servidor
npm run dev
```

## 🚀 Producción

### Configuración Recomendada
```env
NODE_ENV=production
LOG_LEVEL=info
CLUSTER_MODE=true
WORKERS_COUNT=4
```

### Deploy con Docker
```bash
# Build para producción
make build

# Iniciar servicios
make start

# Verificar salud
make health

# Monitoreo
make logs
```

### Backup y Restauración
```bash
# Crear backup
make backup

# Restaurar backup
make restore BACKUP_FILE=./backups/backup_20240101_120000.sql
```

## 📊 Monitoreo

### Activar Stack de Monitoreo
```bash
# Iniciar Prometheus + Grafana
make monitor-start

# Acceder a dashboards
# Grafana: http://localhost:3000 (admin/admin123)
# Prometheus: http://localhost:9090
```

### Métricas Disponibles
- Latencia de API
- Uso de memoria/CPU
- Conexiones de base de datos
- Trabajos en cola
- Métricas de agentes IA

## ❌ Troubleshooting

### Problema: API no responde
```bash
# Verificar logs
make logs-api

# Verificar salud de servicios
make status

# Verificar conectividad BD
make shell-db
```

### Problema: Base de datos no conecta
```bash
# Verificar PostgreSQL
make logs-db

# Verificar variables de entorno
grep DATABASE_URL .env

# Resetear base de datos
make db-reset
```

### Problema: OpenAI API falla
```bash
# Verificar API key
grep OPENAI_API_KEY .env

# Ver logs específicos
make logs-api | grep -i openai
```

### Problema: Email no funciona
```bash
# Verificar configuración SMTP
grep SMTP .env

# Ver logs de email
make logs-api | grep -i email
```

## 🔧 Comandos Make Disponibles

```bash
make help              # Ver todos los comandos
make setup             # Setup completo automático
make dev               # Desarrollo
make build             # Build producción
make start/stop        # Controlar servicios
make logs              # Ver logs
make db-migrate        # Migrar BD
make db-seed           # Poblar BD
make backup            # Backup BD
make clean             # Limpiar contenedores
make test              # Ejecutar tests
make lint              # Linting
make health            # Health check
```

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: `make logs`
2. Verifica variables de entorno en `.env`
3. Confirma que todos los servicios están corriendo: `make status`
4. Consulta esta documentación
5. Revisa los issues en GitHub

## 🎯 Próximos Pasos

Una vez configurado, puedes:
1. **Crear empresas** desde el admin panel
2. **Configurar agentes IA** con diferentes niveles
3. **Probar el chat empresarial** 
4. **Configurar email automation**
5. **Activar scraping competitivo**

¡Listo para revolucionar el sector público español! 🇪🇸