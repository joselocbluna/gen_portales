'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableItemProps {
    id: string;
    label: string;
}

const DraggableItem = ({ id, label }: DraggableItemProps) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: { type: id }
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="border border-slate-200 rounded p-3 text-center cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-sm transition-all bg-slate-50 relative z-50 touch-none"
        >
            <span className="text-xs text-slate-600 font-medium">{label}</span>
        </div>
    );
};

export const SidebarLeft = () => {
    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
            <div className="h-14 border-b border-slate-200 flex items-center px-4">
                <h2 className="font-semibold text-sm text-slate-800">Componentes</h2>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
                <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Estructura</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <DraggableItem id="drag-section" label="Sección" />
                        <DraggableItem id="drag-columns" label="Columnas" />
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Básicos</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <DraggableItem id="drag-title" label="Título" />
                        <DraggableItem id="drag-text" label="Texto" />
                        <DraggableItem id="drag-button" label="Botón" />
                        <DraggableItem id="drag-image" label="Imagen" />
                    </div>
                </div>
            </div>
        </aside>
    );
};
