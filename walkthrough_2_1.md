# Fase 2.1: Implementación de Componentes Interactivos y Layouts Complejos

En esta iteración, se amplió enormemente la capacidad del Editor Visual y del Motor Generador Astro, introduciendo herramientas cruciales para la construcción de portales funcionales avanzados.

## Logros Principales

### 1. Sistema de Layouts Dinámicos a Nivel Página

Se introdujo la propiedad `layout` dentro del diseño base (`Page`), permitiendo a cada página definir su estructura general.

- Se agregó el soporte en el Inspector Derecho (SidebarRight) para seleccionar entre:
  - **Por Defecto (Container):** Centrado y confinado a un ancho máximo (1200px), clásico.
  - **Ancho Completo (Fullwidth):** Ocupa el 100% de la pantalla sin márgenes laterales.
  - **Con Barra Lateral (Sidebar):** Activa un layout en cuadrícula (`display: grid`) generando automáticamente una barra lateral de 250px que acompaña al contenido principal, ideal para dashboards, documentación o blogs.
- El `generador.service.ts` fue actualizado para inyectar inteligentemente estos estilos y estructuras HTML base (incluyendo elementos semánticos de `<aside>` y `<main>`).

### 2. Soporte Extendido para Acciones de Botones

El caso de uso de los botones dejó de ser meramente estético para volverse interactivo a nivel HTML/JS nativo.
Se implementaron los siguientes tipos de interacción nativa desde el panel de propiedades:

- **Abrir Enlace URL (`link`):** Genera etiquetas `<a>` puras para SEO.
- **Scroll Suave a ID (`scroll`):** Genera referencias internas asumiendo un `#` previo para navegación on-page ("One Page").
- **Mostrar Ventana Modal (`modal`):** Al inyectar el identificador del modal de destino, inyecta JavaScript nativo en el Tag (`onclick="document.getElementById('xyz').showModal()"`) aprovechando el elemento `<dialog>` estándar de HTML5.

### 3. Componentes Especializados Constructivos

#### Galería de Imágenes Dinámica (`gallery`)

- Permite la creación y renderizado visual instantáneo de una cuadrícula (`dnd-kit`).
- **Editor:** Utiliza placeholders automáticos inyectados en grid interactiva desde el SidebarLeft.
- **Inspector:** Muestra un panel especial donde el usuario ingresa una lista separada por comas de URLs de imágenes y la cantidad de columnas `columns` con los que se desea que se dibujen localmente (desde 1 a 6 columnas).
- **Astro Engine:** Agrega la compilación de la galería en formato `grid-template-columns` dinámico en línea.

#### Formulario de Contacto (`form`)

- Incorporado al Drag and Drop del editor con representación visual robusta de placeholders.
- Permite que el usuario configure a través del inspector el buzón destino (`emailTo`) y el llamado a la acción del botón submit (`buttonText`).
- **Astro Export:** Compila el formulario empleando tags HTML limpios (`<form>`, `<input>`, `<textarea>`, `<button>`), preconfigurando un reenvío genérico por `mailto:` o listo para interactuar con sistemas de ingesta de API gracias al método `POST`.

## Verificación

Se probó de punta a punta (End-to-End) usando los agentes en emulación web.

1. Se arrojó Galería y Formulario dentro del lienzo.
2. Se cambiaron sus parámetros.
3. Se seleccionó el Page Layout a "Con Barra Lateral" global en el inspector general.
4. Tras clickear "Exportar a Astro", la generación estática `.astro` resolvió exitosamente emitiendo el código HTML/CSS correcto sin interferencias con el backend.

Todo ha quedado completamente estable y funcional.
