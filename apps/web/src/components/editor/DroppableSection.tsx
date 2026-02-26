/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { Section, Component as PortalComponent } from '@generador/shared';
import { useCanvasStore } from '../../store/canvasStore';

interface DroppableColumnProps {
    sectionId: string;
    columnIndex: number;
    components: PortalComponent[];
}

const renderComponentPreview = (comp: PortalComponent) => {
    const styleObj = {
        textAlign: comp.styles?.textAlign as React.CSSProperties['textAlign'],
        color: comp.styles?.color,
        fontSize: comp.styles?.fontSize,
    };

    switch (comp.type) {
        case 'heading':
            return <h2 className="text-2xl font-bold" style={styleObj}>{comp.props.text || 'Sin texto'}</h2>;
        case 'paragraph':
            return <p className="text-base leading-relaxed" style={styleObj}>{comp.props.text || 'Sin texto'}</p>;
        case 'button':
            return (
                <div style={{ textAlign: (comp.styles?.textAlign as React.CSSProperties['textAlign']) || 'left' }} className="w-full">
                    <button className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-sm pointer-events-none relative" style={{ fontSize: comp.styles?.fontSize, backgroundColor: comp.styles?.backgroundColor || '#2563eb', color: comp.styles?.color || '#ffffff' }}>
                        {comp.props.text || 'Botón'}
                        {comp.props.actionType && comp.props.actionType !== 'none' && (
                            <span className="absolute -top-2 -right-2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded-full z-10">
                                {comp.props.actionType === 'link' ? '🔗' : '⚡️'}
                            </span>
                        )}
                    </button>
                </div>
            );
        case 'navigation':
            const links = comp.props.links ? comp.props.links.split('\n').map((l: string) => l.split(',')) : [];
            return (
                <nav className="flex flex-wrap gap-4 items-center justify-between w-full" style={styleObj}>
                    <div className="flex gap-4">
                        {links.map(([text]: string[], idx: number) => (
                            <a key={idx} href="#" onClick={e => e.preventDefault()} className="hover:underline font-medium">
                                {text || 'Link'}
                            </a>
                        ))}
                    </div>
                </nav>
            );
        case 'image':
            return (
                <img
                    src={comp.props?.src || 'https://via.placeholder.com/600x400'}
                    alt={comp.props?.alt || 'preview'}
                    className="w-full max-h-[400px] object-cover rounded-md pointer-events-none border border-slate-100 shadow-sm"
                />
            );
        case 'video':
            return (
                <div className="relative w-full rounded overflow-hidden pointer-events-none outline outline-1 outline-slate-200" style={{ paddingTop: '56.25%' }}>
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={comp.props?.src || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                        frameBorder="0"
                    ></iframe>
                </div>
            );
        case 'html':
            return (
                <div
                    className="w-full pointer-events-none"
                    dangerouslySetInnerHTML={{ __html: comp.props?.html || '<div class="p-4 bg-slate-50 text-center text-slate-500 rounded border border-dashed border-slate-300">Bloque HTML (Vacío)</div>' }}
                />
            );
        case 'gallery':
            const galleryCols = comp.props.columns || 3;
            const images = comp.props.images ? comp.props.images.split(',') : [];
            return (
                <div className={`grid gap-2 grid-cols-${galleryCols} pointer-events-none`}>
                    {images.map((img: string, i: number) => (
                        <div key={i} className="aspect-square bg-slate-100 rounded overflow-hidden">
                            <img src={img.trim()} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            );
        case 'form':
            return (
                <div className="flex flex-col gap-3 p-4 border border-slate-200 rounded-lg bg-white pointer-events-none shadow-sm">
                    <div className="font-semibold text-slate-700 text-sm mb-2">Formulario de Contacto</div>
                    <input type="text" placeholder="Nombre completo" className="w-full border p-2 rounded text-sm bg-slate-50" readOnly />
                    <input type="email" placeholder="Correo electrónico" className="w-full border p-2 rounded text-sm bg-slate-50" readOnly />
                    <textarea placeholder="Mensaje..." className="w-full border p-2 rounded text-sm bg-slate-50 min-h-[80px]" readOnly />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm mt-2">{comp.props.buttonText || 'Enviar'}</button>
                </div>
            );
        default:
            return <div className="text-slate-800 leading-tight truncate">{comp.props.text || comp.name}</div>;
    }
};

const DroppableColumn = ({ sectionId, columnIndex, components }: DroppableColumnProps) => {
    const selectComponent = useCanvasStore((state) => state.selectComponent);
    const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);

    const { setNodeRef, isOver } = useDroppable({
        id: `droppable-column-${sectionId}-${columnIndex}`,
    });

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[100px] p-2 rounded-lg transition-all flex flex-col gap-2 ${isOver ? 'bg-blue-900/20 ring-2 ring-blue-500/50' : 'bg-transparent border border-transparent hover:border-[#334155] border-dashed'
                }`}
        >
            {components.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-xs italic text-center rounded bg-[#0b1120] border border-[#1e293b] border-dashed">
                    Soltar elementos aquí
                </div>
            ) : (
                components.map(comp => (
                    <div
                        key={comp.id}
                        style={{ backgroundColor: comp.styles?.backgroundColor || '#ffffff' }}
                        className={`relative group rounded-md cursor-pointer transition-all ${selectedComponentId === comp.id ? 'ring-2 ring-blue-500 shadow-xl shadow-blue-900/10' : 'ring-1 ring-[#1e293b] hover:ring-blue-500/50 hover:shadow-lg'
                            }`}
                        onClick={(e) => { e.stopPropagation(); selectComponent(comp.id); }}
                    >
                        {/* Indicador de Tipo (Visible al pasar el mouse o seleccionado) */}
                        <div className={`absolute -top-2.5 left-3 bg-[#0b1120] px-2 rounded-full border text-[9px] uppercase font-bold tracking-wider z-10 transition-opacity ${selectedComponentId === comp.id ? 'opacity-100 border-blue-500 text-blue-400' : 'opacity-0 group-hover:opacity-100 border-[#334155] text-slate-400'}`}>
                            {comp.type}
                        </div>

                        {/* Contenedor del Preview WYSIWYG */}
                        <div className="p-4">
                            {renderComponentPreview(comp)}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

interface DroppableSectionProps {
    section: Section;
}

export const DroppableSection = ({ section }: DroppableSectionProps) => {
    const selectComponent = useCanvasStore((state) => state.selectComponent);
    const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);

    // Habilitar Sortable
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: section.id,
        data: {
            type: 'Section',
            section
        }
    });

    // Mapeo seguro de grid cols de Tailwind
    const gridColsMap: Record<number, string> = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    };

    const gridColsClass = gridColsMap[section.columns] || 'grid-cols-1';

    // Generar estilos CSS de transformación (translate) requeridos por el dnd-kit
    const style: React.CSSProperties = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : 1,
        backgroundColor: section.styles?.backgroundColor || 'transparent',
        backgroundImage: section.styles?.backgroundImage ? `url(${section.styles.backgroundImage})` : undefined,
        backgroundSize: section.styles?.backgroundImage ? 'cover' : undefined,
        backgroundPosition: section.styles?.backgroundImage ? 'center' : undefined,
        paddingTop: section.styles?.padding?.top || '1rem',
        paddingBottom: section.styles?.padding?.bottom || '1rem',
        marginTop: section.styles?.margin?.top || '0',
        marginBottom: section.styles?.margin?.bottom || '0',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`border border-[#1e293b] bg-[#020617] p-4 rounded-xl relative shadow-md transition-all hover:border-[#334155] ${selectedComponentId === section.id ? 'ring-2 ring-blue-500 border-transparent' : ''
                }`}
            onClick={(e) => { e.stopPropagation(); selectComponent(section.id); }}
        >
            {/* Cabecera / Asa de Arrastre (Drag Handle) */}
            <div
                {...attributes}
                {...listeners}
                className="absolute -top-3 left-4 bg-[#0b1120] px-2 py-0.5 border border-[#1e293b] text-[10px] uppercase tracking-wider text-slate-400 rounded-md cursor-grab active:cursor-grabbing hover:bg-[#1e293b] hover:text-blue-400 transition-colors flex items-center gap-1 shadow-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor" className="text-slate-400">
                    <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {section.name} {section.columns > 1 ? `(${section.columns} cols)` : ''}
            </div>

            {/* Sub-Contenedor Grid Dinámico */}
            <div className={`mt-3 grid gap-4 w-full ${gridColsClass}`}>
                {Array.from({ length: section.columns }).map((_, colIndex) => {
                    const columnComponents = section.components.filter(
                        c => (c.column === undefined ? 0 : c.column) === colIndex
                    );

                    return (
                        <DroppableColumn
                            key={`${section.id}-col-${colIndex}`}
                            sectionId={section.id}
                            columnIndex={colIndex}
                            components={columnComponents}
                        />
                    );
                })}
            </div>
        </div>
    );
};
