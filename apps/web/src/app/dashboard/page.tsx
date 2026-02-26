"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Layers, LayoutDashboard, FolderOpen, Palette, Globe,
    Settings, LifeBuoy, Search, Bell, Plus, Pencil,
    MoreVertical, PlusCircle, LogOut
} from "lucide-react";

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
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-slate-500 font-medium">Cargando tu entorno...</p>
            </div>
        );
    }

    // Default Images for portals
    const defaultImages = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDiuvw0RDgMeEHBqBcG0T93tZTdQZVFr4quXhVHglrfpCKbb0Wvb_24AYmAZqgeo-KdeKUI9cptg5kOzAMQzxPp-0ZIShPkg_h_BM1S8YQ8DmM7K_Dx6byco_ryoRfrbtiCvBCNA-eQnh5DcDIvlCWAxN3qZg9misjYcOtXtGhZ1z-PgH8_3muHbfzQNLHs4WdaAeffvTbEDHd_nHQQGvt5e0Gj5Hyh80R_j5mhOtxvdlYo4N5kZhrJR0I_kYN3nYwvsF89vTNcmqc",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB1KR8ktwGb4U6alMWhOD7TBotzkJzBF_v-VE9fUYtJx2vOQuCkprRWa5Dudlum25bQ8fJp4SjklIlrgPoFzDxTwpCOghevE0ldfIGK43GFXY0bYZoJDbQbFi3bVT90ohhB-ZvmXInHrR-COZpjJW5eObE2B7eM0hCRvBzLrE9lfcJ8Xs8kJbqbc3yqoGY5t8vpsc96fxlHkZZtyx1h4rjF0qlbYzSCxpBSeWgHm8Etsg4xRk2yG2Acj4G8gAA5epiuxzH5pITu6z4",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCjlHJvpyeERxPyPFfLsWUn7sxRu4RMxw1eaxbBn_sUEfdQSNjNvT7zkAHAWiLZmPENkSY8a31dtbR4RtSP1U0jMIyRntUs7TdC7Hlrr1rXjZzFCmYT3vQg5nqp4ZltnDYnC7qzY__aIwxj08U5aPplie_PTZA0RJYDdDevpf3c0LAtJDV-BnMZrPOnow0HH01MwOA9K2-1fjIM1AcJAvt16Eq5XNlywcbeM4BQ_zO_P8cHAykCNdyjUbx1MbsM1F9M-mvglNeJWSo",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDVs1Rsx9qYq3T6QIMKikKmSWVwUIr5SI0B7sqDQl2l2KRu5XVL7BPnw1jxipdnri-a2gsisHYRHTTdOfNfj1oaPLHCC-Vks4dm18vmxuJEyS6IIRIDdig-uAsAC6odDYubzrGtYbHpbud3u5Lt8czYzfPJ71p9vaNgVDsilpbkxhSn_fCLuNqwAcB2Hc6JRAMbj4rP_TmPrrRatj1v8rraDbpCX6q982mKygSxX8F4rKq4cqSW0ZxuoYiSMBRkqCr8pQbdiU09OGk"
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#101622] font-sans text-slate-900 dark:text-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col fixed h-full z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg flex items-center justify-center">
                        <Layers className="text-white" size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-lg leading-tight">Generador</span>
                        <span className="text-xs text-slate-500 uppercase tracking-widest">SaaS Builder</span>
                    </div>
                </div>

                <nav className="mt-6 flex-1 px-4 space-y-1">
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-500 bg-blue-600/10 border-r-4 border-blue-500 transition-colors" href="#">
                        <LayoutDashboard size={20} />
                        <span className="text-sm font-medium">Dashboard</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" href="#">
                        <FolderOpen size={20} />
                        <span className="text-sm font-medium">Mis Proyectos</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" href="#">
                        <Palette size={20} />
                        <span className="text-sm font-medium">Plantillas</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" href="#">
                        <Globe size={20} />
                        <span className="text-sm font-medium">Dominios</span>
                    </a>

                    <div className="pt-8 pb-2">
                        <span className="px-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Configuración</span>
                    </div>

                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" href="#">
                        <Settings size={20} />
                        <span className="text-sm font-medium">Ajustes</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors" href="#">
                        <LifeBuoy size={20} />
                        <span className="text-sm font-medium">Soporte Técnico</span>
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full flex justify-center items-center gap-2 py-2.5 bg-slate-800 text-slate-300 text-sm font-bold rounded-lg hover:bg-slate-700 hover:text-white transition-all shadow-sm"
                    >
                        <LogOut size={16} />
                        Cerrar Sesión
                    </button>
                    <div className="mt-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Plan Actual</p>
                        <p className="text-sm text-white font-bold mb-3">Professional Suite</p>
                        <button className="w-full py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                            Upgrade Pro
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-[#101622] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 px-8 flex items-center justify-between shadow-sm">
                    <div className="flex items-center flex-1 max-w-xl">
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-600/20 placeholder:text-slate-400 transition-all outline-none"
                                placeholder="Buscar proyectos, plantillas o ayuda..."
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="flex items-center justify-center h-10 w-10 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <Bell size={20} />
                        </button>
                        <button
                            onClick={() => {
                                alert("API Integrada próximamente: POST proyecto vacío.");
                            }}
                            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <Plus size={18} />
                            <span>Crear Portal</span>
                        </button>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                                    {session?.user?.name || "Diego Admin"}
                                </p>
                                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                                    {session?.user?.email || "admin@empresa.com"}
                                </p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold shadow-sm">
                                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "D"}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8 flex-1">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Mis Portales</h1>
                            <p className="text-slate-500 mt-1">Gestiona y edita tus sitios web activos desde un solo lugar.</p>
                        </div>
                        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <button className="px-5 py-2 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm transition-all text-center">Todos</button>
                            <button className="px-5 py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all text-center">Publicados</button>
                            <button className="px-5 py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all text-center">Borradores</button>
                        </div>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">

                        {/* New Project Placeholder */}
                        <div
                            onClick={() => alert("Próximamente modal Crear.")}
                            className="group relative flex flex-col items-center justify-center h-full min-h-[340px] border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                                    <PlusCircle size={28} />
                                </div>
                                <span className="font-bold text-slate-700 dark:text-slate-300">Crear nuevo proyecto</span>
                                <p className="text-slate-400 text-xs mt-1">Empieza de cero o usa plantilla</p>
                            </div>
                        </div>

                        {/* List from API */}
                        {myPortals.map((portal, idx) => (
                            <div key={portal.id} className="group bg-white dark:bg-[#151b28] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                                <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url('${defaultImages[idx % defaultImages.length]}')` }}
                                    ></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute top-4 left-4">
                                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/20
                                            ${portal.published
                                                ? 'bg-emerald-500/90 text-white'
                                                : 'bg-amber-500/90 text-white'}`}
                                        >
                                            {portal.published ? 'Publicado' : 'Borrador'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                        {portal.name}
                                    </h3>
                                    <p className="text-slate-400 text-xs mt-1">ID: {portal.id}</p>

                                    <div className="mt-auto mb-4"></div>

                                    <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                                        <button
                                            onClick={() => router.push(`/editor?id=${portal.id}`)}
                                            className="flex-1 bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all flex items-center justify-center gap-2 border border-blue-100 dark:border-blue-900/50 hover:border-blue-600"
                                        >
                                            <Pencil size={14} />
                                            Editar Portal
                                        </button>
                                        <button className="w-10 h-10 flex flex-shrink-0 items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Simple Footer */}
                <footer className="px-8 py-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-medium bg-slate-50 dark:bg-[#101622] mt-auto">
                    <p>© 2026 Generador de Portales SaaS. Todos los derechos reservados.</p>
                    <div className="flex gap-6 mt-4 sm:mt-0">
                        <a className="hover:text-blue-600 transition-colors" href="#">Aviso de Privacidad</a>
                        <a className="hover:text-blue-600 transition-colors" href="#">Términos de Servicio</a>
                        <a className="hover:text-blue-600 transition-colors" href="#">Soporte Técnico</a>
                    </div>
                </footer>
            </main>
        </div>
    );
}
