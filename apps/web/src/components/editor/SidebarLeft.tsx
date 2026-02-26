'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useCanvasStore } from '../../store/canvasStore';
import {
    Layout,
    Columns,
    PanelBottom,
    Type,
    AlignLeft,
    MousePointer,
    Image as ImageIcon,
    Video,
    Code,
    Navigation,
    LayoutGrid,
    FormInput
} from 'lucide-react';

interface DraggableItemProps {
    id: string;
    label: string;
    dragType: 'structural' | 'content';
    componentType: string;
    icon?: React.ReactNode;
}

const DraggableItem = ({ id, label, dragType, componentType, icon }: DraggableItemProps) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id,
        data: { dragType, componentType }
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="flex flex-col items-center justify-center gap-2 border border-[#1e293b] rounded-lg p-3 text-center cursor-grab active:cursor-grabbing hover:border-[#3b82f6] hover:bg-[#1e293b] transition-all bg-[#0b1120] relative z-50 touch-none group"
        >
            <div className="text-slate-400 group-hover:text-white transition-colors">
                {icon}
            </div>
            <span className="text-[10px] text-slate-400 font-medium group-hover:text-white transition-colors">{label}</span>
        </div>
    );
};

export const SidebarItemOverlay = ({ label }: { label: string }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-2 border border-[#3b82f6] rounded-lg p-3 w-20 text-center bg-[#1e293b] shadow-xl shadow-blue-900/20 opacity-90 cursor-grabbing relative z-[9999] pointer-events-none">
            <span className="text-[10px] text-white font-medium">{label}</span>
        </div>
    );
};

export const SidebarLeft = () => {
    const portal = useCanvasStore((state) => state.portal);
    const activePageId = useCanvasStore((state) => state.activePageId);
    const setActivePage = useCanvasStore((state) => state.setActivePage);

    return (
        <aside className="w-64 bg-[#0f172a] border-r border-[#1e293b] flex flex-col h-full flex-shrink-0">
            <div className="h-14 border-b border-[#1e293b] flex items-center px-4 bg-[#0b1120]">
                <h2 className="font-semibold text-sm text-white">Componentes y Páginas</h2>
            </div>

            <div className="p-4 space-y-8 overflow-y-auto custom-scrollbar">
                <div>
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Páginas</h3>
                    {portal && portal.pages.length > 0 ? (
                        <div className="space-y-1">
                            {portal.pages.map((page) => (
                                <div
                                    key={page.id}
                                    onClick={() => setActivePage(page.id)}
                                    className={`px-3 py-2 text-xs rounded-md cursor-pointer transition-colors ${activePageId === page.id ? 'bg-[#3b82f6]/10 text-[#3b82f6] font-medium border border-[#3b82f6]/20' : 'text-slate-400 hover:bg-[#1e293b] hover:text-white border border-transparent'}`}
                                >
                                    {page.slug === '/' ? 'Inicio (/)' : page.name}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs text-slate-500 italic p-3 bg-[#0b1120] border border-[#1e293b] rounded-md text-center">
                            Sin portal inicializado
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Estructura</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <DraggableItem id="drag-section" label="Sección" dragType="structural" componentType="section" icon={<Layout size={18} strokeWidth={1.5} />} />
                        <DraggableItem id="drag-columns" label="Column" dragType="structural" componentType="columns" icon={<Columns size={18} strokeWidth={1.5} />} />
                        <DraggableItem id="drag-footer" label="Footer" dragType="structural" componentType="footer" icon={<PanelBottom size={18} strokeWidth={1.5} />} />
                    </div>
                </div>

                <div>
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Básicos</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <DraggableItem id="drag-title" label="Título" dragType="content" componentType="heading" icon={<Type size={18} strokeWidth={1.5} />} />
                        <DraggableItem id="drag-text" label="Texto" dragType="content" componentType="paragraph" icon={<AlignLeft size={18} strokeWidth={1.5} />} />
                        <DraggableItem id="drag-button" label="Botón" dragType="content" componentType="button" icon={<MousePointer size={18} strokeWidth={1.5} />} />
                        <DraggableItem id="drag-image" label="Imagen" dragType="content" componentType="image" icon={<ImageIcon size={18} strokeWidth={1.5} />} />
                        <DraggableItem id="drag-video" label="Video" dragType="content" componentType="video" icon={<Video size={18} strokeWidth={1.5} />} />
                        <DraggableItem id="drag-html" label="HTML" dragType="content" componentType="html" icon={<Code size={18} strokeWidth={1.5} />} />
                        <DraggableItem id="drag-navigation" label="Nav" dragType="content" componentType="navigation" icon={<Navigation size={18} strokeWidth={1.5} />} />
                        <DraggableItem id="drag-gallery" label="Galería" dragType="content" componentType="gallery" icon={<LayoutGrid size={18} strokeWidth={1.5} />} />
                        <DraggableItem id="drag-form" label="Form" dragType="content" componentType="form" icon={<FormInput size={18} strokeWidth={1.5} />} />
                    </div>
                </div>
            </div>
        </aside>
    );
};
