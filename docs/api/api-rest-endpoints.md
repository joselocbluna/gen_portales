# API REST — Endpoints del Sistema

**Fecha:** 2026-02-22
**Base URL:** `http://localhost:4001/api/v1`
**Autenticación:** Bearer JWT en header `Authorization`
**Formato:** JSON

## Convenciones

- Método + Recurso en plural: `GET /empresas`, `POST /proyectos`
- IDs en la ruta para recursos específicos: `GET /empresas/:id`
- Query params para filtros y paginación: `?page=1&limit=20&status=PUBLISHED`
- Respuestas envueltas en formato estándar (ver sección Formato de Respuesta)
- Códigos HTTP semánticos: 200, 201, 204, 400, 401, 403, 404, 409, 422, 500

## Formato de Respuesta Estándar

```json
// Éxito (un recurso)
{
  "success": true,
  "data": { ... }
}

// Éxito (lista paginada)
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 47,
    "totalPages": 3
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo email es requerido",
    "details": [ ... ]
  }
}
```

## Códigos de Error

| Código | Nombre | Uso |
|--------|--------|-----|
| `AUTH_INVALID_CREDENTIALS` | Credenciales inválidas | Login fallido |
| `AUTH_TOKEN_EXPIRED` | Token expirado | JWT vencido |
| `AUTH_FORBIDDEN` | Sin permisos | Rol insuficiente para la acción |
| `RESOURCE_NOT_FOUND` | Recurso no encontrado | ID no existe |
| `RESOURCE_ALREADY_EXISTS` | Recurso duplicado | Slug/email duplicado |
| `VALIDATION_ERROR` | Error de validación | Campos inválidos |
| `COMPANY_ACCESS_DENIED` | Acceso a empresa denegado | Usuario no pertenece a la empresa |
| `BUILD_FAILED` | Error en generación | Falló el build de Astro |
| `MEDIA_UPLOAD_FAILED` | Error al subir archivo | Fallo en MinIO |

---

## 1. AUTH — Autenticación

```
POST   /auth/login              → Iniciar sesión
POST   /auth/register           → Registrar usuario (solo admin)
POST   /auth/refresh            → Renovar token JWT
POST   /auth/logout             → Cerrar sesión (invalidar refresh token)
POST   /auth/forgot-password    → Solicitar reset de contraseña
POST   /auth/reset-password     → Resetear contraseña con token
GET    /auth/me                 → Obtener perfil del usuario actual
PUT    /auth/me                 → Actualizar perfil propio
PUT    /auth/me/password        → Cambiar contraseña propia
```

### POST /auth/login
```json
// Request
{ "email": "jose@empresa.com", "password": "..." }

// Response 200
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "expiresIn": 86400,
    "user": {
      "id": "usr_abc123",
      "email": "jose@empresa.com",
      "firstName": "Jose",
      "lastName": "Luna",
      "avatar": null,
      "companies": [
        {
          "companyId": "com_xyz789",
          "companyName": "Empresa Alpha",
          "companySlug": "empresa-alpha",
          "role": "developer",
          "roleDisplayName": "Desarrollador"
        }
      ]
    }
  }
}
```

### GET /auth/me
```
Headers: Authorization: Bearer <accessToken>

// Response 200
{
  "success": true,
  "data": {
    "id": "usr_abc123",
    "email": "jose@empresa.com",
    "firstName": "Jose",
    "lastName": "Luna",
    "avatar": "https://minio:9002/avatars/usr_abc123.webp",
    "isActive": true,
    "companies": [
      {
        "companyId": "com_xyz789",
        "companyName": "Empresa Alpha",
        "role": "developer",
        "permissions": { "projects.create": true, "templates.edit": true, ... }
      }
    ],
    "createdAt": "2026-01-15T10:00:00Z"
  }
}
```

---

## 2. EMPRESAS — Gestión de Empresas

```
GET    /empresas                 → Listar empresas (admin: todas, user: las suyas)
POST   /empresas                 → Crear empresa (solo admin)
GET    /empresas/:id             → Obtener empresa por ID
PUT    /empresas/:id             → Actualizar empresa
DELETE /empresas/:id             → Desactivar empresa (soft delete)
GET    /empresas/:id/stats       → Estadísticas de la empresa
GET    /empresas/:id/usuarios    → Listar usuarios de la empresa
POST   /empresas/:id/usuarios    → Agregar usuario a la empresa
PUT    /empresas/:id/usuarios/:userId → Cambiar rol de usuario en empresa
DELETE /empresas/:id/usuarios/:userId → Remover usuario de la empresa
```

