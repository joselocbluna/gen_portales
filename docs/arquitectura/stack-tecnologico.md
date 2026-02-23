# Stack Tecnológico — Generador de Portales

**Fecha:** 2026-02-22
**Estado:** Definido

## Resumen del Stack

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| Frontend | Next.js (App Router) | Dashboard, editor, preview |
| Editor | dnd-kit + Zustand + Monaco | Canvas visual + drag-and-drop |
| Backend/API | NestJS (TypeScript) | API gateway, RBAC, lógica de negocio |
| ORM | Prisma | Acceso type-safe a PostgreSQL |
| Base de datos | PostgreSQL | Persistencia principal |
| Caché | Redis | Sesiones, estado del editor, caché |
| Almacenamiento | MinIO (S3-compatible) | Imágenes, videos, assets |
| Procesamiento imágenes | Sharp (libvips) | Thumbnails, optimización, WebP/AVIF |
| Generador de portales | Astro (invocado desde NestJS) | Output final de sitios web |
| IA | Vercel AI SDK | Asistente en el editor |
| Monorepo | Turborepo | Gestión de packages compartidos |
| Tipos compartidos | @generador/shared | Schema JSON, tipos de dominio |

## Tres Motores del Sistema

### Motor 1 — API Gateway (NestJS)

Responsable de toda la lógica de negocio, autenticación, y comunicación.

**Módulos:**
- AuthModule → Login, registro, JWT, Guards RBAC
- EmpresasModule → CRUD empresas, *systemroot
- ProyectosModule → CRUD proyectos asociados a empresas
- TemplatesModule → Templates globales y por empresa
- MediaModule → Upload/descarga de medios vía MinIO
- AIModule → Endpoint para el asistente IA del editor
- WebSocket Gateway → Comunicación en tiempo real para el editor

**Tecnologías clave:**
- Prisma ORM para PostgreSQL (type-safe, migraciones)
- Passport.js + JWT para autenticación
- Guards personalizados para RBAC por rol y por empresa
- Socket.io para WebSockets

### Motor 2 — Generador de Código Astro (GeneradorModule)

Toma el JSON del canvas (estado del editor) y produce un proyecto Astro funcional.

**Flujo:**
1. Recibe el JSON del canvas (páginas, secciones, componentes, atributos)
2. Mapea cada componente del JSON a un componente Astro (.astro)
3. Genera las páginas con sus layouts y secciones
4. Copia los assets optimizados (imágenes desde MinIO, ya procesadas por Sharp)
5. Ejecuta `astro build` programáticamente
6. Produce el output estático (HTML/CSS/JS optimizado)
7. Almacena el build para deploy o descarga

**Por qué Astro:**
- Genera sitios estáticos ultrarrápidos
- Modelo de "islas" para interactividad selectiva
- Optimización de imágenes integrada
- Soporte para componentes de múltiples frameworks
- Es Node.js nativo, integración directa con NestJS

### Motor 3 — Procesador de Imágenes (MediaModule)

Gestiona todo el ciclo de vida de medios del sistema.

**Flujo:**
1. Usuario sube imagen desde el editor → API recibe el archivo
2. Sharp procesa: genera thumbnail, versión optimizada, WebP, AVIF
3. Se almacenan todas las versiones en MinIO con nomenclatura consistente
4. Se registra en PostgreSQL la metadata (dimensiones, formato, peso, URLs)
5. El editor muestra el thumbnail; el generador usa la versión optimizada

**Procesamiento con Sharp:**
- Redimensionamiento responsive (múltiples tamaños)
- Conversión a WebP y AVIF (formatos modernos)
- Compresión inteligente
- Generación de thumbnails para el editor
- Extracción de metadata (dimensiones, color dominante)

## Estructura del Monorepo

```
generador-portales/
├── packages/
│   └── shared/                  # Tipos TypeScript compartidos
│       ├── types/
│       │   ├── canvas.ts        # Schema JSON de componentes del editor
│       │   ├── empresa.ts       # Tipos de empresa/proyecto/template
│       │   ├── auth.ts          # Tipos de roles/permisos
│       │   └── media.ts         # Tipos de medios/assets
│       └── package.json
│
├── apps/
│   ├── web/                     # Next.js (frontend)
│   │   ├── app/                 # App Router
│   │   ├── components/          # Componentes React
│   │   │   ├── editor/          # Editor canvas (dnd-kit)
│   │   │   ├── dashboard/       # Vistas del dashboard
│   │   │   └── ai-panel/        # Panel del asistente IA
│   │   └── ...
│   │
│   └── api/                     # NestJS (backend)
│       ├── src/
│       │   ├── auth/            # AuthModule + Guards RBAC
│       │   ├── empresas/        # EmpresasModule
│       │   ├── proyectos/       # ProyectosModule
│       │   ├── templates/       # TemplatesModule
│       │   ├── generador/       # GeneradorModule (Motor Astro)
│       │   ├── media/           # MediaModule (Sharp + MinIO)
│       │   ├── ai/              # AIModule (agente IA)
│       │   ├── websocket/       # WebSocket Gateway
│       │   └── prisma/          # PrismaModule + schema.prisma
│       └── ...
│
├── turbo.json                   # Turborepo config
├── pnpm-workspace.yaml
└── package.json
```

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│              Next.js (App Router)                    │
│  ┌───────────┐  ┌───────────┐  ┌────────────────┐  │
│  │ Dashboard  │  │  Editor   │  │   Preview      │  │
│  │ Empresas   │  │  dnd-kit  │  │   (iframe)     │  │
│  │ Proyectos  │  │  + Panel  │  │   Tiempo real  │  │
│  │ Templates  │  │    IA     │  │                │  │
│  └───────────┘  └───────────┘  └────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │ REST + WebSockets
┌──────────────────────┴──────────────────────────────┐
│                 BACKEND — NestJS                     │
│                                                      │
│  ┌────────────┐  ┌────────────┐  ┌───────────────┐  │
│  │ AuthModule │  │ Empresas   │  │ Proyectos     │  │
│  │ + Guards   │  │ Module     │  │ Module        │  │
│  │ (RBAC)     │  │            │  │               │  │
│  └────────────┘  └────────────┘  └───────────────┘  │
│                                                      │
│  ┌────────────┐  ┌────────────┐  ┌───────────────┐  │
│  │ Templates  │  │ Generador  │  │ Media         │  │
│  │ Module     │  │ Module     │  │ Module        │  │
│  │            │  │ (Astro)    │  │ (Sharp+MinIO) │  │
│  └────────────┘  └────────────┘  └───────────────┘  │
│                                                      │
│  ┌────────────┐  ┌────────────────────────────────┐  │
│  │ AI Module  │  │ WebSocket Gateway              │  │
│  │ (Agente)   │  │ (Editor tiempo real)           │  │
│  └────────────┘  └────────────────────────────────┘  │
│                                                      │
│  Prisma ORM ─── Tipos compartidos (@generador/shared)│
└──────┬──────────────┬──────────────┬────────────────┘
       │              │              │
  ┌────┴────┐   ┌─────┴─────┐  ┌────┴────┐
  │PostgreSQL│   │   MinIO   │  │  Redis  │
  │ (Prisma) │   │ (medios)  │  │ (caché/ │
  │          │   │           │  │ sesiones)│
  └──────────┘   └───────────┘  └─────────┘
```
