# La Pública - Backend API

Backend para La Pública, una plataforma SaaS que conecta empresas con empleados del sector público español.

## 🚀 Características

- **Autenticación JWT** completa con refresh tokens
- **Base de datos PostgreSQL** con Prisma ORM
- **Cache Redis** para optimización
- **Rate limiting** y seguridad
- **Documentación Swagger** automática
- **Sistema de roles** (Admin, Empresa, Empleado)
- **Analytics avanzado**
- **Sistema de mensajería**
- **IA básica** para scoring y recomendaciones

## 📋 Requisitos Previos

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- npm o yarn

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. **Configurar base de datos:**
```bash
# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Ejecutar seeds (datos de ejemplo)
npm run db:seed
```

4. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

## 📚 Documentación API

Una vez iniciado el servidor, la documentación estará disponible en:
- **Swagger UI:** http://localhost:5000/api-docs
- **Endpoint base:** http://localhost:5000/api/v1

## 🔐 Credenciales de Desarrollo

Después de ejecutar los seeds, podrás usar estas credenciales:

- **Admin:** admin@lapublica.es / admin123456
- **Empresa:** empresa@ejemplo.es / company123456  
- **Empleado:** empleado@generalitat.cat / employee123456

## 🏗️ Estructura del Proyecto

```
src/
├── config/           # Configuración (BD, Redis, constantes)
├── middleware/       # Middlewares (auth, rate limiting, errores)
├── modules/          # Módulos principales
│   ├── auth/         # Autenticación y autorización
│   ├── users/        # Gestión de usuarios
│   ├── companies/    # Gestión de empresas
│   ├── employees/    # Base de datos empleados públicos
│   ├── analytics/    # Sistema de analytics
│   ├── messaging/    # Sistema de mensajería
│   ├── content/      # Gestión de contenido
│   └── ai/           # Funcionalidades de IA
├── routes/           # Definición de rutas
├── types/            # Tipos TypeScript
├── utils/            # Utilidades (logger, errores, validación)
└── services/         # Servicios compartidos
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor con hot reload
npm run build        # Compilar TypeScript
npm run start        # Servidor producción

# Base de datos
npm run db:migrate   # Ejecutar migraciones
npm run db:generate  # Generar cliente Prisma
npm run db:seed      # Ejecutar seeds
npm run db:studio    # Prisma Studio (GUI)

# Calidad de código
npm run lint         # ESLint
npm run lint:fix     # ESLint con corrección automática
npm run test         # Ejecutar tests
```

## 🌐 Endpoints Principales

### Autenticación
- `POST /api/v1/auth/register` - Registro de usuarios
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh-token` - Renovar token
- `GET /api/v1/auth/profile` - Perfil usuario

### Empresas (próximamente)
- `GET /api/v1/companies` - Listar empresas
- `POST /api/v1/companies` - Crear empresa
- `PUT /api/v1/companies/:id` - Actualizar empresa

### Empleados Públicos (próximamente)
- `GET /api/v1/employees` - Buscar empleados
- `GET /api/v1/employees/stats` - Estadísticas
- `POST /api/v1/employees/export` - Exportar datos

### Analytics (próximamente)
- `GET /api/v1/analytics/dashboard` - Dashboard principal
- `GET /api/v1/analytics/reports` - Reportes
- `POST /api/v1/analytics/events` - Registrar eventos

## 🔒 Seguridad

- **JWT tokens** con expiración y refresh
- **Bcrypt** para hash de contraseñas
- **Helmet** para headers de seguridad
- **CORS** configurado
- **Rate limiting** por IP
- **Validación robusta** con Joi
- **Sanitización** de inputs

## 📊 Base de Datos

### Modelos Principales

- **User:** Usuarios del sistema
- **Company:** Perfiles de empresas
- **Employee:** Empleados públicos
- **Post:** Contenido y ofertas
- **Campaign:** Campañas de email
- **Analytics:** Eventos y métricas
- **Lead:** Leads y conversiones

### Relaciones

- Usuario puede ser Empresa o Empleado
- Empresas crean Posts y Campañas
- Analytics trackea todo tipo de eventos
- Leads conectan Empresas con Empleados

## 🚀 Deployment

### Variables de Entorno Requeridas

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
# ... ver .env.example para la lista completa
```

### Docker (próximamente)

```bash
docker build -t la-publica-backend .
docker run -p 5000:5000 la-publica-backend
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📈 Monitoreo

- **Winston** para logging estructurado
- **Health check** endpoint: `/api/v1/health`
- **Métricas** de API en tiempo real
- **Error tracking** automático

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📝 TODO / Roadmap

- [ ] Completar módulos de empresas y empleados
- [ ] Sistema de templates de email
- [ ] Integración con OpenAI para IA
- [ ] Sistema de notificaciones en tiempo real
- [ ] Tests unitarios y de integración
- [ ] Dockerización
- [ ] CI/CD pipeline
- [ ] Monitoring y alertas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para dudas o problemas:
- Crear un issue en GitHub
- Email: soporte@lapublica.es
- Documentación: http://localhost:5000/api-docs