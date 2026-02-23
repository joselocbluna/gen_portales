# Prompts para Google Stitch — Generador de Portales

**Fecha:** 2026-02-22

## Instrucciones Generales para Stitch

Antes de enviar cada prompt, configura en Stitch:
- **Framework:** React (Next.js compatible)
- **Estilo:** Tailwind CSS
- **Tema:** Modo oscuro para sidebar, modo claro para contenido
- **Idioma:** Español para labels y textos

---

## Prompt 1 — Pantalla de Login

```
Diseña una pantalla de login profesional para una plataforma SaaS llamada
"Generador de Portales". La pantalla se divide en dos mitades:

LADO IZQUIERDO (60% del ancho):
- Fondo con gradiente de azul oscuro (#1e3a5f) a azul medio (#3b82f6)
- Logo del producto: un hexágono estilizado + texto "Generador de Portales"
- Texto descriptivo: "Crea portales web profesionales con nuestro editor visual
  drag & drop. Integra inteligencia artificial para acelerar tu flujo de trabajo."
- Versión pequeña al pie: "v1.0 — Plataforma de generación de sitios web"

LADO DERECHO (40% del ancho):
- Fondo blanco
- Título: "Iniciar Sesión"
- Subtítulo: "Ingresa tus credenciales para acceder"
- Campo: "Correo electrónico" con placeholder "usuario@empresa.com"
- Campo: "Contraseña" con icono de ojo para mostrar/ocultar
- Botón azul (#3b82f6) de ancho completo: "Iniciar Sesión"
- Enlace inferior: "¿No tienes cuenta? Contacta al administrador"

Estilo: limpio, moderno, tipografía Inter o similar sans-serif.
Framework: React con Tailwind CSS. Responsive para desktop y móvil.
```

---

## Prompt 2 — Dashboard Admin (*systemroot)

```
Diseña un dashboard administrativo para un sistema SaaS multi-tenant llamado
"Generador de Portales". Este dashboard es para el usuario administrador global
(*systemroot) que puede ver todas las empresas del sistema.

LAYOUT:
- Sidebar izquierdo oscuro (#1e293b) de 220px con:
  - Logo: "Gen Portales" con icono hexagonal azul
  - Sección "Principal": Empresas (activo), Templates Globales
  - Sección "Administración": Usuarios, Roles y Permisos
  - Sección "Sistema": Configuración
- Topbar blanco con breadcrumb "Empresas — Vista global" y avatar del usuario

CONTENIDO PRINCIPAL:
- 4 stat cards en fila:
  - "12 Empresas activas" | "47 Proyectos totales" | "23 Templates globales" | "89 Usuarios registrados"
- Barra de búsqueda + botón "Nueva Empresa" azul
- Grid de cards (3 columnas) para cada empresa:
  - Nombre de la empresa con badge de estado (Activa/Inactiva)
  - Stats: "X proyectos · X templates · X usuarios"
  - Botones: "Ver" (gris) y "Proyectos" (azul)

Colores: sidebar #1e293b, acciones #3b82f6, stats cards con bordes suaves.
Framework: React con Tailwind CSS. Componentes reutilizables.
```

---

## Prompt 3 — Dashboard de Empresa (usuario normal)

```
Diseña el dashboard principal para un usuario que pertenece a una empresa
específica dentro del sistema "Generador de Portales".

LAYOUT:
- Sidebar izquierdo oscuro (#1e293b):
  - Logo: nombre de la empresa "Empresa Alpha" con icono
  - Menú: Inicio (activo), Proyectos, Templates, Mi Perfil
- Topbar con breadcrumb, badge del rol del usuario (ej: "Desarrollador" en azul),
  nombre "Jose" y avatar

CONTENIDO:
- Saludo: "Bienvenido, Jose" con subtítulo "Empresa Alpha — 8 proyectos activos"
- 3 stat cards: "Mis proyectos (8)", "Templates empresa (3)", "Templates globales (23)"
- Sección "Proyectos recientes" como grid de cards:
  - Cada card tiene: nombre del proyecto, badge de estado (Publicado en verde,
    Borrador en azul), stats "X páginas · Actualizado hace Xh",
    botones "Editar" (azul) y "Preview" (verde/gris)

El diseño debe sentirse como entrar a tu espacio de trabajo personal dentro
de una empresa. Limpio, organizado, con acceso rápido a proyectos.
Framework: React con Tailwind CSS.
```

