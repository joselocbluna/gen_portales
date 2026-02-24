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

const DroppableColumn = ({ sectionId, columnIndex, components }: DroppableColumnProps) => {
    const selectComponent = useCanvasStore((state) => state.selectComponent);
    const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);

    const { setNodeRef, isOver } = useDroppable({
        id: `droppable-column-${sectionId}-${columnIndex}`,
    });

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[100px] p-3 rounded transition-all flex flex-col gap-2 ${isOver ? 'bg-blue-50 ring-2 ring-blue-200' : 'bg-slate-50 border border-slate-200 border-dashed'
                }`}
        >
            {components.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-xs italic text-center rounded bg-slate-100/30">
                    Columna {columnIndex + 1}
                </div>
            ) : (
                components.map(comp => (
                    <div
                        key={comp.id}
                        className={`p-3 bg-white shadow-sm border rounded text-sm cursor-pointer transition-colors ${selectedComponentId === comp.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-blue-300'
                            }`}
                        onClick={(e) => { e.stopPropagation(); selectComponent(comp.id); }}
                    >
                        <strong className="uppercase text-[10px] text-slate-500 block mb-1 tracking-wider">{comp.type}</strong>
                        <div className="text-slate-800 leading-tight">{comp.props.text || comp.name}</div>
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
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`border border-slate-300 bg-white p-4 rounded-md relative shadow-sm transition-all hover:border-slate-400 ${selectedComponentId === section.id ? 'ring-2 ring-blue-500 border-transparent' : ''
                }`}
            onClick={(e) => { e.stopPropagation(); selectComponent(section.id); }}
        >
            {/* Cabecera / Asa de Arrastre (Drag Handle) */}
            <div
                {...attributes}
                {...listeners}
                className="absolute -top-3 left-4 bg-white px-2 py-0.5 border border-slate-200 text-[10px] uppercase tracking-wider text-slate-400 rounded cursor-grab active:cursor-grabbing hover:bg-slate-50 hover:text-blue-500 transition-colors flex items-center gap-1"
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
