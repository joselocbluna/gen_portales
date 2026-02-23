# Deploy de Portales Generados

**Fecha:** 2026-02-22

## El Problema

Cuando un usuario hace clic en "Publicar" en el editor, el sistema necesita:

1. Tomar el JSON del canvas de todas las páginas
2. Generar un proyecto Astro funcional
3. Ejecutar `astro build` para producir HTML/CSS/JS estático
4. Desplegarlo en algún lugar accesible públicamente
5. Asignarle un dominio o subdominio

## Flujo Completo de Publicación

```text
  Usuario hace clic en "Publicar"
          │
          ▼
  ┌──────────────────────────┐
  │  1. API recibe request   │
  │  POST /builds            │
  └──────────┬───────────────┘
             │
             ▼
  ┌──────────────────────────┐
  │  2. GeneradorModule      │
  │  Lee JSON de todas las   │
  │  páginas del proyecto    │
  │  desde PostgreSQL        │
  └──────────┬───────────────┘
             │
             ▼
  ┌──────────────────────────┐
  │  3. Generación Astro     │
  │  - Crea directorio temp  │
  │  - Genera archivos .astro│
  │  - Copia assets de MinIO │
  │  - Ejecuta astro build   │
  └──────────┬───────────────┘
             │
             ▼
  ┌──────────────────────────┐
  │  4. Output estático      │
  │  /dist con HTML/CSS/JS   │
  │  optimizado              │
  └──────────┬───────────────┘
             │
             ▼
  ┌──────────────────────────┐
  │  5. Deploy del build     │
  │  Subir a hosting/CDN     │
  └──────────┬───────────────┘
             │
             ▼
  ┌──────────────────────────┐
  │  6. Asignar dominio      │
  │  Actualizar DNS/proxy    │
  └──────────────────────────┘
```

## Opciones de Hosting para Portales Generados

### Opción A: MinIO + Nginx (Self-hosted) — Recomendada para empezar

Los builds estáticos se suben a un bucket de MinIO y Nginx los sirve
como sitios estáticos. Es la opción más simple y económica.

```text
Estructura en MinIO:
  portales/
  ├── empresa-alpha/
  │   ├── portal-corporativo/
  │   │   ├── index.html
  │   │   ├── nosotros/index.html
  │   │   ├── servicios/index.html
  │   │   ├── _astro/
  │   │   │   ├── styles.abc123.css
  │   │   │   └── scripts.def456.js
  │   │   └── assets/
  │   │       ├── logo.webp
  │   │       └── hero.avif
  │   └── landing-producto/
  │       └── ...
  └── empresa-beta/
      └── ...
```

```nginx
# Nginx config para servir portales
server {
    listen 80;
    server_name *.portales.tudominio.com;

    # Extraer subdomain para mapear al portal
    set $portal "";
    if ($host ~* ^(.+)\.portales\.tudominio\.com$) {
        set $portal $1;
    }

    location / {
        proxy_pass http://minio:9000/portales/$portal/;
        proxy_set_header Host $host;

        # Cache para assets estáticos
        location ~* \.(css|js|png|jpg|webp|avif|svg|woff2)$ {
            proxy_pass http://minio:9000/portales/$portal/$uri;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

**URLs resultantes:**

- `portal-corporativo.portales.tudominio.com`
- `landing-producto.portales.tudominio.com`

### Opción B: Cloudflare Pages (Managed CDN)

Subir el build a Cloudflare Pages vía API para distribución global.
Cada portal es un "proyecto" en Cloudflare Pages.

```text
Ventajas:
  - CDN global (edge locations en todo el mundo)
  - SSL automático
  - Dominio custom fácil de configurar
  - Analytics integrados
  - Gratis para sitios estáticos

Integración:
  POST https://api.cloudflare.com/client/v4/accounts/{id}/pages/projects/{project}/deployments
  Content-Type: multipart/form-data
  Body: [archivos del build]
