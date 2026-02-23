# ADR-001: Stack Tecnológico Inicial

**Fecha:** 2026-02-22
**Estado:** Propuesta
**Autores:** Jose, Claude

## Contexto

Se necesita definir el stack tecnológico para construir una plataforma de generación de portales
web que incluye: editor visual drag-and-drop, sistema de autenticación con roles, gestión de
proyectos/empresas/templates, almacenamiento de medios, y generación de sitios web funcionales.

## Decisiones por Componente

---

### Base de Datos Principal

**Decisión: PostgreSQL**

#### Opciones evaluadas

| Opción         | Pros                                                                                                  | Contras                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **PostgreSQL** | JSONB nativo para estructuras de componentes, maduro, extensible, excelente para relaciones complejas | Requiere más configuración que opciones managed             |
| MongoDB        | Flexible para documentos JSON, esquema dinámico                                                       | Menos consistencia en relaciones, joins limitados           |
| MySQL          | Popular, simple                                                                                       | Menos capacidades JSON que PostgreSQL, menor extensibilidad |

**Razón:** La estructura jerárquica (portal → páginas → secciones → componentes → atributos)
se beneficia de JSONB para la definición de componentes, mientras que las relaciones entre
proyectos, empresas, usuarios y roles se benefician de un modelo relacional robusto.

**Complemento sugerido:** Redis para caché de sesiones de edición en tiempo real.

---

### Frontend de la Plataforma (Editor + Dashboard)

**Decisión: Next.js (React) con App Router**

#### Opciones evaluadas

| Opción              | Pros                                                                                                                                           | Contras                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Next.js (React)** | SSR + client components, App Router con layouts anidados, API routes integradas, ecosistema dnd-kit/Monaco/Vercel AI SDK, middleware para auth | Bundle size puede crecer                                                     |
| Nuxt (Vue)          | Sintaxis limpia, buena DX                                                                                                                      | dnd-kit no disponible para Vue, ecosistema de editores visuales más limitado |
| React SPA (Vite)    | Ligero, rápido en dev                                                                                                                          | Sin SSR, sin API routes, requiere backend separado desde el inicio           |

**Razón:** Next.js ofrece SSR para el dashboard (carga rápida, SEO), client components para
el editor canvas (dnd-kit, estado complejo), API routes para el MVP, y middleware nativo para
proteger rutas por rol. El ecosistema React es el más maduro para editores visuales con IA integrada.

---

### Editor Visual / Canvas

**Decisión: Editor custom con dnd-kit + asistente IA integrado**

#### Opciones evaluadas

| Opción               | Pros                                                                                                              | Contras                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **dnd-kit (custom)** | Control total del estado (JSON), integración natural con IA, React nativo, soporta listas y posicionamiento libre | Más trabajo inicial para construir el editor                                |
| GrapesJS             | Editor completo out-of-the-box                                                                                    | "Caja cerrada", difícil integrar IA profundamente, personalización limitada |
| Craft.js             | React nativo, buen control                                                                                        | Menos features que GrapesJS, comunidad más pequeña                          |
| @hello-pangea/dnd    | Simple para listas/grids                                                                                          | No soporta posicionamiento libre en canvas                                  |

**Razón:** La integración de un asistente de IA directamente en el editor requiere control total
del estado del canvas. Con dnd-kit, el árbol de componentes es un JSON que se comparte entre
el editor visual, el agente de IA, y el motor de generación. GrapesJS sería una barrera para esto.

**Stack del editor:**

- dnd-kit → Drag & drop
- Zustand o Jotai → Estado global del canvas
- Monaco Editor → Editor de código inline (rol Desarrollador)
- Panel IA → Sidebar/modal conectado al agente vía API
- Vercel AI SDK → Streaming de respuestas del agente

---

### Backend / API

**Decisión: NestJS (TypeScript)**

#### Opciones evaluadas

| Opción                  | Pros                                                                                                                                                 | Contras                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **NestJS (TypeScript)** | Mismo lenguaje que frontend, arquitectura modular, Guards RBAC nativos, Prisma ORM, WebSockets integrados, Sharp para imágenes, Astro es Node nativo | Rendimiento raw inferior a Go para generación masiva                                               |
| Go (Fiber/Echo)         | Alto rendimiento, binarios ligeros, tipado fuerte                                                                                                    | Lenguaje diferente al frontend, no comparte tipos, ecosistema web más limitado, Astro no es nativo |
| Híbrido (NestJS + Go)   | Lo mejor de ambos mundos                                                                                                                             | Complejidad operativa, dos lenguajes, prematuro para MVP                                           |