---

## Prompt 4 — Lista de Proyectos

```
Diseña la pantalla de listado de proyectos de una empresa para el sistema
"Generador de Portales".

LAYOUT: mismo sidebar y topbar que la pantalla de empresa.

CONTENIDO:
- Header con título "Proyectos", subtítulo "8 proyectos en Empresa Alpha",
  y botón "+ Nuevo Proyecto" azul
- Barra de búsqueda con filtro dropdown de estado (Todos/Publicado/Borrador)
- Tabla con columnas:
  - Proyecto (nombre en negrita)
  - Estado (badge: Publicado verde, Borrador azul)
  - Páginas (número)
  - Template base (nombre del template usado)
  - Última edición (texto relativo: "Hace 2 horas")
  - Acciones (botones "Editar" azul y "Config" gris)
- 4-5 filas de ejemplo con datos variados
- Paginación al pie

Estilo: tabla limpia con hover suave, sin bordes pesados, tipografía de 13px.
Framework: React con Tailwind CSS.
```

---

## Prompt 5 — Editor Canvas (PANTALLA PRINCIPAL)

```
Diseña un editor visual de páginas web tipo page builder para el sistema
"Generador de Portales". Esta es la pantalla más importante del sistema.
El diseño debe ser similar a editores como Webflow, Figma, o WordPress Elementor.

LAYOUT COMPLETO (de izquierda a derecha):

1. TOOLBAR VERTICAL (48px de ancho, fondo #1e293b):
   - Herramienta Seleccionar (cursor), Mover (mano), Texto (T), Imagen
   - Separador
   - Vista: Desktop, Tablet, Móvil (3 iconos)
   - Separador
   - Código (</>) para ver HTML, Deshacer, Rehacer
   - Separador
   - Botón especial IA con fondo morado (#7c3aed) e icono de sparkle/estrella ✨

2. PANEL IZQUIERDO (200px, fondo blanco):
   - Sección "Páginas" con tree view:
     - Home (activa, resaltada en azul)
     - Nosotros
     - Servicios
     - Contacto
     - Botón "+ Página"
   - Sección "Componentes" con items arrastrables (dashed border):
     - Header, Hero Section, Texto, Imagen, Botón, Cards Grid,
       Formulario, Navegación, Footer
   - Sección "Secciones" (layouts):
     - 1 Columna, 2 Columnas, 3 Columnas, Sidebar + Main

3. CANVAS CENTRAL (el espacio más grande):
   - Barra superior con: nombre de la página actual, botones Preview/Guardar/Publicar
   - Área de edición con fondo gris claro (#f1f5f9)
   - Contenedor blanco centrado (80% del ancho) que simula la página:
     - Sección "Header" (border dashed azul, label azul): logo + menú de navegación
     - Sección "Hero Section" (border dashed morado, label morado):
       título grande centrado, subtítulo, botón CTA
     - Sección "Contenido 3 cols" con 3 placeholders de cards
     - Zona vacía con texto: "Arrastra un componente aquí o usa el asistente IA ✨"
   - Cada sección tiene un label flotante en la esquina superior izquierda
     con el nombre del tipo de sección

4. PANEL DERECHO - PROPIEDADES (260px, fondo blanco):
   - Título "Propiedades" + indicador del componente seleccionado
   - Grupo "Contenido": campos de texto para título, subtítulo, texto botón, URL
   - Grupo "Estilos": color de fondo con color picker, alineación (select),
     padding (input)
   - Grupo "Responsive": botones toggle para Desktop/Tablet/Móvil

5. PANEL IA (300px, fondo oscuro #0f172a) — EL DIFERENCIADOR:
   - Header: indicador verde "Asistente IA" + contexto actual "Página: Home"
   - Área de mensajes estilo chat:
     - Mensaje usuario: "Agrega una sección de testimonios con 3 cards
       debajo del hero"
     - Respuesta IA: descripción de lo que hizo + "✓ Sección agregada al canvas"
       en verde
     - Mensaje usuario: "Cambia los colores del hero a gradiente azul oscuro
       con texto blanco"
     - Respuesta IA: confirmación + "✓ Estilos actualizados" en verde
   - Input inferior: campo de texto "Describe lo que necesitas..." + botón "Enviar"

IMPORTANTE:
- El canvas debe sentirse como un espacio de trabajo real donde se arrastran componentes
- Las secciones en el canvas deben tener bordes dashed para indicar que son editables
- El panel de IA debe ser oscuro para diferenciarse visualmente del resto del editor
- Los componentes en el panel izquierdo deben parecer "arrastrables" (cursor grab)
- Todo debe usar React con Tailwind CSS
- Los paneles laterales deben poder colapsarse
```

