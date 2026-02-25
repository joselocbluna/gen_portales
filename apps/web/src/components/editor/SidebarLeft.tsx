'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useCanvasStore } from '../../store/canvasStore';

interface DraggableItemProps {
    id: string;
    label: string;
    dragType: 'structural' | 'content';
    componentType: string;
}

const DraggableItem = ({ id, label, dragType, componentType }: DraggableItemProps) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id,
        data: { dragType, componentType }
    });

    // NOTA: Ignoramos `transform` aquí para que el elemento original de la barra lateral NO SE MUEVA
    const style = undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="border border-slate-200 rounded p-3 text-center cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-sm transition-all bg-slate-50 relative z-50 touch-none"
        >
            <span className="text-xs text-slate-600 font-medium">{label}</span>
        </div>
    );
};

export const SidebarItemOverlay = ({ label }: { label: string }) => {
    return (
        <div className="border border-blue-400 rounded p-3 text-center bg-white shadow-xl opacity-90 cursor-grabbing relative z-[9999] pointer-events-none">
            <span className="text-xs text-slate-700 font-medium">{label}</span>
        </div>
    );
};

export const SidebarLeft = () => {
    const portal = useCanvasStore((state) => state.portal);
    const activePageId = useCanvasStore((state) => state.activePageId);
    const setActivePage = useCanvasStore((state) => state.setActivePage);

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
            <div className="h-14 border-b border-slate-200 flex items-center px-4">
                <h2 className="font-semibold text-sm text-slate-800">Componentes y Páginas</h2>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto">
                <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Páginas</h3>
                    {portal && portal.pages.length > 0 ? (
                        <div className="space-y-1">
                            {portal.pages.map((page) => (
                                <div
                                    key={page.id}
                                    onClick={() => setActivePage(page.id)}
                                    className={`px-3 py-2 text-sm rounded cursor-pointer transition-colors ${activePageId === page.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                                >
                                    {page.slug === '/' ? 'Inicio (/)' : page.name}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs text-slate-500 italic p-2 bg-slate-50 border border-slate-200 rounded text-center">
                            Sin portal inicializado
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Estructura</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <DraggableItem id="drag-section" label="Sección" dragType="structural" componentType="section" />
                        <DraggableItem id="drag-columns" label="Columnas" dragType="structural" componentType="columns" />
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Básicos</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <DraggableItem id="drag-title" label="Título" dragType="content" componentType="heading" />
                        <DraggableItem id="drag-text" label="Texto" dragType="content" componentType="paragraph" />
                        <DraggableItem id="drag-button" label="Botón" dragType="content" componentType="button" />
                        <DraggableItem id="drag-image" label="Imagen" dragType="content" componentType="image" />
                        <DraggableItem id="drag-video" label="Video" dragType="content" componentType="video" />
                        <DraggableItem id="drag-html" label="HTML" dragType="content" componentType="html" />
                    </div>
                </div>
            </div>
        </aside>
    );
};
