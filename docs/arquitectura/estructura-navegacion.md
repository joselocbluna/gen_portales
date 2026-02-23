# Estructura de Navegación y Modelo Multi-Tenant

**Fecha:** 2026-02-22
**Estado:** Borrador

## Jerarquía del Sistema

```
*systemroot (empresa raíz — admin global)
├── Templates globales (disponibles para todas las empresas)
├── Gestión de usuarios y roles
│
├── Empresa A
│   ├── Templates de Empresa A
│   ├── Proyecto 1 → Portal web X
│   ├── Proyecto 2 → Portal web Y
│   └── Proyecto N...
│
├── Empresa B
│   ├── Templates de Empresa B
│   ├── Proyecto 1 → Portal web Z
│   └── ...
│
└── Empresa N...
```

## Visibilidad por Rol

| Recurso | Admin (*systemroot) | Desarrollador | Editor |
|---------|:-------------------:|:-------------:|:------:|
| Todas las empresas | ✅ | ❌ | ❌ |
| Mi empresa | — | ✅ | ✅ |
| Proyectos | ✅ (todos) | ✅ (asignados) | ✅ (asignados) |
| Templates globales | ✅ (CRUD) | ✅ (lectura) | ✅ (lectura) |
| Templates empresa | ✅ | ✅ (CRUD) | ✅ (lectura) |
| Editor/Canvas | ✅ | ✅ | ✅ |
| Panel IA en editor | ✅ | ✅ | ✅ |
| Gestión usuarios | ✅ | ❌ | ❌ |

## Estructura de Rutas (Next.js App Router)

```
app/
├── (auth)/                        # Rutas públicas
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── (dashboard)/                   # Rutas protegidas (middleware auth + RBAC)
│   ├── layout.tsx                 # Sidebar + navbar global
│   │
│   ├── empresas/
│   │   ├── page.tsx               # Lista de empresas (*systemroot ve todas)
│   │   └── [empresaId]/
│   │       ├── page.tsx           # Dashboard de empresa
│   │       ├── proyectos/
│   │       │   ├── page.tsx       # Lista de proyectos/portales
│   │       │   └── [proyectoId]/
│   │       │       ├── page.tsx   # Detalle del proyecto
│   │       │       └── editor/
│   │       │           └── page.tsx   # ← EDITOR CANVAS + PANEL IA
│   │       └── templates/
│   │           └── page.tsx       # Templates de la empresa
│   │
│   ├── templates/                 # Templates globales (*systemroot)
│   │   └── page.tsx
│   │
│   └── admin/                     # Solo *systemroot
│       ├── usuarios/page.tsx
│       └── roles/page.tsx
│
├── api/                           # API routes (MVP)
│   ├── auth/
│   ├── empresas/
│   ├── proyectos/
│   ├── templates/
│   ├── media/
│   └── ai/                        # Endpoint del asistente IA
│
└── middleware.ts                   # Auth + RBAC por ruta
```

## Menú de Navegación (Sidebar)

### Admin (*systemroot)
- Inicio (dashboard global)
- Empresas (listado + crear)
- Templates Globales
- Usuarios y Roles
- Configuración

### Desarrollador
- Inicio (dashboard de mi empresa)
- Proyectos (mis proyectos)
- Templates (empresa + globales)
- Mi Perfil

### Editor
- Inicio (dashboard de mi empresa)
- Proyectos (mis proyectos asignados)
- Templates (solo lectura)
- Mi Perfil
