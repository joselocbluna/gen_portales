# Credenciales y Puertos de Servidores

A continuación se detalla la configuración de red, puertos y credenciales para el entorno de desarrollo local del proyecto **Generador de Portales**.

| Servicio | URL / Host | Puerto | Usuario / Email | Contraseña | Propósito |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Frontend Web (Next.js)** | `http://localhost:3001` | **3001** | N/A | N/A | Aplicación principal del Editor Visual y Dashboard. |
| **Backend API (NestJS)** | `http://localhost:3002` | **3002** | N/A | N/A | API REST que gestiona persistencia y despliegue Astro. |
| **Base de Datos (PostgreSQL)** | `localhost` / `127.0.0.1` | **5432** | `postgres` | `password` | Almacenamiento persistente de Portales, Usuarios y Páginas. |
| **Gestor BBDD (pgAdmin 4)** | `http://localhost:5055` | **5055** | `admin@genportales.com` | `admin` | Interfaz gráfica web para consultar y administrar la base de datos PostgreSQL. |

> [!NOTE]
> **Para conectar pgAdmin a la base de datos PostgreSQL:**
>
> 1. Abre [http://localhost:5055](http://localhost:5055) en tu navegador e inicia sesión con el email y password indicados arriba.
> 2. Haz clic en **Add New Server**.
> 3. En la pestaña **General**, ponle un nombre (ej. `GenPortales Local`).
> 4. En la pestaña **Connection**, usa:
>    - **Host name/address:** `db` (importante usar el nombre del contenedor de docker, no localhost, dado que ambas corren dentro de docker-compose) *Alternativa desde fuera:* `host.docker.internal`
>    - **Port:** `5432`
>    - **Maintenance database:** `gen_portales`
>    - **Username:** `postgres`
>    - **Password:** `Admin123pass`
> 5. Guarda la conexión.
