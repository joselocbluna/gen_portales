# Schema JSON de Componentes del Editor

**Fecha:** 2026-02-22
**Estado:** Definido

## Propósito

Este schema es el **contrato compartido** entre tres sistemas:

1. **Editor Canvas (dnd-kit):** Lee y escribe este JSON como estado del canvas
2. **Asistente IA:** Recibe y devuelve fragmentos de este JSON
3. **Generador Astro:** Consume este JSON para producir código .astro

## Estructura Jerárquica

```
Proyecto (Portal)
└── Páginas[]
    └── Secciones[]
        └── Componentes[]
            ├── Props{}
            ├── Estilos{}
            └── Hijos[] (componentes anidados)
```

## Schema Completo (TypeScript)

```typescript
// packages/shared/types/canvas.ts

// === PROYECTO / PORTAL ===
export interface PortalState {
  id: string;
  name: string;
  slug: string;
  settings: PortalSettings;
  pages: Page[];
  globalStyles: GlobalStyles;
}

export interface PortalSettings {
  favicon?: string;
  ogImage?: string;
  language: string;           // "es", "en", etc.
  fonts: FontConfig[];
  colorPalette: ColorPalette;
  analytics?: AnalyticsConfig;
}

export interface FontConfig {
  family: string;
  weights: number[];
  source: "google" | "custom" | "system";
  url?: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  [key: string]: string;      // colores personalizados
}

// === PÁGINAS ===
export interface Page {
  id: string;
  name: string;
  slug: string;               // "/", "/nosotros", "/servicios"
  title: string;              // SEO title
  description: string;        // SEO meta description
  layout: "default" | "fullwidth" | "sidebar";
  sections: Section[];
  meta: PageMeta;
}

export interface PageMeta {
  isHomepage: boolean;
  isPublished: boolean;
  order: number;              // Orden en la navegación
  showInNav: boolean;
}

// === SECCIONES ===
export interface Section {
  id: string;
  name: string;
  type: SectionType;
  columns: number;            // 1, 2, 3, 4
  columnLayout?: string;      // "equal", "sidebar-main", "main-sidebar", "custom"
  components: Component[];
  styles: SectionStyles;
  responsive: ResponsiveConfig;
}

export type SectionType =
  | "header"
  | "hero"
  | "content"
  | "features"
  | "testimonials"
  | "gallery"
  | "cta"
  | "form"
  | "footer"
  | "custom";

export interface SectionStyles {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  padding: SpacingConfig;
  margin: SpacingConfig;
  maxWidth?: string;
  minHeight?: string;
}

// === COMPONENTES ===
export interface Component {
  id: string;
  type: ComponentType;
  name: string;
  props: Record<string, any>;    // Propiedades específicas del componente
  styles: ComponentStyles;
  responsive: ResponsiveConfig;
  children?: Component[];         // Componentes anidados
  events?: EventConfig[];         // Interacciones (futuro)
  column?: number;                // En qué columna está (0-indexed)
  order: number;                  // Orden dentro de la columna/sección
}

export type ComponentType =
  // Estructura
  | "container"
  | "row"
  | "column"
  // Texto
  | "heading"
  | "paragraph"
  | "richtext"
  | "list"
  // Media
  | "image"
  | "video"
  | "icon"
  // Interactivos
  | "button"
  | "link"
  | "form"
  | "input"
  | "textarea"
  | "select"
  // Compuestos
  | "card"
  | "carousel"
  | "accordion"
  | "tabs"
  | "navigation"
  | "breadcrumb"
  | "pagination"
  // Datos
  | "table"
  | "map"
  | "embed"
  // Custom
  | "custom";

// === ESTILOS ===
export interface ComponentStyles {
  // Layout
  display?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  // Spacing
  padding?: SpacingConfig;
  margin?: SpacingConfig;
  // Typography
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  lineHeight?: string;
  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  // Border
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
  // Shadow
  boxShadow?: string;
  // Custom CSS
  customCSS?: string;
}

export interface SpacingConfig {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export interface ResponsiveConfig {
  desktop: { visible: boolean; styles?: Partial<ComponentStyles> };
  tablet: { visible: boolean; styles?: Partial<ComponentStyles> };
  mobile: { visible: boolean; styles?: Partial<ComponentStyles> };
}

export interface GlobalStyles {
  bodyBackground: string;
  defaultFont: string;
  headingFont: string;
  linkColor: string;
  customCSS?: string;
}
```

