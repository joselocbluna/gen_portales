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
    language: string; // "es", "en", etc.
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
    [key: string]: string; // colores personalizados
}

export interface AnalyticsConfig {
    googleTagManagerId?: string;
    googleAnalyticsId?: string;
    facebookPixelId?: string;
}

// === PÁGINAS ===
export interface Page {
    id: string;
    name: string;
    slug: string; // "/", "/nosotros", "/servicios"
    title: string; // SEO title
    description: string; // SEO meta description
    layout: "default" | "fullwidth" | "sidebar";
    sections: Section[];
    meta: PageMeta;
}

export interface PageMeta {
    isHomepage: boolean;
    isPublished: boolean;
    order: number; // Orden en la navegación
    showInNav: boolean;
}

// === SECCIONES ===
export interface Section {
    id: string;
    name: string;
    type: SectionType;
    columns: number; // 1, 2, 3, 4
    columnLayout?: string; // "equal", "sidebar-main", "main-sidebar", "custom"
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
    props: Record<string, any>; // Propiedades específicas del componente
    styles: ComponentStyles;
    responsive: ResponsiveConfig;
    children?: Component[]; // Componentes anidados
    events?: EventConfig[]; // Interacciones (futuro)
    column?: number; // En qué columna está (0-indexed)
    order: number; // Orden dentro de la columna/sección
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
    | "html"
    // Custom
    | "custom";

export interface EventConfig {
    type: "click" | "hover" | "submit" | "custom";
    action: string;
    payload?: any;
}

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
