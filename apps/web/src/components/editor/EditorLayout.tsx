'use client';

import React from 'react';
import { SidebarLeft } from './SidebarLeft';
import { SidebarRight } from './SidebarRight';
import { Canvas } from './Canvas';

export const EditorLayout = () => {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
            {/* Columna Izquierda: Elementos / Catálogo */}
            <SidebarLeft />

            {/* Columna Central: El Canvas Interactivo interactuando con dnd-kit */}
            <main className="flex-1 flex flex-col relative">
                <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 justify-between">
                    <div className="font-semibold text-slate-700">Editor de Portales</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 transition-colors">
                            Previsualizar
                        </button>
                        <button className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors">
                            Guardar Cambios
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 relative flex justify-center w-full">
                    <Canvas />
                </div>
            </main>

            {/* Columna Derecha: Inspector de Propiedades */}
            <SidebarRight />
        </div>
    );
};
