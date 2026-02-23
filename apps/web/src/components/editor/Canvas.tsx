'use client';

import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useDroppable } from '@dnd-kit/core';

export const Canvas = () => {
    const portal = useCanvasStore((state) => state.portal);
    const activePageId = useCanvasStore((state) => state.activePageId);
    const selectComponent = useCanvasStore((state) => state.selectComponent);
    const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);

    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-droppable-area',
    });

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
                <div className="space-y-4">
                    {portal.pages.find(p => p.id === activePageId)?.sections.map(section => (
                        <div key={section.id} className="border border-slate-300 p-4 min-h-[100px] rounded-md bg-slate-50 relative">
                            <h4 className="absolute -top-3 left-4 bg-white px-2 py-0.5 border border-slate-200 text-xs text-slate-400 rounded-md font-medium">{section.name}</h4>
                            <div className="space-y-2 mt-2">
                                {section.components.map(comp => (
                                    <div
                                        key={comp.id}
                                        className={`p-3 bg-white shadow-sm border rounded text-sm cursor-pointer transition-colors ${selectedComponentId === comp.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-blue-300'}`}
                                        onClick={(e) => { e.stopPropagation(); selectComponent(comp.id); }}
                                    >
                                        <strong className="uppercase text-xs text-slate-500 block mb-1">{comp.type}</strong>
                                        <div className="text-slate-800">{comp.props.text || comp.name}</div>
                                    </div>
                                ))}
                                {section.components.length === 0 && (
                                    <div className="text-slate-400 text-xs italic p-2 rounded bg-slate-100/50">Sección vacía</div>
                                )}
                            </div>
                        </div>
                    ))}

                    {portal.pages.find(p => p.id === activePageId)?.sections.length === 0 && (
                        <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 py-32 border-2 border-dashed border-slate-300 rounded-lg pointer-events-none">
                            <p className="text-lg font-medium mb-2">Suelta componentes aquí</p>
                            <p className="text-sm">Se creará una sección automáticamente al soltar tu primer elemento.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
