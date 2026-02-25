'use client';

import React from 'react';
import { SidebarLeft } from './SidebarLeft';
import { SidebarRight } from './SidebarRight';
import { Canvas } from './Canvas';
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SidebarItemOverlay } from './SidebarLeft';
import { useCanvasStore } from '../../store/canvasStore';

export const EditorLayout = ({ portalId }: { portalId: string }) => {
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const addSectionFromDrag = useCanvasStore((state) => state.addSectionFromDrag);
    const addComponentFromDrag = useCanvasStore((state) => state.addComponentFromDrag);
    const reorderSections = useCanvasStore((state) => state.reorderSections);
    const portal = useCanvasStore((state) => state.portal);
    const activePageId = useCanvasStore((state) => state.activePageId);
    const initPortal = useCanvasStore((state) => state.initPortal);
    const [isLoadingUrl, setIsLoadingUrl] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isGenerating, setIsGenerating] = React.useState(false);

    React.useEffect(() => {
        if (!portalId) return;
        setIsLoadingUrl(true);
        fetch(`http://localhost:3002/proyectos/${portalId}/state`)
            .then(res => res.json())
            .then(data => {
                if (data && data.id) {
                    initPortal(data);
                }
            })
            .catch(err => console.error("Error cargando portal:", err))
            .finally(() => setIsLoadingUrl(false));
    }, [portalId, initPortal]);

    const handleSave = async () => {
        if (!portal) return;
        setIsSaving(true);
        try {
            const res = await fetch(`http://localhost:3002/proyectos/${portalId}/state`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(portal)
            });
            if (res.ok) {
                alert('Portal guardado exitosamente.');
            } else {
                alert('Error al guardar el portal.');
            }
        } catch (error) {
            console.error('Error guardando:', error);
            alert('Fallo de red al guardar.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateAstro = async () => {
        if (!portal) return;
        setIsGenerating(true);
        try {
            const res = await fetch('http://localhost:3002/generador/build', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(portal)
            });
            const data = await res.json();
            if (res.ok && data?.message) {
                alert(`¡Éxito! ${data.message}\nUbicación: ${data.path || ''}`);
            } else {
                alert(`Error del generador: ${data?.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error invocando motor astro:', error);
            alert('Fallo de red al conectar con el API del Generador.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!active || !over) return;

        const dragData = active.data.current as { dragType: 'structural' | 'content', componentType: string } | undefined;
        if (!dragData) return;

        // Regla 1: Drop estructural sobre el Canvas general
        if (dragData.dragType === 'structural' && over.id === 'canvas-droppable-area') {
            addSectionFromDrag(dragData.componentType);
            return;
        }

        // Regla 2: Drop de contenido sobre una columna de una sección
        if (dragData.dragType === 'content' && typeof over.id === 'string' && over.id.startsWith('droppable-column-')) {
            // over.id format: droppable-column-{sectionId}-{columnIndex}
            const parts = over.id.replace('droppable-column-', '').split('-');
            if (parts.length >= 2) {
                const columnIndex = parseInt(parts.pop() || '0', 10);
                const sectionId = parts.join('-'); // El sectionId podría contener guiones
                addComponentFromDrag(sectionId, dragData.componentType, columnIndex);
            }
            return;
        }

        // Regla 3: Reordenamiento interno de Secciones (Sortable)
        if (active.data.current?.type === 'Section' && active.id !== over.id) {
            const page = portal?.pages.find(p => p.id === activePageId);
            if (page) {
                const oldIndex = page.sections.findIndex(s => s.id === active.id);
                const newIndex = page.sections.findIndex(s => s.id === over.id);
                if (oldIndex !== -1 && newIndex !== -1) {
                    reorderSections(activePageId!, oldIndex, newIndex);
                }
            }
            return;
        }
    };

    const getActiveLabel = (id: string | null) => {
        if (!id) return '';
        const map: Record<string, string> = {
            'drag-section': 'Sección',
            'drag-columns': 'Columnas',
            'drag-title': 'Título',
            'drag-text': 'Texto',
            'drag-button': 'Botón',
            'drag-image': 'Imagen'
        };
        return map[id] || id;
    };

    const dndId = React.useId();

    return (
        <DndContext id={dndId} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
                {/* Columna Izquierda: Elementos / Catálogo */}
                <SidebarLeft />

                {/* Columna Central: El Canvas Interactivo interactuando con dnd-kit */}
                <main className="flex-1 flex flex-col relative">
                    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 justify-between">
                        <div className="font-semibold text-slate-700">Editor de Portales</div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={isSaving || isLoadingUrl}
                                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${isSaving ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 font-medium shadow-sm text-white'}`}
                            >
                                {isSaving ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 transition-colors">
                                Previsualizar
                            </button>
                            <button
                                onClick={handleGenerateAstro}
                                disabled={isGenerating || isLoadingUrl}
                                className={`px-3 py-1.5 text-sm rounded-md text-white transition-colors ${isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 font-medium shadow-sm'}`}
                            >
                                {isGenerating ? 'Generando Astro...' : 'Exportar a Astro'}
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-auto p-8 relative flex justify-center w-full">
                        <Canvas />
                    </div>
                </main>

                {/* Columna Derecha: Inspector de Propiedades */}
                <SidebarRight />
            </div>

            <DragOverlay dropAnimation={null}>
                {activeId ? <SidebarItemOverlay label={getActiveLabel(activeId)} /> : null}
            </DragOverlay>
        </DndContext>
    );
};
