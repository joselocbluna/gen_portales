import { create } from 'zustand';
import { produce } from 'immer';
import { PortalState, Page, Section, Component } from '@generador/shared';

interface CanvasStoreState {
    portal: PortalState | null;
    activePageId: string | null;
    selectedComponentId: string | null;

    // Actions
    initPortal: (portal: PortalState) => void;
    setActivePage: (pageId: string) => void;
    selectComponent: (componentId: string | null) => void;

    // Drag helpers
    addSectionFromDrag: (sectionType: string) => void;
    addComponentFromDrag: (sectionId: string, componentType: string, columnIndex?: number) => void;

    // Modifiers
    updateComponentProps: (componentId: string, props: Record<string, unknown>) => void;
    updateComponentStyles: (componentId: string, styles: Record<string, unknown>) => void;
    updateSectionProps: (sectionId: string, props: Partial<Section>) => void;
    updateSectionStyles: (sectionId: string, styles: Partial<Section["styles"]>) => void;
    addSection: (pageId: string, section: Section) => void;
    addComponentToSection: (sectionId: string, component: Component) => void;
    reorderSections: (pageId: string, oldIndex: number, newIndex: number) => void;

    updatePageProps: (pageId: string, props: Partial<Page>) => void;

    updateGlobalStyles: (styles: Partial<PortalState["globalStyles"]>) => void;
    updateColorPalette: (palette: Partial<PortalState["settings"]["colorPalette"]>) => void;
}

const dummyPortal: PortalState = {
    id: "portal-1",
    name: "Mi Portal Demo",
    slug: "mi-portal-demo",
    settings: {
        language: "es",
        fonts: [],
        colorPalette: { primary: "#2563eb", secondary: "#475569", background: "#f8fafc", text: "#0f172a", accent: "#f59e0b" }
    },
    globalStyles: { bodyBackground: "#ffffff", defaultFont: "Inter", headingFont: "Inter", linkColor: "#2563eb" },
    pages: [
        {
            id: "page-1",
            name: "Inicio",
            slug: "/",
            title: "Página de Inicio",
            description: "Página inicial del portal",
            layout: "default",
            sections: [],
            meta: { isHomepage: true, isPublished: true, order: 1, showInNav: true }
        },
        {
            id: "page-2",
            name: "Contacto",
            slug: "/contacto",
            title: "Contacto",
            description: "Para contactarnos",
            layout: "default",
            sections: [],
            meta: { isHomepage: false, isPublished: true, order: 2, showInNav: true }
        }
    ]
};

