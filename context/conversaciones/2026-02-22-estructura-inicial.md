# Sesión: Estructura Inicial del Proyecto

**Fecha:** 2026-02-22
**Participantes:** Jose, Claude

## Resumen

Se definió la estructura de directorios y tipos de archivos para la base de conocimiento del proyecto "Generador de Portales". El objetivo es que toda la documentación sirva como contexto útil para alimentar el desarrollo con IA y para cualquier desarrollador que se incorpore.

## Decisiones Tomadas

- El proyecto es un **Generador de Portales** web
- Se usará metodología **Ágil (Scrum/Kanban)**
- El formato principal de documentación será **Markdown (.md)**
- Se usarán **ADRs** para documentar decisiones técnicas
- **Frontend: Next.js (React)** con App Router
- **Backend: NestJS (TypeScript)** — arquitectura modular, Guards RBAC, WebSockets
- **Editor: dnd-kit** (custom) con asistente IA integrado en el canvas
- **ORM: Prisma** para PostgreSQL type-safe
- **Base de datos: PostgreSQL** + Redis para caché
- **Almacenamiento medios: MinIO** (S3-compatible) + **Sharp** para procesamiento de imágenes
- **Generador: Astro** invocado programáticamente desde NestJS GeneradorModule
- **Auth: Passport.js + JWT + Guards RBAC** en NestJS (sin Keycloak ni Auth.js)
- **Monorepo: Turborepo** con @generador/shared para tipos compartidos
- **Modelo multi-tenant:** empresa _systemroot_ como raíz global
- **Roles definidos:** Admin (\*systemroot), Desarrollador, Editor — con RBAC
- **IA: Vercel AI SDK** para streaming de respuestas del agente en el editor

## Estructura Creada

- `docs/` — Documentación técnica (producto, arquitectura, API, decisiones, sprints, guías)
- `context/` — Contexto para IA (requisitos, reglas de negocio, research, conversaciones)
- `templates/` — Plantillas reutilizables (historias de usuario, ADRs, sprints, sesiones)
- `assets/` — Recursos visuales (diagramas, mockups)

## Tareas Generadas

- [x] Definir la visión del producto en `docs/producto/vision.md`
- [x] Definir el stack tecnológico en `docs/decisiones/001-stack-tecnologico.md`
- [x] Definir estructura multi-tenant y navegación en `docs/arquitectura/estructura-navegacion.md`
- [x] Decidir backend: NestJS (TypeScript)
- [x] Decidir autenticación: Passport.js + JWT + Guards RBAC en NestJS
- [x] Documentar stack completo en `docs/arquitectura/stack-tecnologico.md`
- [x] Definir infraestructura Docker en `docs/arquitectura/infraestructura-docker.md`
- [x] Crear docker-compose.dev.yml y .env.example en `templates/`
- [x] Definir schema JSON de componentes en `docs/arquitectura/schema-componentes.md`
- [x] Crear wireframes de pantallas en `assets/mockups/wireframes.html`
- [x] Definir modelo de datos Prisma en `docs/arquitectura/schema.prisma`
- [x] Crear diagrama ER en `assets/diagramas/modelo-datos.mermaid`
- [x] Definir MCPs recomendados en `docs/guias/mcp-servers-recomendados.md`
- [x] Crear prompts para Google Stitch en `docs/guias/prompts-stitch.md`
- [x] Definir API REST completa en `docs/api/api-rest-endpoints.md`
- [x] Definir CI/CD y Git workflow en `docs/guias/git-workflow-cicd.md`
- [x] Definir deploy de portales generados en `docs/arquitectura/deploy-portales.md`
- [ ] Generar pantallas en Stitch y traerlas al proyecto vía stitch-mcp
- [ ] Crear POC del editor con dnd-kit + panel IA
- [ ] Planificar Sprint 1 con historias de usuario
- [ ] Inicializar monorepo con Turborepo + Next.js + NestJS + Prisma

## Decisiones de Infraestructura

- **Docker Compose** para orquestar todos los servicios (desarrollo y producción inicial)
- **Fase 1:** Desarrollo local con docker-compose.dev.yml + hot-reload
- **Fase 2:** VPS (Hetzner/DigitalOcean) + Nginx + SSL (~$15-25/mes)
- **Fase 3:** Migración a Kubernetes cuando escale
- Servicios de debug (pgadmin, redis-commander, maildev) bajo profile "debug"
- Red interna Docker para aislar PostgreSQL, Redis, MinIO del exterior

## MCPs Configurados

- **Stitch MCP** — Generar UI desde prompts y traerlas como código React
- **Context7** — Docs actualizados de Next.js, NestJS, Prisma, dnd-kit
- **Sequential Thinking** — Razonamiento para decisiones de arquitectura
- **PostgreSQL MCP** — Interacción directa con la BD
- **GitHub MCP** — Control de versiones
- **Memory MCP** — Memoria persistente entre sesiones

## Contexto para Próxima Sesión

Toda la documentación de diseño está completa: stack, infraestructura, wireframes, modelo de
datos, API REST (10 módulos, ~60 endpoints), CI/CD con GitHub Actions, Git workflow trunk-based,
y estrategia de deploy de portales (MinIO+Nginx → Cloudflare → Enterprise).
Siguiente paso: inicializar el monorepo real, generar pantallas en Stitch, y empezar Sprint 1.
