# 🏢 La Pública - Arquitectura Multi-Dashboard

## 📊 Dashboards del Sistema

### 1. 👑 **DASHBOARD ADMIN WEB**
**Usuario**: Super Administrador del sistema
**Ruta**: `/admin/dashboard`
**Funcionalidades**:
- ✅ Gestión completa de usuarios (todos los roles)
- ✅ Configuración de agentes IA y asignación de misiones
- ✅ Estadísticas globales del sistema
- ✅ Gestión de planes y facturación
- ✅ Configuración del sistema
- ✅ Logs y auditoría
- ✅ Soporte y tickets

### 2. 🧑‍💼 **DASHBOARD GESTOR DE EMPRESAS**
**Usuario**: Gestor físico de empresas (empleado de La Pública)
**Ruta**: `/gestor/dashboard`
**Funcionalidades**:
- 👥 Gestión de cartera de empresas asignadas
- 📞 CRM - seguimiento de leads y contactos
- 📊 Reportes de rendimiento de empresas
- 🎯 Objetivos y comisiones
- 📅 Calendario de reuniones
- 📈 Análisis de conversión
- 💼 Gestión de propuestas comerciales

### 3. 🏢 **DASHBOARD EMPRESA**
**Usuario**: Empresas privadas
**Ruta**: `/empresa/dashboard`
**Funcionalidades**:
- 🤖 **Chat con Agente IA** (funcionalidad principal)
- 📊 Estadísticas de rendimiento
- 👥 Gestión de ofertas laborales
- 📧 Campañas de email marketing
- 🔍 Análisis competitivo
- 💰 Gestión de plan y facturación
- 📈 Lead scoring y gestión
- 📋 Configuración de agente IA

### 4. 🏛️ **DASHBOARD ADMINISTRACIÓN PÚBLICA**
**Usuario**: Administraciones públicas (ayuntamientos, comunidades, etc.)
**Ruta**: `/administracion/dashboard`
**Funcionalidades**:
- 🤖 **Chat con Agente IA especializado en sector público**
- 📊 Estadísticas de transparencia y eficiencia
- 👥 Gestión de convocatorias y oposiciones
- 📧 Comunicación con empleados públicos
- 🔍 Análisis de necesidades de personal
- 💰 Gestión presupuestaria
- 📈 Métricas de servicio público
- 🏛️ Configuración específica administración

### 5. ✊ **DASHBOARD SINDICATO**
**Usuario**: Organizaciones sindicales
**Ruta**: `/sindicato/dashboard`
**Funcionalidades**:
- 🤖 **Chat con Agente IA enfocado en derechos laborales**
- 👥 Gestión de afiliados
- 📊 Estadísticas de condiciones laborales
- 📧 Comunicación masiva con empleados
- 🔍 Análisis de convenios y salarios
- ⚖️ Gestión de conflictos laborales
- 📈 Métricas de representación
- ✊ Configuración sindical

## 🎨 Diseño UI/UX por Dashboard

### Esquema de Colores por Rol:
- **Admin**: `#dc2626` (Rojo) - Poder total
- **Gestor**: `#2563eb` (Azul) - Profesional
- **Empresa**: `#059669` (Verde) - Negocio
- **Administración**: `#7c3aed` (Púrpura) - Institucional
- **Sindicato**: `#ea580c` (Naranja) - Activismo

### Componentes Compartidos:
- Header con rol específico
- Sidebar personalizado por funcionalidades
- Chat IA integrado (excepto Admin y Gestor)
- Sistema de notificaciones
- Configuración de perfil

## 🛣️ Sistema de Rutas

```typescript
// Rutas protegidas por rol
/admin/*           → Solo ADMIN
/gestor/*          → Solo GESTOR_EMPRESAS  
/empresa/*         → Solo EMPRESA
/administracion/*  → Solo ADMINISTRACION_PUBLICA
/sindicato/*       → Solo SINDICATO
/empleado/*        → Solo EMPLEADO_PUBLICO (perfil básico)
```

## 🔐 Sistema de Autorización

```typescript
type DashboardAccess = {
  ADMIN: ['admin'];
  GESTOR_EMPRESAS: ['gestor'];
  EMPRESA: ['empresa'];
  ADMINISTRACION_PUBLICA: ['administracion'];  
  SINDICATO: ['sindicato'];
  EMPLEADO_PUBLICO: ['empleado']; // Solo perfil, no dashboard
}
```

## 📱 Responsive Design

Todos los dashboards serán:
- ✅ **Mobile-first** responsive
- ✅ **Progressive Web App** (PWA)
- ✅ **Offline capability** básica
- ✅ **Notificaciones push**
- ✅ **Dark/Light mode**

## 🚀 Tecnologías Frontend

- **Framework**: Next.js 14 con App Router
- **UI Library**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand + React Query
- **Charts**: Recharts + Chart.js
- **Real-time**: Socket.io client
- **Forms**: React Hook Form + Zod
- **Auth**: NextAuth.js
- **PWA**: next-pwa

## 📊 Componentes Específicos por Dashboard

### Dashboard Admin:
- UserManagementTable
- AIAgentConfiguration
- SystemMetrics
- BillingOverview
- AuditLogs

### Dashboard Gestor:
- CompanyPortfolio
- LeadPipeline
- SalesMetrics
- MeetingCalendar
- CommissionTracker

### Dashboard Empresa:
- AIChatInterface ⭐
- PerformanceMetrics
- JobOfferManager
- EmailCampaigns
- CompetitiveAnalysis

### Dashboard Administración:
- PublicAIChatInterface ⭐
- TransparencyMetrics
- ConvocatoriaManager
- BudgetTracker
- CitizenEngagement

### Dashboard Sindicato:
- UnionAIChatInterface ⭐
- MembershipStats
- LaborConditionsAnalysis
- ConflictManager
- RepresentationMetrics

## 🔄 Flujo de Navegación

```
Login → Role Detection → Redirect to Specific Dashboard
  ↓
ADMIN → /admin/dashboard
GESTOR → /gestor/dashboard  
EMPRESA → /empresa/dashboard
ADMINISTRACION → /administracion/dashboard
SINDICATO → /sindicato/dashboard
```

## 💡 Características Especiales

### Chat IA Diferenciado:
- **Empresa**: Enfoque comercial y ventas
- **Administración**: Eficiencia y transparencia pública
- **Sindicato**: Derechos laborales y representación

### Métricas Específicas:
- **Empresa**: ROI, conversión, leads
- **Administración**: Eficiencia, transparencia, ciudadanos
- **Sindicato**: Afiliación, conflictos, representación

### Integraciones:
- **Empresa**: CRM, facturación, marketing
- **Administración**: Sistemas públicos, transparencia
- **Sindicato**: Sistemas de afiliación, legal

## 🎯 Prioridad de Desarrollo

1. **🏢 Dashboard Empresa** (MVP - mayor potencial comercial)
2. **👑 Dashboard Admin** (gestión del sistema)
3. **🏛️ Dashboard Administración Pública** (sector público)
4. **🧑‍💼 Dashboard Gestor** (operaciones internas)
5. **✊ Dashboard Sindicato** (completar ecosistema)

Esta arquitectura permite que cada tipo de usuario tenga una experiencia completamente personalizada y optimizada para sus necesidades específicas.