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
    addSidebarComponentToCanvas: (componentType: string) => void;

    // Modifiers
    updateComponentProps: (componentId: string, props: Record<string, any>) => void;
    addSection: (pageId: string, section: Section) => void;
    addComponentToSection: (sectionId: string, component: Component) => void;
    reorderSections: (pageId: string, oldIndex: number, newIndex: number) => void;
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

    addSidebarComponentToCanvas: (componentType) => set(produce((state: CanvasStoreState) => {
        if (!state.portal || !state.activePageId) return;
        const page = state.portal.pages.find(p => p.id === state.activePageId);
        if (!page) return;

        // Asegurarnos de que haya al menos una sección constructiva
        if (page.sections.length === 0) {
            page.sections.push({
                id: `section-${Date.now()}`,
                name: "Sección Principal",
                type: "content",
                columns: 1,
                components: [],
                styles: { padding: {}, margin: {} },
                responsive: { desktop: { visible: true }, tablet: { visible: true }, mobile: { visible: true } }
            });
        }

        const targetSection = page.sections[0]; // Sembrar en la primera sección
        const newComponent: Component = {
            id: `comp-${Date.now()}`,
            type: componentType as any,
            name: `Elemento ${componentType}`,
            props: { text: "Haz clic para editar" },
            styles: {},
            responsive: { desktop: { visible: true }, tablet: { visible: true }, mobile: { visible: true } },
            order: targetSection.components.length
        };
        targetSection.components.push(newComponent);
    })),

    updateComponentProps: (componentId, props) => set(produce((state: CanvasStoreState) => {
        if (!state.portal) return;
        // Helper to find and update component deeply (implementation draft)
        state.portal.pages.forEach(page => {
            page.sections.forEach(section => {
                const compIndex = section.components.findIndex(c => c.id === componentId);
                if (compIndex !== -1) {
                    section.components[compIndex].props = { ...section.components[compIndex].props, ...props };
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
}));
