# Git Workflow y CI/CD Pipeline

**Fecha:** 2026-02-22

## Estrategia de Ramas — Trunk-Based con Feature Branches

```
main (producción)
  │
  ├── develop (integración)
  │     │
  │     ├── feature/auth-module        → Funcionalidades nuevas
  │     ├── feature/editor-canvas
  │     ├── feature/api-empresas
  │     │
  │     ├── fix/login-redirect         → Correcciones de bugs
  │     ├── fix/media-upload-error
  │     │
  │     └── chore/update-deps          → Mantenimiento
  │
  └── hotfix/critical-security-fix     → Fixes urgentes directo a main
```

### Convenciones de nombres

| Tipo | Prefijo | Ejemplo |
|------|---------|---------|
| Funcionalidad nueva | `feature/` | `feature/auth-module` |
| Corrección de bug | `fix/` | `fix/login-redirect` |
| Mantenimiento | `chore/` | `chore/update-prisma` |
| Documentación | `docs/` | `docs/api-endpoints` |
| Refactoring | `refactor/` | `refactor/editor-state` |
| Hotfix producción | `hotfix/` | `hotfix/critical-security` |

### Flujo de trabajo

```
1. Crear branch desde develop:
   git checkout develop
   git pull
   git checkout -b feature/mi-feature

2. Desarrollar con commits convencionales:
   git commit -m "feat(auth): add JWT login endpoint"
   git commit -m "fix(editor): resolve drag offset on canvas"
   git commit -m "chore(deps): update prisma to 6.x"

3. Push y crear PR hacia develop:
   git push -u origin feature/mi-feature
   gh pr create --base develop

4. Code review + CI pasa → Merge a develop

5. develop → main: Release cuando develop está estable
   gh pr create --base main --head develop --title "Release v0.1.0"
```

### Commits convencionales

```
Formato: <tipo>(<scope>): <descripción>

Tipos:
  feat     → Nueva funcionalidad
  fix      → Corrección de bug
  docs     → Documentación
  style    → Formato (no afecta lógica)
  refactor → Refactoring
  test     → Tests
  chore    → Mantenimiento
  perf     → Mejora de rendimiento
  ci       → Cambios en CI/CD

Scopes:
  auth, empresas, proyectos, templates, editor, media, ai,
  builds, admin, api, web, shared, docker, prisma, ci

Ejemplos:
  feat(editor): add AI panel with streaming responses
  fix(auth): handle expired refresh token correctly
  chore(docker): update postgres to 16.2
  test(api): add integration tests for empresas endpoints
  docs(api): update endpoint documentation for templates
```

---

## CI/CD Pipeline — GitHub Actions

### Pipeline de PR (en cada push a PR)

```yaml
# .github/workflows/pr-check.yml
name: PR Check

on:
  pull_request:
    branches: [develop, main]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint          # ESLint en todo el monorepo
      - run: pnpm type-check    # TypeScript strict

  test:
    name: Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: generador_test
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter api prisma migrate deploy
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/generador_test
      - run: pnpm test           # Unit tests
      - run: pnpm test:e2e       # Integration tests (API)
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/generador_test
          REDIS_URL: redis://localhost:6379

  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build          # Build todo el monorepo
```

### Pipeline de Deploy (en merge a main)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-push:
    name: Build Docker Images
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push API image
        uses: docker/build-push-action@v5
        with:
          context: ./apps/api
          file: ./apps/api/Dockerfile.prod
          push: true
          tags: ghcr.io/${{ github.repository }}/api:latest

      - name: Build and push Web image
        uses: docker/build-push-action@v5
        with:
          context: ./apps/web
          file: ./apps/web/Dockerfile.prod
          push: true
          tags: ghcr.io/${{ github.repository }}/web:latest

  deploy:
    name: Deploy to Server
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/generador-portales
            docker compose -f docker-compose.prod.yml pull
            docker compose -f docker-compose.prod.yml up -d
            docker image prune -f

  migrate:
    name: Run Migrations
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Prisma migrations
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            docker exec gen_por-api npx prisma migrate deploy
```

### Secrets necesarios en GitHub

| Secret | Descripción |
|--------|-------------|
| `SERVER_HOST` | IP o dominio del servidor de producción |
| `SERVER_USER` | Usuario SSH del servidor |
| `SERVER_SSH_KEY` | Llave SSH privada para conexión |

---

## Protección de Ramas

### Branch `main`
- Requiere PR aprobado (mínimo 1 review)
- Requiere que CI pase (lint + test + build)
- No permite push directo
- No permite force push

### Branch `develop`
- Requiere PR aprobado
- Requiere que CI pase
- No permite push directo

---

## Proceso de Release

```
1. Verificar que develop está estable y CI pasa
2. Crear PR: develop → main con título "Release vX.Y.Z"
3. En la descripción listar cambios desde el último release
4. Review + aprobación
5. Merge → GitHub Actions despliega automáticamente
6. Crear GitHub Release con tag vX.Y.Z
7. Actualizar changelog
```

## Versionado Semántico

```
vMAJOR.MINOR.PATCH

MAJOR → Cambios incompatibles (breaking changes)
MINOR → Nueva funcionalidad compatible
PATCH → Correcciones de bugs

Ejemplo:
  v0.1.0 → MVP: Auth + Dashboard + Editor básico
  v0.2.0 → Templates + Generación Astro
  v0.3.0 → Panel IA + Media management
  v1.0.0 → Primera versión estable de producción
```
