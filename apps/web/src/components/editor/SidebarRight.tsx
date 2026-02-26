import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { Component, Section } from '@generador/shared';
import { ImageUpload } from '../ui/ImageUpload';

export const SidebarRight = () => {
    const portal = useCanvasStore((state) => state.portal);
    const activePageId = useCanvasStore((state) => state.activePageId);
    const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);
    const updateComponentProps = useCanvasStore((state) => state.updateComponentProps);
    const updateComponentStyles = useCanvasStore((state) => state.updateComponentStyles);
    const updateSectionProps = useCanvasStore((state) => state.updateSectionProps);
    const updateSectionStyles = useCanvasStore((state) => state.updateSectionStyles);

    const getSelectedItem = () => {
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
    };

    const selectedItem = getSelectedItem();

    // Estado local para los inputs
    const [localText, setLocalText] = useState('');
    const [prevSelectedId, setPrevSelectedId] = useState<string | null>(null);

    // Sincronizar el estado local cuando cambia el item seleccionado (durante el render)
    if (selectedComponentId !== prevSelectedId) {
        setPrevSelectedId(selectedComponentId);
        if (selectedItem?.type === 'component') {
            const comp = selectedItem.data as Component;
            setLocalText(comp.props?.text || '');
        } else {
            setLocalText('');
        }
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLocalText(e.target.value);
    };

    const handleTextBlur = () => {
        if (selectedItem?.type === 'component' && selectedComponentId) {
            updateComponentProps(selectedComponentId, { text: localText });
        }
    };

    const updateGlobalStyles = useCanvasStore((state) => state.updateGlobalStyles);
    const updateColorPalette = useCanvasStore((state) => state.updateColorPalette);

    const updatePageProps = useCanvasStore((state) => state.updatePageProps);

    if (!selectedComponentId || !selectedItem) {
        const activePage = portal?.pages.find(p => p.id === activePageId);

        return (
            <aside className="w-72 bg-[#0f172a] border-l border-[#1e293b] flex flex-col h-full flex-shrink-0">
                <div className="h-14 border-b border-[#1e293b] bg-[#0b1120] flex items-center px-4">
                    <h2 className="font-semibold text-sm text-white">Ajustes Generales</h2>
                </div>
                <div className="p-4 overflow-y-auto space-y-6">
                    {/* Ajustes de Pagina */}
                    {activePage && (
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Página Actual</h3>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Estructura Base (Layout)</label>
                                <select
                                    value={activePage.layout || 'default'}
                                    onChange={(e) => updatePageProps(activePage.id, { layout: e.target.value as 'default' | 'fullwidth' | 'sidebar' })}
                                    className="w-full text-sm p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="default">Por Defecto</option>
                                    <option value="fullwidth">Ancho Completo</option>
                                    <option value="sidebar">Con Barra Lateral</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <hr className="border-[#1e293b]" />

                    {/* Configuraciones Generales de la App/Portal */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Color de Fondo del Portal</h3>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={portal?.globalStyles?.bodyBackground || '#ffffff'}
                                onChange={(e) => updateGlobalStyles({ bodyBackground: e.target.value })}
                                className="w-8 h-8 rounded border border-[#334155] cursor-pointer p-0 appearance-none bg-transparent"
                            />
                            <input
                                type="text"
                                value={portal?.globalStyles?.bodyBackground || '#ffffff'}
                                onChange={(e) => updateGlobalStyles({ bodyBackground: e.target.value })}
                                className="flex-1 text-sm p-1.5 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <hr className="border-[#1e293b]" />

                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Paleta de Colores</h3>
                        <p className="text-[10px] text-slate-400 mb-4">Estos colores podrán ser usados como atajos rápidamente.</p>

                        <div className="space-y-3">
                            {['primary', 'secondary', 'accent', 'background', 'text'].map((colorKey) => (
                                <div key={colorKey}>
                                    <label className="block text-xs font-medium text-slate-400 mb-1 capitalize">{colorKey}</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={(portal?.settings?.colorPalette as Record<string, string>)?.[colorKey] || '#000000'}
                                            onChange={(e) => updateColorPalette({ [colorKey]: e.target.value })}
                                            className="w-8 h-8 rounded border border-[#334155] cursor-pointer p-0 appearance-none bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={(portal?.settings?.colorPalette as Record<string, string>)?.[colorKey] || '#000000'}
                                            onChange={(e) => updateColorPalette({ [colorKey]: e.target.value })}
                                            className="flex-1 text-sm p-1.5 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
        );
    }

    const { type, data } = selectedItem;

    const renderColorSwatches = (onSelect: (color: string) => void) => {
        const palette = portal?.settings?.colorPalette as Record<string, string>;
        if (!palette) return null;
        return (
            <div className="flex gap-1.5 mt-2">
                {['primary', 'secondary', 'accent', 'background', 'text'].map(key => {
                    const colorVal = palette[key];
                    if (!colorVal) return null;
                    return (
                        <div
                            key={key}
                            title={`Global: ${key}`}
                            onClick={() => onSelect(colorVal)}
                            className="w-5 h-5 rounded cursor-pointer border border-slate-300 shadow-sm hover:scale-110 transition-transform"
                            style={{ backgroundColor: colorVal }}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <aside className="w-72 bg-[#0f172a] border-l border-[#1e293b] flex flex-col h-full flex-shrink-0">
            <div className="h-14 border-b border-[#1e293b] bg-[#0b1120] flex items-center px-4">
                <h2 className="font-semibold text-sm text-white">Inspector</h2>
            </div>

            <div className="p-4 overflow-y-auto">
                <div className="space-y-6">
                    {/* Sección General */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">General</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Tipo</label>
                                <div className="text-sm font-medium text-white capitalize">
                                    {type === 'section' ? `Sección ${(data as Section).type}` : `Componente ${(data as Component).type}`}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">ID</label>
                                <div className="text-xs font-mono text-slate-400 bg-[#0b1120] p-1.5 rounded border border-[#1e293b] truncate">
                                    {data.id}
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-[#1e293b]" />

                    {/* Propiedades Dinámicas */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Propiedades</h3>

                        {type === 'component' && (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Columna</label>
                                    <div className="text-sm font-medium text-white capitalize">
                                        {(data as Component).column !== undefined ? (data as Component).column! + 1 : 1}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">
                                        {(data as Component).type === 'html' ? 'Código HTML' : 'Texto'}
                                    </label>
                                    {(data as Component).type === 'html' ? (
                                        <textarea
                                            value={(data as Component).props?.html || ''}
                                            onChange={(e) => updateComponentProps(selectedComponentId, { html: e.target.value })}
                                            className="w-full text-xs font-mono p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                                            placeholder="<div class='mi-faro'>Hola</div>"
                                        />
                                    ) : (data as Component).type === 'video' ? (
                                        <input
                                            type="text"
                                            value={(data as Component).props?.src || ''}
                                            onChange={(e) => updateComponentProps(selectedComponentId, { src: e.target.value })}
                                            className="w-full text-sm p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="URL de YouTube Embed..."
                                        />
                                    ) : (data as Component).type === 'image' ? (
                                        <div className="space-y-2">
                                            <ImageUpload
                                                label="URL de la Imagen"
                                                value={(data as Component).props?.src || ''}
                                                onChange={(url) => updateComponentProps(selectedComponentId, { src: url })}
                                            />
                                            <label className="block text-xs font-medium text-slate-400 mb-1">Texto Alternativo (Alt)</label>
                                            <input
                                                type="text"
                                                value={(data as Component).props?.alt || ''}
                                                onChange={(e) => updateComponentProps(selectedComponentId, { alt: e.target.value })}
                                                className="w-full text-sm p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Descripción de la imagen"
                                            />
                                        </div>
                                    ) : (data as Component).type === 'paragraph' ? (
                                        <textarea
                                            value={localText}
                                            onChange={handleTextChange}
                                            onBlur={handleTextBlur}
                                            className="w-full text-sm p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                            placeholder="Ingresa el contenido..."
                                        />
                                    ) : (data as Component).type === 'button' ? (
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={localText}
                                                onChange={handleTextChange}
                                                onBlur={handleTextBlur}
                                                className="w-full text-sm p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Texto del botón..."
                                            />
                                            <label className="block text-xs font-medium text-slate-400 mb-1 mt-3">Tipo de Acción</label>
                                            <select
                                                value={(data as Component).props?.actionType || 'none'}
                                                onChange={(e) => updateComponentProps(selectedComponentId, { actionType: e.target.value })}
                                                className="w-full text-sm p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="none">Sin Acción</option>
                                                <option value="link">Abrir Enlace URL</option>
                                                <option value="modal">Abrir Modal</option>
                                                <option value="scroll">Scroll a ID</option>
                                            </select>

                                            {(data as Component).props?.actionType !== 'none' && (
                                                <div className="mt-2">
                                                    <label className="block text-xs font-medium text-slate-400 mb-1">Destino de la Acción</label>
                                                    <input
                                                        type="text"
                                                        value={(data as Component).props?.actionTarget || ''}
                                                        onChange={(e) => updateComponentProps(selectedComponentId, { actionTarget: e.target.value })}
                                                        className="w-full text-sm p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder={(data as Component).props?.actionType === 'link' ? "https://..." : (data as Component).props?.actionType === 'scroll' ? "#seccion-id" : "my-modal-id"}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : (data as Component).type === 'navigation' ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={(data as Component).props?.links || 'Inicio,/\nContacto,/contacto'}
                                                onChange={(e) => updateComponentProps(selectedComponentId, { links: e.target.value })}
                                                className="w-full text-xs font-mono p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                                placeholder="Texto,URL (una por linea)"
                                            />
                                            <p className="text-[10px] text-slate-400">Formato: Nombre,URL (una por línea)</p>
                                        </div>
                                    ) : (data as Component).type === 'gallery' ? (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1">Columnas</label>
                                                <input
                                                    type="number"
                                                    value={(data as Component).props?.columns || 3}
                                                    onChange={(e) => updateComponentProps(selectedComponentId, { columns: parseInt(e.target.value, 10) || 3 })}
                                                    className="w-full text-sm p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min={1} max={6}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1">Imágenes (Separadas por comas)</label>
                                                <textarea
                                                    value={(data as Component).props?.images || ''}
                                                    onChange={(e) => updateComponentProps(selectedComponentId, { images: e.target.value })}
                                                    className="w-full text-xs font-mono p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                                    placeholder="URL1, URL2, URL3..."
                                                />
                                            </div>
                                        </div>
                                    ) : (data as Component).type === 'form' ? (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1">Email de Destino</label>
                                                <input
                                                    type="email"
                                                    value={(data as Component).props?.emailTo || ''}
                                                    onChange={(e) => updateComponentProps(selectedComponentId, { emailTo: e.target.value })}
                                                    className="w-full text-sm p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1">Texto del Botón</label>
                                                <input
                                                    type="text"
                                                    value={(data as Component).props?.buttonText || 'Enviar'}
                                                    onChange={(e) => updateComponentProps(selectedComponentId, { buttonText: e.target.value })}
                                                    className="w-full text-sm p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={localText}
                                            onChange={handleTextChange}
                                            onBlur={handleTextBlur}
                                            className="w-full text-sm p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ingresa el texto..."
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {type === 'component' && (
                            <>
                                <hr className="border-[#1e293b] my-6" />
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Apariencia</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">Alineación de Texto</label>
                                            <select
                                                value={(data as Component).styles?.textAlign || 'left'}
                                                onChange={(e) => updateComponentStyles(selectedComponentId, { textAlign: e.target.value })}
                                                className="w-full text-sm p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="left">Izquierda</option>
                                                <option value="center">Centro</option>
                                                <option value="right">Derecha</option>
                                                <option value="justify">Justificado</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">Tamaño de Fuente (FontSize)</label>
                                            <input
                                                type="text"
                                                value={(data as Component).styles?.fontSize || ''}
                                                onChange={(e) => updateComponentStyles(selectedComponentId, { fontSize: e.target.value })}
                                                className="w-full text-sm p-1.5 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g. 1.5rem o 24px"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">Color de Texto</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={(data as Component).styles?.color || '#334155'}
                                                    onChange={(e) => updateComponentStyles(selectedComponentId, { color: e.target.value })}
                                                    className="w-8 h-8 rounded border border-[#334155] cursor-pointer p-0 appearance-none bg-transparent"
                                                />
                                                <input
                                                    type="text"
                                                    value={(data as Component).styles?.color || '#334155'}
                                                    onChange={(e) => updateComponentStyles(selectedComponentId, { color: e.target.value })}
                                                    className="flex-1 text-sm p-1.5 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            {renderColorSwatches((c) => updateComponentStyles(selectedComponentId, { color: c }))}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">Color de Fondo</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={(data as Component).styles?.backgroundColor || '#ffffff'}
                                                    onChange={(e) => updateComponentStyles(selectedComponentId, { backgroundColor: e.target.value })}
                                                    className="w-8 h-8 rounded border border-[#334155] cursor-pointer p-0 appearance-none bg-transparent"
                                                />
                                                <input
                                                    type="text"
                                                    value={(data as Component).styles?.backgroundColor || 'transparent'}
                                                    onChange={(e) => updateComponentStyles(selectedComponentId, { backgroundColor: e.target.value })}
                                                    className="flex-1 text-sm p-1.5 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            {renderColorSwatches((c) => updateComponentStyles(selectedComponentId, { backgroundColor: c }))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {type === 'section' && (
                            <>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Columnas de Distribución</label>
                                        <select
                                            value={(data as Section).columns || 1}
                                            onChange={(e) => updateSectionProps(selectedComponentId, { columns: parseInt(e.target.value, 10) })}
                                            className="w-full text-sm p-2 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                                <hr className="border-[#1e293b] my-6" />

                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Apariencia de Sección</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">Color de Fondo</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={(data as Section).styles?.backgroundColor || '#ffffff'}
                                                    onChange={(e) => updateSectionStyles(selectedComponentId, { backgroundColor: e.target.value })}
                                                    className="w-8 h-8 rounded border border-[#334155] cursor-pointer p-0 appearance-none bg-transparent"
                                                />
                                                <input
                                                    type="text"
                                                    value={(data as Section).styles?.backgroundColor || 'transparent'}
                                                    onChange={(e) => updateSectionStyles(selectedComponentId, { backgroundColor: e.target.value })}
                                                    className="flex-1 text-sm p-1.5 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            {renderColorSwatches((c) => updateSectionStyles(selectedComponentId, { backgroundColor: c }))}
                                        </div>

                                        <div>
                                            <ImageUpload
                                                label="Imagen de Fondo (URL)"
                                                value={(data as Section).styles?.backgroundImage || ''}
                                                onChange={(url) => updateSectionStyles(selectedComponentId, { backgroundImage: url })}
                                            />
                                        </div>

                                        {/* PADDINGS */}
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-2">Espaciado Interior (Padding)</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-[10px] text-slate-400">Arriba</label>
                                                    <input
                                                        type="text"
                                                        value={(data as Section).styles?.padding?.top || ''}
                                                        onChange={(e) => updateSectionStyles(selectedComponentId, { padding: { ...(data as Section).styles?.padding, top: e.target.value } })}
                                                        className="w-full text-sm p-1.5 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g. 2rem"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-slate-400">Abajo</label>
                                                    <input
                                                        type="text"
                                                        value={(data as Section).styles?.padding?.bottom || ''}
                                                        onChange={(e) => updateSectionStyles(selectedComponentId, { padding: { ...(data as Section).styles?.padding, bottom: e.target.value } })}
                                                        className="w-full text-sm p-1.5 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g. 2rem"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* MARGINS */}
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-2">Margen Exterior (Margin)</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-[10px] text-slate-400">Arriba</label>
                                                    <input
                                                        type="text"
                                                        value={(data as Section).styles?.margin?.top || ''}
                                                        onChange={(e) => updateSectionStyles(selectedComponentId, { margin: { ...(data as Section).styles?.margin, top: e.target.value } })}
                                                        className="w-full text-sm p-1.5 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g. 2rem"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-slate-400">Abajo</label>
                                                    <input
                                                        type="text"
                                                        value={(data as Section).styles?.margin?.bottom || ''}
                                                        onChange={(e) => updateSectionStyles(selectedComponentId, { margin: { ...(data as Section).styles?.margin, bottom: e.target.value } })}
                                                        className="w-full text-sm p-1.5 bg-[#1e293b] border-[#334155] text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="e.g. 2rem"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </aside >
    );
};