## Ejemplo de JSON del Canvas

```json
{
  "id": "portal-001",
  "name": "Portal Corporativo Alpha",
  "slug": "portal-alpha",
  "settings": {
    "language": "es",
    "fonts": [
      { "family": "Inter", "weights": [400, 500, 600, 700], "source": "google" }
    ],
    "colorPalette": {
      "primary": "#3b82f6",
      "secondary": "#1e293b",
      "accent": "#f59e0b",
      "background": "#ffffff",
      "text": "#334155"
    }
  },
  "pages": [
    {
      "id": "page-home",
      "name": "Home",
      "slug": "/",
      "title": "Portal Alpha - Inicio",
      "description": "Bienvenido al portal de Empresa Alpha",
      "layout": "default",
      "meta": { "isHomepage": true, "isPublished": true, "order": 0, "showInNav": true },
      "sections": [
        {
          "id": "sec-header",
          "name": "Header",
          "type": "header",
          "columns": 1,
          "components": [
            {
              "id": "comp-logo",
              "type": "image",
              "name": "Logo",
              "props": { "src": "/media/logo.svg", "alt": "Alpha Logo", "width": 140 },
              "styles": {},
              "responsive": {
                "desktop": { "visible": true },
                "tablet": { "visible": true },
                "mobile": { "visible": true }
              },
              "order": 0
            },
            {
              "id": "comp-nav",
              "type": "navigation",
              "name": "Menú Principal",
              "props": {
                "items": [
                  { "label": "Inicio", "href": "/" },
                  { "label": "Nosotros", "href": "/nosotros" },
                  { "label": "Servicios", "href": "/servicios" },
                  { "label": "Contacto", "href": "/contacto" }
                ]
              },
              "styles": { "fontSize": "14px" },
              "responsive": {
                "desktop": { "visible": true },
                "tablet": { "visible": true },
                "mobile": { "visible": true, "styles": { "display": "none" } }
              },
              "order": 1
            }
          ],
          "styles": {
            "backgroundColor": "#ffffff",
            "padding": { "top": "16px", "bottom": "16px", "left": "24px", "right": "24px" },
            "margin": {}
          },
          "responsive": {
            "desktop": { "visible": true },
            "tablet": { "visible": true },
            "mobile": { "visible": true }
          }
        },
        {
          "id": "sec-hero",
          "name": "Hero Section",
          "type": "hero",
          "columns": 1,
          "components": [
            {
              "id": "comp-title",
              "type": "heading",
              "name": "Título Principal",
              "props": { "text": "Bienvenido a Nuestro Portal", "level": "h1" },
              "styles": { "fontSize": "36px", "fontWeight": "700", "textAlign": "center" },
              "responsive": {
                "desktop": { "visible": true },
                "tablet": { "visible": true },
                "mobile": { "visible": true, "styles": { "fontSize": "24px" } }
              },
              "order": 0
            },
            {
              "id": "comp-subtitle",
              "type": "paragraph",
              "name": "Subtítulo",
              "props": { "text": "Soluciones innovadoras para tu negocio" },
              "styles": { "color": "#64748b", "textAlign": "center", "fontSize": "18px" },
              "responsive": {
                "desktop": { "visible": true },
                "tablet": { "visible": true },
                "mobile": { "visible": true }
              },
              "order": 1
            },
            {
              "id": "comp-cta",
              "type": "button",
              "name": "CTA Principal",
              "props": { "text": "Conocer más", "href": "/servicios", "variant": "primary" },
              "styles": { "backgroundColor": "#3b82f6", "color": "#ffffff" },
              "responsive": {
                "desktop": { "visible": true },
                "tablet": { "visible": true },
                "mobile": { "visible": true }
              },
              "order": 2
            }
          ],
          "styles": {
            "padding": { "top": "64px", "bottom": "64px" },
            "margin": {},
            "backgroundGradient": "linear-gradient(135deg, #1e3a5f, #3b82f6)"
          },
          "responsive": {
            "desktop": { "visible": true },
            "tablet": { "visible": true },
            "mobile": { "visible": true }
          }
        }
      ]
    }
  ],
  "globalStyles": {
    "bodyBackground": "#ffffff",
    "defaultFont": "Inter",
    "headingFont": "Inter",
    "linkColor": "#3b82f6"
  }
}
```