---

## Prompt 6 — Editor Canvas (versión móvil / tablet)

```
Diseña la versión responsive del editor canvas del Prompt 5 para tablet y móvil.

TABLET (1024px):
- Los paneles laterales se convierten en drawers que se abren/cierran
- El toolbar vertical se mantiene pero más compacto
- El canvas ocupa todo el ancho disponible
- El panel de IA se abre como overlay/drawer desde la derecha

MÓVIL (768px):
- Toolbar se mueve a la parte inferior como una barra flotante
- No hay paneles laterales visibles por defecto
- El canvas ocupa el 100% de la pantalla
- Botones flotantes para abrir: componentes, propiedades, IA
- La interacción principal es seleccionar componentes con tap y
  editarlos en un bottom sheet

Framework: React con Tailwind CSS. Usa breakpoints de Tailwind.
```

---

## Prompt 7 — Galería de Templates

```
Diseña una galería de templates para el sistema "Generador de Portales".
Los templates son diseños predefinidos que los usuarios pueden usar como
base para crear nuevos proyectos.

LAYOUT: sidebar + topbar consistente con las demás pantallas.

CONTENIDO:
- Header: "Templates" + botón "+ Crear Template" (solo si el rol es Desarrollador)
- Filtros como tabs/pills:
  - "Todos" (activo, azul), "Globales (23)" con icono 🌐, "Mi Empresa (3)" con icono 🏢
- Grid de template cards (4 columnas):
  - Preview visual: rectángulo con gradiente de color + icono grande representativo
  - Nombre del template en negrita
  - Descripción breve (2 líneas max)
  - Tags: "Global" o "Mi Empresa" + número de páginas + categoría
  - Hover: overlay con botones "Usar Template" y "Preview"

Templates de ejemplo:
- "Corporativo Pro" — Global, 12 páginas, icono 🏢, gradiente azul
- "Landing Page" — Global, 1 página, icono 🚀, gradiente rosa
- "Blog Starter" — Global, 5 páginas, icono 📝, gradiente verde
- "Alpha - Servicios" — Mi Empresa, 4 páginas, icono 🏢, gradiente amarillo

El hover en cada card debe mostrar una capa semitransparente con los botones
de acción. La UI debe sentirse como un catálogo/marketplace.
Framework: React con Tailwind CSS.
```

---

## Prompt 8 — Panel de Administración de Usuarios