### GET /empresas
```
Query params:
  ?page=1&limit=20&search=alpha&isActive=true

// Response 200 (admin ve todas)
{
  "success": true,
  "data": [
    {
      "id": "com_xyz789",
      "name": "Empresa Alpha",
      "slug": "empresa-alpha",
      "logo": "https://minio:9002/logos/com_xyz789.webp",
      "isRoot": false,
      "isActive": true,
      "stats": {
        "projectsCount": 8,
        "templatesCount": 3,
        "usersCount": 12
      },
      "createdAt": "2026-01-10T08:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 12, "totalPages": 1 }
}
```

### POST /empresas
```json
// Request (solo admin *systemroot)
{
  "name": "Empresa Nueva",
  "slug": "empresa-nueva",
  "description": "Descripción de la empresa"
}

// Response 201
{
  "success": true,
  "data": { "id": "com_new123", "name": "Empresa Nueva", ... }
}
```

---

## 3. PROYECTOS — Gestión de Proyectos (Portales)

```
GET    /empresas/:empresaId/proyectos              → Listar proyectos de empresa
POST   /empresas/:empresaId/proyectos              → Crear proyecto
GET    /empresas/:empresaId/proyectos/:id           → Obtener proyecto
PUT    /empresas/:empresaId/proyectos/:id           → Actualizar proyecto
DELETE /empresas/:empresaId/proyectos/:id           → Archivar proyecto
GET    /empresas/:empresaId/proyectos/:id/stats     → Estadísticas del proyecto

POST   /empresas/:empresaId/proyectos/:id/duplicate → Duplicar proyecto
PUT    /empresas/:empresaId/proyectos/:id/publish   → Publicar proyecto
PUT    /empresas/:empresaId/proyectos/:id/unpublish → Despublicar proyecto

GET    /empresas/:empresaId/proyectos/:id/usuarios  → Usuarios asignados
POST   /empresas/:empresaId/proyectos/:id/usuarios  → Asignar usuario
DELETE /empresas/:empresaId/proyectos/:id/usuarios/:userId → Desasignar
```

### POST /empresas/:empresaId/proyectos
```json
// Request
{
  "name": "Portal Corporativo",
  "slug": "portal-corporativo",
  "description": "Portal principal de la empresa",
  "templateId": "tpl_abc123"  // Opcional: crear desde template
}

// Response 201
{
  "success": true,
  "data": {
    "id": "prj_def456",
    "name": "Portal Corporativo",
    "slug": "portal-corporativo",
    "status": "DRAFT",
    "companyId": "com_xyz789",
    "templateId": "tpl_abc123",
    "pagesCount": 4,
    "createdAt": "2026-02-22T14:00:00Z"
  }
}
```

---

## 4. PÁGINAS — Contenido del Portal (Editor)

```
GET    /proyectos/:proyectoId/paginas              → Listar páginas del proyecto
POST   /proyectos/:proyectoId/paginas              → Crear página
GET    /proyectos/:proyectoId/paginas/:id           → Obtener página con contenido
PUT    /proyectos/:proyectoId/paginas/:id           → Actualizar página (guardar canvas)
DELETE /proyectos/:proyectoId/paginas/:id           → Eliminar página
PUT    /proyectos/:proyectoId/paginas/:id/order     → Reordenar página
POST   /proyectos/:proyectoId/paginas/:id/duplicate → Duplicar página

GET    /proyectos/:proyectoId/paginas/:id/versions  → Historial de versiones
GET    /proyectos/:proyectoId/paginas/:id/versions/:v → Obtener versión específica
POST   /proyectos/:proyectoId/paginas/:id/versions/:v/restore → Restaurar versión
```

### GET /proyectos/:proyectoId/paginas/:id
```json
// Response 200 — Contenido completo para el editor
{
  "success": true,
  "data": {
    "id": "pag_ghi789",
    "projectId": "prj_def456",
    "name": "Home",
    "slug": "/",
    "title": "Portal Alpha - Inicio",
    "description": "Bienvenido al portal de Empresa Alpha",
    "layout": "default",
    "isHomepage": true,
    "isPublished": true,
    "showInNav": true,
    "order": 0,
    "content": {
      "sections": [
        {
          "id": "sec-header",
          "name": "Header",
          "type": "header",
          "columns": 1,
          "components": [ ... ],
          "styles": { ... },
          "responsive": { ... }
        }
      ]
    },
    "updatedAt": "2026-02-22T16:30:00Z"
  }
}
```