```

### Opción C: Vercel / Netlify

Similar a Cloudflare Pages pero con ecosistema más amplio.
Vercel tiene integración nativa con Astro.

```text
Ventajas:
  - Deploy automático desde API
  - Preview deployments
  - Edge functions si se necesitan
  - Analytics

Desventajas:
  - Costos pueden escalar con muchos portales
  - Dependencia del vendor
```

## Estrategia Recomendada por Fase

### Fase 1 — MVP (Inicio)

```text
MinIO + Nginx (self-hosted)
  - Costo: $0 extra (ya tienes MinIO y Nginx)
  - Subdominios: *.portales.tudominio.com
  - SSL: Let's Encrypt wildcard
  - Deploy: NestJS sube el /dist a MinIO, Nginx lo sirve
```

### Fase 2 — Escalamiento

```text
Cloudflare R2 (storage) + Cloudflare Pages (CDN)
  - MinIO se reemplaza por R2 (compatible S3)
  - Portales se sirven desde CDN global
  - Dominios custom por empresa: portal.empresa-alpha.com
  - SSL automático por dominio
```

### Fase 3 — Enterprise

```text
Multi-CDN + Dominios Custom + Analytics
  - Cada empresa puede configurar su propio dominio
  - Dashboard de analytics por portal
  - A/B testing integrado
  - Edge functions para formularios y dinámico
```

## Dominios y DNS

### Estrategia de subdominios (Fase 1)

```text
Dominio base: portales.generador.com

Portales publicados:
  portal-corporativo.portales.generador.com  → Build del proyecto "Portal Corporativo"
  landing-alpha.portales.generador.com       → Build del proyecto "Landing Alpha"

Requiere:
  - Un registro DNS wildcard: *.portales.generador.com → IP del servidor
  - Certificado SSL wildcard (Let's Encrypt)
  - Nginx como reverse proxy que rutea por subdomain
```

### Dominios custom (Fase 2+)

```text
La empresa quiere que su portal sea accesible en:
  www.empresa-alpha.com

Flujo:
  1. Empresa configura CNAME: www.empresa-alpha.com → portales.generador.com
  2. Sistema detecta el dominio custom vía header Host
  3. Nginx/Cloudflare mapea el dominio al build correspondiente
  4. SSL se genera automáticamente (Let's Encrypt / Cloudflare)

Tabla en PostgreSQL:
  custom_domains
    id          | portal_id    | domain               | ssl_status | verified
    dom_001     | prj_def456   | www.empresa-alpha.com | ACTIVE     | true
```

## Modelo de Datos Adicional (agregar al Prisma schema)

```prisma
model CustomDomain {
  id          String   @id @default(cuid())
  projectId   String   @map("project_id")
  domain      String   @unique
  sslStatus   String   @default("PENDING") @map("ssl_status") // PENDING, ACTIVE, FAILED
  isVerified  Boolean  @default(false) @map("is_verified")
  verifiedAt  DateTime? @map("verified_at")
  createdAt   DateTime @default(now()) @map("created_at")

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@map("custom_domains")
}
```

## Docker Config — Nginx para servir portales

Agregar al docker-compose:

```yaml
  # Servidor de portales generados
  portal-server:
    container_name: gen_por-portal-server
    image: nginx:alpine
    ports:
      - "${PORTAL_PORT:-4080}:80"
      - "${PORTAL_SSL_PORT:-4443}:443"
    volumes:
      - ./config/nginx/portales.conf:/etc/nginx/conf.d/default.conf
      - ./config/nginx/ssl:/etc/nginx/ssl
    depends_on:
      - minio
    networks:
      - generador-net
```

## Resumen de URLs del Sistema

| Servicio                     | URL                      | Puerto |
| ---------------------------- | ------------------------ | ------ |
| Frontend (editor/dashboard)  | <http://localhost:4000>  | 4000   |
| API NestJS                   | <http://localhost:4001>  | 4001   |
| Portales generados (preview) | <http://localhost:4080>  | 4080   |
| MinIO Console                | <http://localhost:9003>  | 9003   |
| PostgreSQL                   | localhost:5433           | 5433   |
| Redis                        | localhost:6380           | 6380   |