```
Diseña el panel de administración de usuarios para el sistema
"Generador de Portales". Solo accesible por el rol Admin (*systemroot).

LAYOUT: sidebar de admin + topbar.

CONTENIDO:
- Header: "Usuarios" + botón "+ Invitar Usuario"
- Filtros: búsqueda por nombre + dropdown empresa + dropdown rol
- Tabla con columnas:
  - Usuario (nombre completo en negrita)
  - Email
  - Empresa (nombre de la empresa asignada)
  - Rol (badge con color por rol):
    - Desarrollador: badge azul/índigo
    - Editor: badge rosa/fucsia
    - Admin: badge rojo
  - Estado: indicador verde "Activo", amarillo "Invitado", rojo "Inactivo"
  - Acciones: botón "Editar"

Modal de "Invitar Usuario" (diseñar también):
- Campos: nombre, apellido, email
- Dropdown: seleccionar empresa
- Dropdown: seleccionar rol
- Botones: "Cancelar" y "Enviar Invitación"

Framework: React con Tailwind CSS. La tabla debe ser responsive
con scroll horizontal en móvil.
```

---

## Prompt 9 — Componentes del Sistema de Diseño

```
Diseña el sistema de componentes reutilizables (design system) para
"Generador de Portales". Crea una pantalla tipo storybook/catálogo
que muestre todos los componentes base del sistema:

COMPONENTES A DISEÑAR:

1. BOTONES:
   - Primary (azul #3b82f6), Secondary (gris), Success (verde), Danger (rojo)
   - Tamaños: sm, md, lg
   - Estados: normal, hover, disabled, loading

2. BADGES/TAGS:
   - Estado: Activo (verde), Borrador (azul), Publicado (verde), Inactivo (amarillo)
   - Rol: Admin (rojo), Desarrollador (índigo), Editor (rosa)
   - Tipo: Global (azul claro), Mi Empresa (azul)

3. CARDS:
   - Card de empresa (con stats)
   - Card de proyecto (con estado y acciones)
   - Card de template (con preview y tags)

4. FORMULARIOS:
   - Input de texto con label
   - Select/dropdown
   - Textarea
   - Checkbox y toggle switch
   - Color picker

5. TABLAS:
   - Header con sorting
   - Rows con hover
   - Paginación

6. NAVEGACIÓN:
   - Sidebar con secciones y items
   - Topbar con breadcrumb y user info
   - Tabs/Pills para filtros

7. MODALES:
   - Modal de confirmación
   - Modal de formulario
   - Drawer lateral

Colores del tema:
- Primary: #3b82f6
- Background sidebar: #1e293b
- Background contenido: #f8fafc
- Texto principal: #1e293b
- Texto secundario: #64748b
- Bordes: #e2e8f0

Tipografía: Inter
Framework: React con Tailwind CSS.
```

---

## Notas de Uso

### Orden recomendado de ejecución en Stitch

1. **Prompt 9** primero (Design System) — establece los componentes base
2. **Prompt 1** (Login) — pantalla más simple
3. **Prompt 2** (Dashboard Admin) — valida el layout con sidebar
4. **Prompt 3** (Dashboard Empresa) — reutiliza el layout
5. **Prompt 4** (Lista Proyectos) — reutiliza el layout + tabla
6. **Prompt 7** (Templates) — reutiliza el layout + cards
7. **Prompt 8** (Admin Usuarios) — reutiliza el layout + tabla + modal
8. **Prompt 5** (Editor Canvas) — la pantalla más compleja, al final
9. **Prompt 6** (Editor Responsive) — variante del editor

### Cómo traer los diseños al código con stitch-mcp

Una vez que los diseños estén en Stitch, usa estos comandos:

```bash
# Ver las pantallas del proyecto en Stitch
# (desde Claude Code o Antigravity con el MCP configurado)

# Obtener el HTML/CSS de una pantalla específica
get_screen_code --screen "login"

# Obtener screenshot para referencia
get_screen_image --screen "editor-canvas"

# Construir todo el sitio mapeando pantallas a rutas
build_site --project "generador-portales" --routes '{
  "/login": "login",
  "/empresas": "dashboard-admin",
  "/empresas/:id": "dashboard-empresa",
  "/empresas/:id/proyectos": "lista-proyectos",
  "/empresas/:id/proyectos/:pid/editor": "editor-canvas",
  "/empresas/:id/templates": "galeria-templates",
  "/admin/usuarios": "admin-usuarios"
}'
```