### PUT /proyectos/:proyectoId/paginas/:id
```json
// Request — El editor envía esto al guardar
{
  "name": "Home",
  "title": "Portal Alpha - Inicio",
  "content": {
    "sections": [ ... ]  // Estado completo del canvas (JSON)
  },
  "versionComment": "Agregada sección de testimonios"
}

// Response 200
{
  "success": true,
  "data": { "id": "pag_ghi789", "version": 5, ... }
}
```

---

## 5. TEMPLATES

```
GET    /templates                          → Listar templates (globales + empresa)
POST   /templates                          → Crear template
GET    /templates/:id                       → Obtener template
PUT    /templates/:id                       → Actualizar template
DELETE /templates/:id                       → Desactivar template
POST   /templates/:id/duplicate             → Duplicar template
GET    /templates/:id/preview               → Preview del template
```

### GET /templates
```
Query params:
  ?scope=GLOBAL|COMPANY&category=landing&search=corporativo&page=1&limit=20

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "tpl_abc123",
      "name": "Corporativo Pro",
      "slug": "corporativo-pro",
      "description": "Portal corporativo completo",
      "thumbnail": "https://minio:9002/thumbnails/tpl_abc123.webp",
      "category": "corporativo",
      "tags": ["responsive", "moderno", "12-paginas"],
      "scope": "GLOBAL",
      "companyId": null,
      "pagesCount": 12,
      "createdAt": "2026-01-05T10:00:00Z"
    }
  ],
  "meta": { ... }
}
```

---

## 6. MEDIA — Archivos y Medios

```
GET    /media                              → Listar archivos (filtro por empresa/proyecto)
POST   /media/upload                        → Subir archivo(s)
GET    /media/:id                           → Obtener metadata del archivo
DELETE /media/:id                           → Eliminar archivo
GET    /media/:id/url                       → Obtener URL firmada (temporal)
POST   /media/upload-multiple               → Subir múltiples archivos
```

### POST /media/upload
```
Content-Type: multipart/form-data

Fields:
  file: [binary]
  companyId: "com_xyz789"
  projectId: "prj_def456"   (opcional)
  alt: "Logo de la empresa"  (opcional)

// Response 201
{
  "success": true,
  "data": {
    "id": "med_jkl012",
    "filename": "logo-alpha.png",
    "mimeType": "image/png",
    "size": 45230,
    "width": 800,
    "height": 400,
    "storagePath": "empresas/com_xyz789/media/logo-alpha.png",
    "variants": {
      "original": "https://minio:9002/.../original.png",
      "thumbnail": "https://minio:9002/.../thumb_200x200.webp",
      "webp": "https://minio:9002/.../optimized.webp",
      "avif": "https://minio:9002/.../optimized.avif"
    },
    "createdAt": "2026-02-22T17:00:00Z"
  }
}
```

---

## 7. BUILDS — Generación de Portales

```
POST   /proyectos/:proyectoId/builds        → Iniciar generación (build Astro)
GET    /proyectos/:proyectoId/builds         → Listar builds del proyecto
GET    /proyectos/:proyectoId/builds/:id     → Estado/detalle de un build
GET    /proyectos/:proyectoId/builds/:id/log → Log del build
GET    /proyectos/:proyectoId/builds/:id/download → Descargar build (zip)
```

### POST /proyectos/:proyectoId/builds
```json
// Request
{ "comment": "Build para revisión del cliente" }

// Response 202 (Accepted — proceso asíncrono)
{
  "success": true,
  "data": {
    "id": "bld_mno345",
    "projectId": "prj_def456",
    "version": 3,
    "status": "PENDING",
    "createdAt": "2026-02-22T18:00:00Z"
  }
}
```

El build se ejecuta de forma asíncrona. El frontend puede hacer polling
o escuchar por WebSocket para actualizaciones de estado:

