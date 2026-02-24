import React, { useState, useEffect, useMemo } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { Component, Section } from '@generador/shared';

export const SidebarRight = () => {
    const portal = useCanvasStore((state) => state.portal);
    const activePageId = useCanvasStore((state) => state.activePageId);
    const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);
    const updateComponentProps = useCanvasStore((state) => state.updateComponentProps);
    const updateSectionProps = useCanvasStore((state) => state.updateSectionProps);

    const selectedItem = useMemo(() => {
        if (!portal || !activePageId || !selectedComponentId) return null;
        const page = portal.pages.find(p => p.id === activePageId);
        if (!page) return null;

        const section = page.sections.find(s => s.id === selectedComponentId);
        if (section) return { type: 'section' as const, data: section };

        for (const s of page.sections) {
            const component = s.components.find(c => c.id === selectedComponentId);
            if (component) return { type: 'component' as const, data: component };
        }
        return null;
    }, [portal, activePageId, selectedComponentId]);

    // Estado local para los inputs
    const [localText, setLocalText] = useState('');

    // Sincronizar el estado local cuando cambia el item seleccionado
    useEffect(() => {
        if (selectedItem?.type === 'component') {
            const comp = selectedItem.data as Component;
            setLocalText(comp.props?.text || '');
        }
    }, [selectedItem]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLocalText(e.target.value);
    };

    const handleTextBlur = () => {
        if (selectedItem?.type === 'component' && selectedComponentId) {
            updateComponentProps(selectedComponentId, { text: localText });
        }
    };

    if (!selectedComponentId || !selectedItem) {
        return (
            <aside className="w-72 bg-white border-l border-slate-200 flex flex-col h-full flex-shrink-0">
                <div className="h-14 border-b border-slate-200 flex items-center px-4">
                    <h2 className="font-semibold text-sm text-slate-800">Inspector</h2>
                </div>
                <div className="p-4 overflow-y-auto">
                    <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">
                        <p className="text-sm">Selecciona un elemento en el canvas para ver sus propiedades</p>
                    </div>
                </div>
            </aside>
        );
    }

    const { type, data } = selectedItem;

    return (
        <aside className="w-72 bg-white border-l border-slate-200 flex flex-col h-full flex-shrink-0">
            <div className="h-14 border-b border-slate-200 flex items-center px-4">
                <h2 className="font-semibold text-sm text-slate-800">Inspector</h2>
            </div>

            <div className="p-4 overflow-y-auto">
                <div className="space-y-6">
                    {/* Sección General */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">General</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Tipo</label>
                                <div className="text-sm font-medium text-slate-800 capitalize">
                                    {type === 'section' ? `Sección ${(data as Section).type}` : `Componente ${(data as Component).type}`}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">ID</label>
                                <div className="text-xs font-mono text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100 truncate">
                                    {data.id}
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Propiedades Dinámicas */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Propiedades</h3>

                        {type === 'component' && (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Columna</label>
                                    <div className="text-sm font-medium text-slate-800 capitalize">
                                        {(data as Component).column !== undefined ? (data as Component).column! + 1 : 1}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Texto</label>
                                    {(data as Component).type === 'paragraph' ? (
                                        <textarea
                                            value={localText}
                                            onChange={handleTextChange}
                                            onBlur={handleTextBlur}
                                            className="w-full text-sm p-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                                            placeholder="Ingresa el contenido..."
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={localText}
                                            onChange={handleTextChange}
                                            onBlur={handleTextBlur}
                                            className="w-full text-sm p-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ingresa el texto..."
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {type === 'section' && (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Columnas de Distribución</label>
                                    <select
                                        value={(data as Section).columns || 1}
                                        onChange={(e) => updateSectionProps(selectedComponentId, { columns: parseInt(e.target.value, 10) })}
                                        className="w-full text-sm p-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value={1}>1 Columna (Ancho Completo)</option>
                                        <option value={2}>2 Columnas (Mitad y Mitad)</option>
                                        <option value={3}>3 Columnas</option>
                                        <option value={4}>4 Columnas</option>
                                    </select>
                                </div>
                                <div className="text-xs text-slate-400 mt-2">
                                    Al cambiar el número de columnas, el Layout de las grillas del Canvas se ajustará automáticamente reacomodando sus bloques internos.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside >
    );
};
