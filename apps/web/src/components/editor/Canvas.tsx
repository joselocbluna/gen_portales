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
            className={`min-h-[800px] w-full max-w-5xl shadow-2xl rounded-lg border p-4 transition-all ${isOver ? 'border-blue-500 ring-4 ring-blue-900/20' : 'border-[#1e293b] shadow-black/50'} relative mx-auto`}
            style={{
                backgroundColor: portal?.globalStyles?.bodyBackground || '#ffffff',
                color: portal?.settings?.colorPalette?.text || 'inherit'
            }}
            onClick={() => selectComponent(null)}
        >
            {!portal ? (
                <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 py-32 border-2 border-dashed border-[#334155] rounded-xl pointer-events-none bg-[#0f172a]/20">
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
                            <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 py-32 border-2 border-dashed border-[#334155] rounded-xl pointer-events-none bg-[#0f172a]/20">
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
