# Infraestructura — Docker

**Fecha:** 2026-02-22
**Estado:** Definido

## Estrategia de Contenedores

Todos los servicios del sistema se ejecutan en contenedores Docker, orquestados con
Docker Compose para desarrollo y con posibilidad de migrar a Kubernetes en producción.

### Convivencia con otros proyectos Docker

Para evitar conflictos con otros proyectos en Docker Desktop:

1. **Puertos configurables vía `.env`:** Todos los puertos del HOST se definen como variables
   de entorno con valores por defecto en el rango 4xxx/5xxx, evitando chocar con los puertos
   estándar (3000, 3001, 5432, 9000, 6379) que pueda usar otro proyecto.
2. **Container names con prefijo `gen_por-`:** Todos los contenedores llevan prefijo `gen_por-` para
   identificarlos fácilmente en Docker Desktop (gen_por-web, gen_por-api, gen_por-postgres, etc.)
3. **Volúmenes con prefijo `gen_por-`:** Los volúmenes usan prefijo `gen_por-` para no mezclarse con
   volúmenes de otros proyectos (gen_por-pgdata, gen_por-redis-data, gen_por-minio-data).
4. **Red con nombre único:** La red Docker se llama `generador-portales-net` para no interferir.
5. **Puertos internos inmutables:** Los contenedores siempre usan sus puertos estándar
   internamente. Solo cambia el mapeo al HOST, lo cual se controla desde `.env`.

## Servicios

| Servicio | Container | Imagen | Puerto HOST (default) | Puerto Interno | Propósito |
|----------|-----------|--------|:---------------------:|:--------------:|-----------|
| web | gen_por-web | Node 20 Alpine + Next.js | 4000 | 3000 | Frontend |
| api | gen_por-api | Node 20 Alpine + NestJS | 4001 | 3001 | Backend API + WebSockets |
| postgres | gen_por-postgres | PostgreSQL 16 Alpine | 5433 | 5432 | Base de datos principal |
| redis | gen_por-redis | Redis 7 Alpine | 6380 | 6379 | Caché, sesiones |
| minio | gen_por-minio | MinIO latest | 9002, 9003 | 9000, 9001 | Almacenamiento medios |

### Servicios opcionales (desarrollo)

| Servicio | Imagen | Puerto | Propósito |
|----------|--------|--------|-----------|
| maildev | maildev/maildev | 1080 | Testing de emails en desarrollo |
| pgadmin | dpage/pgadmin4 | 5050 | UI para administrar PostgreSQL |
| redis-commander | rediscommander | 8081 | UI para inspeccionar Redis |

## Entornos

### Desarrollo (docker-compose.dev.yml)

- Hot-reload para web y api (volúmenes montados al código fuente)
- Puertos expuestos al host para debugging
- Variables de entorno en `.env.development`
- Volúmenes persistentes para datos de PostgreSQL, MinIO y Redis
- Servicios de debugging (pgadmin, redis-commander, maildev)

### Producción (docker-compose.prod.yml)

- Builds multi-stage optimizados (imagen final mínima)
- Red interna Docker (solo web y api expuestos)
- Health checks en todos los servicios
- Restart policies (unless-stopped)
- Variables de entorno en `.env.production` (secretos vía Docker secrets)
- Logs centralizados
- Sin servicios de debugging

## Arquitectura de Red

```
                    ┌─────────────┐
                    │   Nginx /   │
                    │   Traefik   │  ← Reverse proxy + SSL
                    │   (Puerto   │
                    │   80/443)   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────┴─────┐ ┌───┴───┐ ┌─────┴─────┐
        │    web     │ │  api  │ │   minio   │
        │  Next.js   │ │NestJS │ │  Console  │
        │   :3000    │ │ :3001 │ │   :9001   │
        └─────┬─────┘ └───┬───┘ └─────┬─────┘
              │            │           │
              │     ┌──────┴──────┐    │
              │     │  Red interna │    │
              │     │   Docker     │    │
              │     └──────┬──────┘    │
              │            │           │
        ┌─────┼────────────┼───────────┼─────┐
        │     │            │           │     │
   ┌────┴──┐ │ ┌──────────┴┐  ┌──────┴──┐  │
   │ Redis │ │ │ PostgreSQL │  │  MinIO  │  │
   │ :6379 │ │ │   :5432   │  │  :9000  │  │
   └───────┘ │ └───────────┘  └─────────┘  │
             │     Red interna              │
             └──────────────────────────────┘
```

En producción, solo el reverse proxy (Nginx o Traefik) está expuesto al exterior.
PostgreSQL, Redis, y MinIO API solo son accesibles desde la red interna de Docker.

## Volúmenes Persistentes

| Volumen | Servicio | Propósito |
|---------|----------|-----------|
| pgdata | postgres | Datos de PostgreSQL |
| minio-data | minio | Archivos almacenados (imágenes, videos) |
| redis-data | redis | Persistencia de caché (opcional) |

## Roadmap de Infraestructura

### Fase 1 — Desarrollo local

- Docker Compose con todos los servicios
- Hot-reload, debugging tools
- Un solo comando: `docker compose -f docker-compose.dev.yml up`

### Fase 2 — Staging/Producción inicial

- VPS (Hetzner/DigitalOcean) con Docker Compose
- Nginx como reverse proxy + Let's Encrypt SSL
- Backups automáticos de PostgreSQL y MinIO
- Costo estimado: $15-25/mes

### Fase 3 — Escalamiento

- Migración a Kubernetes (DigitalOcean K8s o AWS EKS)
- PostgreSQL managed (RDS o equivalente)
- Auto-scaling de api y web
- CI/CD con GitHub Actions + Container Registry