```
WebSocket: ws://localhost:4001/builds/:buildId/status

Eventos:
  { "status": "BUILDING", "step": "Generando componentes Astro...", "progress": 30 }
  { "status": "BUILDING", "step": "Optimizando imágenes...", "progress": 60 }
  { "status": "BUILDING", "step": "Ejecutando astro build...", "progress": 85 }
  { "status": "SUCCESS", "outputUrl": "https://...", "duration": 12400 }
  // o
  { "status": "FAILED", "error": "...", "duration": 5200 }
```

---

## 8. AI — Asistente de Inteligencia Artificial

```
POST   /ai/chat                             → Enviar mensaje al asistente (streaming)
POST   /ai/generate-section                 → Generar sección desde descripción
POST   /ai/suggest-content                  → Sugerir contenido para un componente
POST   /ai/improve-styles                   → Sugerir mejoras de estilos
```

### POST /ai/chat (Streaming via SSE)
```json
// Request
{
  "projectId": "prj_def456",
  "pageId": "pag_ghi789",
  "message": "Agrega una sección de testimonios con 3 cards debajo del hero",
  "context": {
    "currentPage": { "sections": [ ... ] },
    "selectedSection": "sec-hero",
    "portalSettings": { "colorPalette": { ... } }
  }
}

// Response: Server-Sent Events (streaming)
// Content-Type: text/event-stream

data: {"type":"thinking","content":"Analizando la estructura actual..."}
data: {"type":"text","content":"Voy a crear una sección de testimonios con 3 tarjetas..."}
data: {"type":"section","content":{"id":"sec-testimonials","type":"testimonials","components":[...]}}
data: {"type":"done","message":"✓ Sección agregada al canvas"}
```

### POST /ai/generate-section
```json
// Request
{
  "description": "Sección de precios con 3 planes: básico, pro y enterprise",
  "portalSettings": { "colorPalette": { ... }, "fonts": [ ... ] }
}

// Response 200
{
  "success": true,
  "data": {
    "section": {
      "id": "sec-generated-001",
      "type": "custom",
      "name": "Planes de Precios",
      "columns": 3,
      "components": [ ... ]
    }
  }
}
```

---

## 9. ADMIN — Administración (solo *systemroot)

```
GET    /admin/usuarios                     → Listar todos los usuarios del sistema
POST   /admin/usuarios/invite              → Invitar usuario
PUT    /admin/usuarios/:id                 → Editar usuario
PUT    /admin/usuarios/:id/activate        → Activar usuario
PUT    /admin/usuarios/:id/deactivate      → Desactivar usuario

GET    /admin/roles                        → Listar roles
POST   /admin/roles                        → Crear rol
PUT    /admin/roles/:id                    → Editar rol y permisos
DELETE /admin/roles/:id                    → Eliminar rol (si no es system)

GET    /admin/audit-log                    → Log de auditoría
GET    /admin/dashboard                    → Stats globales del sistema
```

---

## 10. WebSocket Events — Editor en Tiempo Real

```
Namespace: /editor

Conexión: ws://localhost:4001/editor?projectId=X&pageId=Y&token=JWT

Eventos Client → Server:
  join-page          → Unirse a la edición de una página
  leave-page         → Salir de la edición
  update-section     → Actualizar una sección
  add-component      → Agregar componente
  remove-component   → Eliminar componente
  move-component     → Mover componente (drag & drop)
  update-styles      → Actualizar estilos de un componente
  cursor-position    → Posición del cursor (colaboración futura)

Eventos Server → Client:
  page-updated       → Otro usuario actualizó la página
  component-added    → Otro usuario agregó un componente
  component-removed  → Otro usuario eliminó un componente
  user-joined        → Otro usuario entró al editor
  user-left          → Otro usuario salió del editor
  save-confirmed     → Guardado confirmado
  error              → Error en la operación
```

---

## Middleware y Guards

```
Todas las rutas (excepto /auth/login, /auth/register, /auth/forgot-password):
  → JwtAuthGuard (verifica token válido)

Rutas con :empresaId:
  → CompanyAccessGuard (verifica que el usuario pertenece a la empresa)

Rutas con :proyectoId:
  → ProjectAccessGuard (verifica que el usuario tiene acceso al proyecto)

Rutas /admin/*:
  → RolesGuard(['admin']) (solo usuarios con rol admin en *systemroot)

Rutas POST/PUT/DELETE:
  → AuditInterceptor (registra la acción en audit_logs)
```
