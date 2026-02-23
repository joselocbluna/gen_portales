'use client';

import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { DndContext, useDroppable } from '@dnd-kit/core';

export const Canvas = () => {
    const portal = useCanvasStore((state) => state.portal);
    const selectComponent = useCanvasStore((state) => state.selectComponent);

    const { setNodeRef } = useDroppable({
        id: 'canvas-droppable-area',
    });

    return (
        <DndContext onDragEnd={(event) => console.log('Dropped!', event)}>
            <div
                ref={setNodeRef}
                className="bg-white min-h-[800px] w-full max-w-5xl shadow-md rounded border border-slate-200 p-4 transition-all"
                onClick={() => selectComponent(null)}
            >
                {!portal ? (
                    <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 py-32 border-2 border-dashed border-slate-300 rounded-lg">
                        <p className="text-lg font-medium mb-2">El lienzo está vacío</p>
                        <p className="text-sm">Arrastra componentes desde el panel izquierdo para comenzar a diseñar.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Aquí iteraríamos sobre portal.pages[activePageId].sections y renderizaríamos Droppable zones */}
                        Renderizador de elementos de portal...
                    </div>
                )}
            </div>
        </DndContext>
    );
};