export const useCanvasStore = create<CanvasStoreState>((set) => ({
    portal: dummyPortal,
    activePageId: "page-1",
    selectedComponentId: null,

    initPortal: (portal) => set({ portal, activePageId: portal.pages[0]?.id || null }),

    setActivePage: (pageId) => set({ activePageId: pageId }),

    selectComponent: (componentId) => set({ selectedComponentId: componentId }),

    addSectionFromDrag: (sectionType: string) => set(produce((state: CanvasStoreState) => {
        if (!state.portal || !state.activePageId) return;
        const page = state.portal.pages.find(p => p.id === state.activePageId);
        if (!page) return;

        page.sections.push({
            id: `section-${Date.now()}`,
            name: sectionType === 'columns' ? "Columnas" : sectionType === 'footer' ? "Pie de Página" : "Nueva Sección",
            type: sectionType as "columns" | "section" | "header" | "footer",
            columns: sectionType === 'columns' ? 2 : sectionType === 'footer' ? 3 : 1,
            components: [],
            styles: sectionType === 'footer' ? { padding: { top: '3rem', bottom: '3rem' }, margin: {}, backgroundColor: '#1e293b' } : { padding: {}, margin: {} },
            responsive: { desktop: { visible: true }, tablet: { visible: true }, mobile: { visible: true } }
        });
    })),

    addComponentFromDrag: (sectionId: string, componentType: string, columnIndex: number = 0) => set(produce((state: CanvasStoreState) => {
        if (!state.portal || !state.activePageId) return;
        const page = state.portal.pages.find(p => p.id === state.activePageId);
        if (!page) return;

        const section = page.sections.find(s => s.id === sectionId);
        if (!section) return;

        let initialProps: Record<string, unknown> = { text: "Haz clic para editar" };
        if (componentType === 'video') initialProps = { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ' };
        if (componentType === 'html') initialProps = { html: '<div class="p-4 bg-gray-100 rounded text-center">Custom HTML</div>' };
        if (componentType === 'navigation') initialProps = { links: 'Inicio,/\nNosotros,/nosotros\nContacto,/contacto' };
        if (componentType === 'button') initialProps = { text: 'Haz clic aquí', actionType: 'none', actionTarget: '' };
        if (componentType === 'gallery') initialProps = { images: 'https://placehold.co/400x300?text=Img1,https://placehold.co/400x300?text=Img2,https://placehold.co/400x300?text=Img3', columns: 3 };
        if (componentType === 'form') initialProps = { buttonText: 'Enviar', emailTo: 'contacto@empresa.com' };

        const newComponent: Component = {
            id: `comp-${Date.now()}`,
            type: componentType as "heading" | "paragraph" | "button" | "image" | "html" | "video" | "navigation" | "gallery" | "form",
            name: `Elemento ${componentType}`,
            props: initialProps,
            styles: {},
            responsive: { desktop: { visible: true }, tablet: { visible: true }, mobile: { visible: true } },
            order: section.components.length,
            column: columnIndex
        };
        section.components.push(newComponent);
    })),

    updateComponentProps: (componentId, props) => set(produce((state: CanvasStoreState) => {
        if (!state.portal) return;
        state.portal.pages.forEach(page => {
            page.sections.forEach(section => {
                const compIndex = section.components.findIndex(c => c.id === componentId);
                if (compIndex !== -1) {
                    section.components[compIndex].props = { ...section.components[compIndex].props, ...props };
                }
            });
        });
    })),

    updateComponentStyles: (componentId, styles) => set(produce((state: CanvasStoreState) => {
        if (!state.portal) return;
        state.portal.pages.forEach(page => {
            page.sections.forEach(section => {
                const compIndex = section.components.findIndex(c => c.id === componentId);
                if (compIndex !== -1) {
                    section.components[compIndex].styles = { ...section.components[compIndex].styles, ...styles };
                }
            });
        });
    })),

    addSection: (pageId, section) => set(produce((state: CanvasStoreState) => {
        if (!state.portal) return;
        const page = state.portal.pages.find(p => p.id === pageId);
        if (page) {
            page.sections.push(section);
        }
    })),

    addComponentToSection: (sectionId, component) => set(produce((state: CanvasStoreState) => {
        if (!state.portal) return;
        for (const page of state.portal.pages) {
            const section = page.sections.find(s => s.id === sectionId);
            if (section) {
                section.components.push(component);
                return;
            }
        }
    })),

    reorderSections: (pageId, oldIndex, newIndex) => set(produce((state: CanvasStoreState) => {
        if (!state.portal) return;
        const page = state.portal.pages.find(p => p.id === pageId);
        if (page && oldIndex >= 0 && oldIndex < page.sections.length && newIndex >= 0 && newIndex < page.sections.length) {
            const [movedSection] = page.sections.splice(oldIndex, 1);
            page.sections.splice(newIndex, 0, movedSection);
        }
    })),

    updateSectionProps: (sectionId, props) => set(produce((state: CanvasStoreState) => {
        if (!state.portal) return;
        state.portal.pages.forEach(page => {
            const sectionIndex = page.sections.findIndex(s => s.id === sectionId);
            if (sectionIndex !== -1) {
                // Hacemos merge de las props antiguas con las entrantes (ej: { columns: 3 })
                Object.assign(page.sections[sectionIndex], props);
            }
        });
    })),

    updateSectionStyles: (sectionId, styles) => set(produce((state: CanvasStoreState) => {
        if (!state.portal) return;
        state.portal.pages.forEach(page => {
            const section = page.sections.find(s => s.id === sectionId);
            if (section) {
                section.styles = { ...section.styles, ...styles };
            }
        });
    })),

    updatePageProps: (pageId, props) => set(produce((state: CanvasStoreState) => {
        if (!state.portal) return;
        const pageIndex = state.portal.pages.findIndex(p => p.id === pageId);
        if (pageIndex !== -1) {
            Object.assign(state.portal.pages[pageIndex], props);
        }
    })),

    updateGlobalStyles: (styles) => set(produce((state: CanvasStoreState) => {
        if (!state.portal) return;
        state.portal.globalStyles = { ...state.portal.globalStyles, ...styles };
    })),

    updateColorPalette: (palette) => set(produce((state: CanvasStoreState) => {
        if (!state.portal) return;
        Object.entries(palette).forEach(([key, value]) => {
            if (value !== undefined) {
                state.portal!.settings.colorPalette[key] = value;
            }
        });
    })),
}));


