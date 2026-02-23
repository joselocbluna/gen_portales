'use client';

import React from 'react';
import { SidebarLeft } from './SidebarLeft';
import { SidebarRight } from './SidebarRight';
import { Canvas } from './Canvas';
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SidebarItemOverlay } from './SidebarLeft';
import { useCanvasStore } from '../../store/canvasStore';

export const EditorLayout = () => {
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const addSidebarComponentToCanvas = useCanvasStore((state) => state.addSidebarComponentToCanvas);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && over.id === 'canvas-droppable-area') {
            const typeStr = (active.id as string).replace('drag-', '');
            addSidebarComponentToCanvas(typeStr);
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

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
                {/* Columna Izquierda: Elementos / Catálogo */}
                <SidebarLeft />

                {/* Columna Central: El Canvas Interactivo interactuando con dnd-kit */}
                <main className="flex-1 flex flex-col relative">
                    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 justify-between">
                        <div className="font-semibold text-slate-700">Editor de Portales</div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 transition-colors">
                                Previsualizar
                            </button>
                            <button className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors">
                                Guardar Cambios
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
