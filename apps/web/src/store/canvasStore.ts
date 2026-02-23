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

    // Modifiers
    updateComponentProps: (componentId: string, props: Record<string, any>) => void;
    addSection: (pageId: string, section: Section) => void;
    addComponentToSection: (sectionId: string, component: Component) => void;
    reorderSections: (pageId: string, oldIndex: number, newIndex: number) => void;
}

export const useCanvasStore = create<CanvasStoreState>((set) => ({
    portal: null,
    activePageId: null,
    selectedComponentId: null,

    initPortal: (portal) => set({ portal, activePageId: portal.pages[0]?.id || null }),

    setActivePage: (pageId) => set({ activePageId: pageId }),

    selectComponent: (componentId) => set({ selectedComponentId: componentId }),

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
