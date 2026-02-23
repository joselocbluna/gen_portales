---
description: Flujo de trabajo para desarrollo multi-agente en Generador de Portales
---

# Flujo de Desarrollo Multi-Agente: Generador de Portales

Este flujo está diseñado para aprovechar la arquitectura del monorepo (Turborepo + Next.js + NestJS + Astro) utilizando múltiples agentes en paralelo ("Manager View" de Antigravity).

## Fase 1: Base de Datos y API Core (Agente Backend)

Este agente se enfoca exclusivamente en la lógica de negocio y persistencia.

1. Navega a `apps/api` y `packages/shared`.
2. Lee `docs/arquitectura/schema.prisma` y `docs/arquitectura/stack-tecnologico.md`.
3. Modifica los schemas de Prisma, controladores y servicios de NestJS asegurando el soporte Multi-tenant.
4. Exporta las interfaces y tipos actualizados a `packages/shared`.

## Fase 2: Motor Generador de Portales (Agente Astro)

Este agente trabaja en el aislamiento de la transformación de JSON a archivos estáticos.

1. Navega a `apps/api/src/generador`.
2. Lee `docs/arquitectura/schema-componentes.md` para entender el contrato.
3. Transforma el modelo JSON interactivo a archivos estáticos `.astro`.
4. Ejecuta pruebas programáticas simulando la compilación con Vercel/Cloudflare hooks.

## Fase 3: Editor Visual de Portales (Agente Frontend)

Este agente construye la UI interactiva e integra librerías externas.

1. Navega a `apps/web`.
2. Lee `docs/arquitectura/schema-componentes.md` y `docs/arquitectura/estructura-navegacion.md`.
3. Usar el MCP **Stitch** para prototipar rápidamente componentes y extraer el código React.
4. Integrar `dnd-kit` y Zustand para el editor visual del Canvas interactivo.

## Reglas Globales (A aplicar a todos los agentes)

- Si hay dudas sobre la arquitectura, consultar los documentos en `docs/arquitectura/` y `docs/decisiones/`.
- Cualquier tipo de datos o contrato debe ir en `packages/shared` para que todos los agentes lo utilicen (Backend, Frontend, Generador).
- Cada agente debe trabajar en una rama (`branch`) separada bajo Git o coordinar fuertemente a través de un canal si editan los mismos paquetes.
