# MCP Servers Recomendados — Generador de Portales

**Fecha:** 2026-02-22

## Para Claude Code

### Esenciales para el proyecto

```jsonc
// ~/.claude.json o .mcp.json del proyecto
{
  "mcpServers": {

    // 1. Google Stitch — Generación de UI con IA
    // Conecta Stitch para traer diseños generados al código
    "stitch": {
      "command": "npx",
      "args": ["@_davideast/stitch-mcp", "proxy"]
    },

    // 2. Context7 — Documentación actualizada de librerías
    // Obtiene docs en tiempo real de Next.js, React, NestJS, Prisma, dnd-kit, etc.
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp"]
    },

    // 3. Sequential Thinking — Razonamiento estructurado
    // Para decisiones de arquitectura y debugging complejo
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@anthropic/sequential-thinking-mcp"]
    },

    // 4. PostgreSQL MCP — Interacción directa con la BD
    // Consultas, migraciones, inspección del schema en lenguaje natural
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic/postgres-mcp"],
      "env": {
        "DATABASE_URL": "postgresql://generador:generador_dev@localhost:5433/generador_portales"
      }
    },

    // 5. GitHub MCP — Control de versiones
    // PRs, issues, CI/CD sin salir del terminal
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/github-mcp"],
      "env": {
        "GITHUB_TOKEN": "tu-github-token"
      }
    },

    // 6. Memory MCP — Memoria persistente entre sesiones
    // Recuerda decisiones de arquitectura, convenciones, contexto del proyecto
    "memory": {
      "command": "npx",
      "args": ["-y", "@anthropic/memory-mcp"]
    }
  }
}
```

### Opcionales pero útiles

```jsonc
{
  "mcpServers": {

    // 7. Figma MCP — Si usas Figma para diseños
    // Extrae estructura de componentes directamente del diseño
    "figma": {
      "command": "npx",
      "args": ["-y", "@anthropic/figma-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "tu-figma-token"
      }
    },

    // 8. Task Master — Gestión de tareas desde PRDs
    // Convierte documentos de requisitos en tareas estructuradas
    "task-master": {
      "command": "npx",
      "args": ["-y", "task-master-ai"]
    },

    // 9. Docker MCP — Gestión de contenedores
    // Controla Docker desde Claude Code
    "docker": {
      "command": "npx",
      "args": ["-y", "@anthropic/docker-mcp"]
    }
  }
}
```

## Para Google Antigravity

### Configuración de MCPs en Antigravity

En Antigravity, los MCPs se configuran desde:
**Agent Session → "..." dropdown → MCP Servers → MCP Store**

Para configuración manual: **Manage MCP Servers → View raw config**

### MCPs recomendados para Antigravity

| MCP | Propósito | Prioridad |
|-----|-----------|-----------|
| **Google Stitch** | Generación de UI → código en el proyecto | Esencial |
| **Context7** | Documentación actualizada de frameworks | Esencial |
| **Sequential Thinking** | Razonamiento para arquitectura | Recomendado |
| **MCP Toolbox for Databases** | Conexión a PostgreSQL (nativo Google Cloud) | Esencial |
| **Composio Rube MCP** | Multi-tool integration sin configuración manual | Opcional |
| **Qdrant MCP** | Guardar y recuperar código funcional | Opcional |

### Ventaja de Antigravity: Manager View

Antigravity permite despachar múltiples agentes simultáneamente. Para este proyecto
podrías tener:

- Agente 1: Trabajando en el frontend (Next.js)
- Agente 2: Trabajando en el backend (NestJS)
- Agente 3: Trabajando en el schema de Prisma
- Agente 4: Generando componentes desde Stitch
- Agente 5: Ejecutando tests

## Setup de Stitch MCP

### Instalación

```bash
# 1. Ejecutar el wizard de inicialización
npx @_davideast/stitch-mcp init

# El wizard configura:
# - Selección de cliente MCP (Claude Code / Antigravity)
# - Instalación de gcloud
# - OAuth login
# - Credenciales de aplicación
# - Selección de proyecto GCP
# - Permisos IAM
# - Habilitación de la API de Stitch
# - Test de conexión
# - Generación de config
```

### Autenticación alternativa (API Key)

```bash
# Si prefieres usar API Key en vez de OAuth
export STITCH_API_KEY=tu-api-key-de-stitch
```

### Herramientas disponibles del proxy

| Herramienta | Descripción |
|-------------|-------------|
| `build_site` | Construye un sitio desde un proyecto mapeando screens a rutas |
| `get_screen_code` | Obtiene el HTML/CSS de una pantalla específica |
| `get_screen_image` | Obtiene screenshot de una pantalla como base64 |

### Troubleshooting

```bash
# Si hay problemas de autenticación
npx @_davideast/stitch-mcp logout --force
npx @_davideast/stitch-mcp init
```
