"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, Plus, Settings, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [myPortals, setMyPortals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3002/proyectos')
            .then(res => res.json())
            .then(data => {
                setMyPortals(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error cargando proyectos:", err);
                setIsLoading(false);
            });
    }, []);

    if (status === "loading" || isLoading) {
        return <div className="flex justify-center mt-32 text-gray-500">Cargando portales...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* Navbar Simple */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex justify-center items-center gap-2">
                    <Globe className="w-6 h-6 text-blue-600" />
                    <h1 className="text-xl font-bold text-gray-800">Panel de Control</h1>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600">
                        {session?.user?.name || "Administrador"}
                    </span>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Salir
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Tus Portales</h2>
                        <p className="mt-1 text-gray-500 text-sm">Administra y edita los sitios web de tu empresa.</p>
                    </div>

                    <button
                        onClick={() => {
                            // TODO: Abrir modal o llamar a API para crear y redirigir al editor
                            alert("Por conectar con la API para POST de proyecto vacío.");
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700 transition"
                    >
                        <Plus className="w-4 h-4" />
                        Crear Portal
                    </button>
                </div>

                {/* Grid Portales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myPortals.map((portal) => (
                        <div key={portal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:border-blue-400 hover:shadow-md transition-all">
                            <div className="h-32 bg-gray-100 border-b border-gray-200 flex items-center justify-center p-3">
                                <Globe className="w-10 h-10 text-gray-300" />
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-semibold text-lg text-gray-900 truncate">{portal.name}</h3>
                                <p className="text-sm text-gray-500 mt-1 mb-4 flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${portal.published ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                    {portal.published ? 'Publicado' : 'Borrador'}
                                </p>
                                <div className="mt-auto flex justify-between items-center gap-2">
                                    <button
                                        onClick={() => router.push(`/editor?id=${portal.id}`)}
                                        className="flex-1 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition"
                                    >
                                        Editar Visualmente
                                    </button>
                                    <button className="p-1.5 text-gray-400 hover:text-blue-600 transition">
                                        <Settings className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