**Razón:** NestJS permite un stack 100% TypeScript compartiendo tipos entre frontend y backend
vía monorepo (Turborepo + @generador/shared). La arquitectura modular mapea directamente a los
dominios del negocio. Astro (generador de portales) y Sharp (procesamiento de imágenes) son
Node.js nativos, eliminando fricción de integración. Si la generación se vuelve cuello de botella,
se puede extraer a un microservicio Go sin afectar el resto.

---

### Motor de Generación de Portales

**Decisión: Astro como target de output, invocado desde NestJS (GeneradorModule)**

El GeneradorModule en NestJS toma el JSON del canvas y produce proyectos Astro funcionales:

1. Recibe JSON del canvas (páginas → secciones → componentes → atributos)
2. Mapea componentes del JSON a componentes .astro
3. Genera páginas con layouts y secciones
4. Integra assets optimizados (imágenes procesadas por Sharp desde MinIO)
5. Ejecuta `astro build` programáticamente
6. Produce output estático (HTML/CSS/JS optimizado)

---

### Procesamiento de Imágenes

**Decisión: Sharp (libvips) integrado en NestJS (MediaModule)**

Sharp es la librería más rápida en Node.js para procesamiento de imágenes (construida sobre
libvips en C). Se encarga de: thumbnails para el editor, conversión a WebP/AVIF, redimensionamiento
responsive, compresión inteligente, y extracción de metadata.

---

### Almacenamiento de Medios

**Decisión: MinIO (S3-compatible)**

MinIO permite control total, es compatible con API S3 (facilitando migración futura), y se
complementa con Sharp para el pipeline completo de procesamiento de imágenes.

---

### Autenticación

**Decisión: NestJS AuthModule con Passport.js + JWT + Guards RBAC**

En lugar de un servicio externo como Keycloak (demasiado pesado para el inicio) o Auth.js
(diseñado para Next.js, no para NestJS), se implementa autenticación directamente en NestJS:

- Passport.js + JWT para tokens
- Guards personalizados para RBAC (verifican rol + empresa del usuario)
- Prisma para almacenar usuarios, roles y permisos en PostgreSQL
- Escalable a Keycloak/SSO en el futuro si se necesita

---

## Arquitectura General Propuesta

```text
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│         Next.js (React) + SSR                    │
│  ┌───────────┐  ┌──────────┐  ┌──────────────┐ │
│  │ Dashboard  │  │ Editor   │  │ Preview      │ │
│  │ + Auth     │  │ (dnd-kit │  │ (Tiempo real)│ │
│  │ + Roles    │  │ +IA Panel│  │              │ │
│  └───────────┘  └──────────┘  └──────────────┘ │
└─────────────────────┬───────────────────────────┘
                      │ API REST / GraphQL
┌─────────────────────┴───────────────────────────┐
│                   BACKEND                        │
│              NestJS (TypeScript)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Auth +   │  │ Proyectos│  │ Generador    │  │
│  │ RBAC     │  │ Templates│  │ de Portales  │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
└───────┬──────────────┬──────────────┬───────────┘
        │              │              │
   ┌────┴────┐   ┌─────┴─────┐  ┌────┴────┐
   │PostgreSQL│   │   MinIO   │  │  Redis  │
   │ (datos)  │   │ (medios)  │  │ (caché/ │
   │          │   │           │  │ sesiones)│
   └──────────┘   └───────────┘  └─────────┘
```text
## Consecuencias

- Stack 100% TypeScript permite compartir tipos entre frontend y backend
- Monorepo con Turborepo para gestionar packages compartidos
- NestJS modular permite escalar o extraer módulos a microservicios cuando sea necesario
- Si la generación de portales se vuelve cuello de botella, GeneradorModule se puede migrar a Go
- La arquitectura permite escalar cada componente de forma independiente

## Próximos Pasos

1. Definir schema JSON de componentes del editor (contrato entre editor, IA, y generador)
2. Definir modelo de datos en PostgreSQL (Prisma schema)
3. Crear POC del editor con dnd-kit + panel IA
4. Implementar AuthModule con RBAC
5. Documentar requisitos funcionales detallados
