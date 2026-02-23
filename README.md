# Generador de Portales — Base de Conocimiento

Este repositorio contiene la documentación y contexto del proyecto **Generador de Portales**.
Está diseñado para que cualquier agente de IA o desarrollador pueda entender el proyecto
rápidamente y contribuir con contexto completo.

---

## Estructura de Directorios

```text
generadorportales/
├── docs/                    # Documentación técnica y de producto
│   ├── producto/            # Visión, roadmap, historias de usuario
│   ├── arquitectura/        # Decisiones de arquitectura, diagramas de sistema
│   ├── api/                 # Contratos de API, endpoints, schemas
│   ├── decisiones/          # ADRs (Architecture Decision Records)
│   ├── sprints/             # Planificación y retrospectivas por sprint
│   └── guias/               # Guías de contribución, estilo de código, setup
│
├── context/                 # Contexto para alimentar desarrollo con IA
│   ├── requisitos/          # Requisitos funcionales y no funcionales
│   ├── reglas-negocio/      # Reglas de negocio y lógica de dominio
│   ├── research/            # Investigación, benchmarks, análisis de competencia
│   └── conversaciones/      # Resúmenes de sesiones de trabajo con IA
│
├── templates/               # Plantillas reutilizables para documentos
└── assets/                  # Recursos visuales
    ├── diagramas/           # Diagramas técnicos (Mermaid, draw.io, SVG)
    └── mockups/             # Wireframes y diseños de UI
```text
---

## Guía de Uso por Directorio

### `docs/producto/`

**Qué guardar:** Visión del producto, roadmap, épicas, historias de usuario, criterios de aceptación.
**Formato recomendado:** Markdown (.md)
**Ejemplo de archivos:** `vision.md`, `roadmap.md`, `epica-01-generacion-sitios.md`

### `docs/arquitectura/`

**Qué guardar:** Diagramas de arquitectura, stack tecnológico, patrones de diseño elegidos, modelo de datos.
**Formato recomendado:** Markdown (.md) + diagramas Mermaid (.mermaid) o SVG
**Ejemplo de archivos:** `stack-tecnologico.md`, `modelo-datos.md`, `diagrama-sistema.mermaid`

### `docs/api/`

**Qué guardar:** Definiciones de API (REST/GraphQL), schemas, contratos entre servicios.
**Formato recomendado:** Markdown (.md), OpenAPI/Swagger (.yaml), JSON Schema (.json)
**Ejemplo de archivos:** `api-portales.md`, `openapi.yaml`, `schemas/portal.json`

### `docs/decisiones/`

**Qué guardar:** ADRs — cada decisión técnica importante con contexto, opciones evaluadas y resultado.
**Formato recomendado:** Markdown (.md) numerados secuencialmente
**Ejemplo de archivos:** `001-framework-frontend.md`, `002-base-de-datos.md`

### `docs/sprints/`

**Qué guardar:** Objetivos del sprint, tareas completadas, retrospectivas, velocidad del equipo.
**Formato recomendado:** Markdown (.md)
**Ejemplo de archivos:** `sprint-01-planning.md`, `sprint-01-retro.md`

### `docs/guias/`

**Qué guardar:** Setup del proyecto, convenciones de código, flujo de Git, guía de contribución.
**Formato recomendado:** Markdown (.md)
**Ejemplo de archivos:** `setup-local.md`, `convenciones-codigo.md`, `git-workflow.md`

### `context/requisitos/`

**Qué guardar:** Requisitos funcionales (RF) y no funcionales (RNF) del sistema.
**Formato recomendado:** Markdown (.md)
**Ejemplo de archivos:** `rf-generacion-portales.md`, `rnf-rendimiento.md`

### `context/reglas-negocio/`

**Qué guardar:** Lógica de dominio, validaciones, flujos de negocio, glosario de términos.
**Formato recomendado:** Markdown (.md)
**Ejemplo de archivos:** `reglas-plantillas.md`, `flujo-publicacion.md`, `glosario.md`

### `context/research/`

**Qué guardar:** Investigación de mercado, análisis de competidores, benchmarks técnicos, pruebas de concepto.
**Formato recomendado:** Markdown (.md)
**Ejemplo de archivos:** `competidores-generadores-web.md`, `benchmark-rendimiento-ssr.md`

### `context/conversaciones/`

**Qué guardar:** Resúmenes de sesiones de trabajo con IA (como esta), decisiones tomadas, ideas discutidas.
**Formato recomendado:** Markdown (.md) con fecha en el nombre
**Ejemplo de archivos:** `2026-02-22-estructura-inicial.md`, `2026-02-23-definicion-stack.md`

### `templates/`

**Qué guardar:** Plantillas para crear nuevos documentos rápidamente.
**Formato recomendado:** Markdown (.md)

### `assets/diagramas/` y `assets/mockups/`

**Qué guardar:** Recursos visuales del proyecto.
**Formato recomendado:** SVG, PNG, Mermaid (.mermaid), Figma exports

---

## Formatos Recomendados y Por Qué

| Formato           | Uso                         | Razón                                                        |
| ----------------- | --------------------------- | ------------------------------------------------------------ |
| `.md` (Markdown)  | Documentación general       | Universal, versionable con Git, legible por humanos y por IA |
| `.mermaid`        | Diagramas                   | Renderizable, versionable, editable como texto               |
| `.yaml` / `.json` | Schemas, configs, API specs | Estructurado, parseable por código y por IA                  |
| `.svg`            | Diagramas exportados        | Escalable, ligero, versionable                               |
| `.png`            | Mockups, capturas           | Visual, fácil de compartir                                   |

---

## Convención de Nombres

- Usar **kebab-case** para archivos: `mi-documento.md`
- Prefijo numérico para secuencias: `001-primera-decision.md`
- Prefijo de fecha para sesiones: `2026-02-22-tema.md`
- Nombres descriptivos y en español

---

## Cómo Usar Este Repositorio con IA

Para obtener el mejor contexto al trabajar con un agente de IA:

1. **Antes de una sesión:** Asegúrate de que `docs/producto/vision.md` y `context/reglas-negocio/` estén actualizados
2. **Durante la sesión:** Referencia archivos específicos para dar contexto preciso
3. **Después de la sesión:** Guarda un resumen en `context/conversaciones/` con la fecha
4. **Para decisiones:** Crea un ADR en `docs/decisiones/` cada vez que se tome una decisión técnica importante
