'use client';

import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';

export const SidebarRight = () => {
    const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);

    return (
        <aside className="w-72 bg-white border-l border-slate-200 flex flex-col h-full flex-shrink-0">
            <div className="h-14 border-b border-slate-200 flex items-center px-4">
                <h2 className="font-semibold text-sm text-slate-800">Inspector</h2>
            </div>

            <div className="p-4 overflow-y-auto">
                {selectedComponentId ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">ID del Componente</label>
                            <div className="text-sm font-mono text-slate-800 truncate bg-slate-100 p-2 rounded border border-slate-200">
                                {selectedComponentId}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Propiedades base</label>
                            <div className="text-sm text-slate-500 italic">Editor de propiedades pendiente de mapear el UI json...</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">
                        <p className="text-sm">Selecciona un elemento en el canvas para ver sus propiedades</p>
                    </div>
                )}
            </div>
        </aside>
    );
};
