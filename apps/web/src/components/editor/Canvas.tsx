'use client';

import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DroppableSection } from './DroppableSection';

export const Canvas = () => {
    const portal = useCanvasStore((state) => state.portal);
    const activePageId = useCanvasStore((state) => state.activePageId);
    const selectComponent = useCanvasStore((state) => state.selectComponent);

    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-droppable-area',
    });

    const activePageSections = portal?.pages.find(p => p.id === activePageId)?.sections || [];

    return (
        <div
            ref={setNodeRef}
            className={`bg-white min-h-[800px] w-full max-w-5xl shadow-md rounded border p-4 transition-all ${isOver ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}
            onClick={() => selectComponent(null)}
        >
            {!portal ? (
                <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 py-32 border-2 border-dashed border-slate-300 rounded-lg pointer-events-none">
                    <p className="text-lg font-medium mb-2">El lienzo está vacío</p>
                    <p className="text-sm">Arrastra componentes desde el panel izquierdo para comenzar a diseñar.</p>
                </div>
            ) : (
                <SortableContext
                    items={activePageSections.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4 min-h-[500px]">
                        {activePageSections.map(section => (
                            <DroppableSection key={section.id} section={section} />
                        ))}

                        {activePageSections.length === 0 && (
                            <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 py-32 border-2 border-dashed border-slate-300 rounded-lg pointer-events-none">
                                <p className="text-lg font-medium mb-2">Suelta Estructuras aquí</p>
                                <p className="text-sm">Arrastra una Sección o Columnas desde el panel izquierdo.</p>
                            </div>
                        )}
                    </div>
                </SortableContext>
            )}
        </div>
    );
};
