"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Grid, Eye } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("admin@empresa.com");
    const [password, setPassword] = useState("admin");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Credenciales inválidas. Por favor intenta de nuevo.");
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="flex w-full min-h-screen">
            {/* Left Side: Login Form */}
            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-[45%] lg:px-20 xl:px-32 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                <div className="mx-auto w-full max-w-sm lg:ml-0">
                    {/* Branding */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <Grid size={24} />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Generador de Portales
                        </h2>
                    </div>

                    {/* Header Text */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            Bienvenido
                        </h1>
                        <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
                            Accede a tu panel para gestionar tus portales y sitios web.
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 mb-6 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-200" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-xl border-0 py-3.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 sm:text-sm sm:leading-6 outline-none"
                                    placeholder="tu@empresa.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-200" htmlFor="password">
                                    Contraseña
                                </label>
                                <div className="text-sm">
                                    <a className="font-semibold text-blue-600 hover:text-blue-500" href="#">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2 relative">
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-xl border-0 py-3.5 pl-4 pr-12 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-slate-800 dark:text-white dark:ring-slate-700 sm:text-sm sm:leading-6 outline-none"
                                    placeholder="••••••••"
                                />
                                <button className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600" type="button">
                                    <Eye size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                            />
                            <label className="text-sm text-slate-600 dark:text-slate-400" htmlFor="remember-me">
                                Recordar sesión por 30 días
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-xl bg-blue-600 px-3 py-4 text-sm font-bold leading-6 text-white shadow-lg hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all active:scale-[0.98]"
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>

                    {/* Footer Links */}
                    <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400 lg:text-left">
                        ¿No tienes una cuenta?{" "}
                        <a className="font-bold leading-6 text-blue-600 hover:text-blue-500" href="#">
                            Regístrate ahora
                        </a>
                    </p>
                </div>

                {/* Simple Footer Info */}
                <div className="mt-auto pt-10 text-xs text-slate-400 dark:text-slate-600 text-center lg:text-left">
                    © 2026 Generador de Portales. Todos los derechos reservados.
                </div>
            </div>

            {/* Right Side: Artistic Visual */}
            <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-gradient-to-br from-[#1e40af] via-[#256af4] to-[#4f46e5]">
                {/* Decorative Elements */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}
                ></div>

                {/* Abstract Floating Elements */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-full h-full max-w-2xl">
                        {/* Browser Outline 1 */}
                        <div className="absolute top-1/4 left-10 w-96 h-64 border border-white/20 rounded-xl backdrop-blur-sm bg-white/5 shadow-2xl transform -rotate-6">
                            <div className="flex items-center gap-1.5 p-3 border-b border-white/10">
                                <div className="w-2 h-2 rounded-full bg-white/30"></div>
                                <div className="w-2 h-2 rounded-full bg-white/30"></div>
                                <div className="w-2 h-2 rounded-full bg-white/30"></div>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="h-2 w-3/4 bg-white/10 rounded"></div>
                                <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    <div className="h-12 bg-white/10 rounded-lg"></div>
                                    <div className="h-12 bg-white/10 rounded-lg"></div>
                                    <div className="h-12 bg-white/10 rounded-lg"></div>
                                </div>
                            </div>
                        </div>

                        {/* Browser Outline 2 (Focus) */}
                        <div className="absolute top-1/3 right-10 w-[420px] h-[300px] border border-white/30 rounded-2xl backdrop-blur-md bg-white/10 shadow-2xl transform rotate-3">
                            <div className="flex items-center justify-between p-4 border-b border-white/20">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400/50"></div>
                                </div>
                                <div className="w-32 h-2.5 bg-white/20 rounded-full"></div>
                                <div className="w-4"></div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-lg bg-white/20"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-3 w-24 bg-white/40 rounded"></div>
                                        <div className="h-2 w-16 bg-white/20 rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-white/10 rounded"></div>
                                    <div className="h-2 w-full bg-white/10 rounded"></div>
                                    <div className="h-2 w-2/3 bg-white/10 rounded"></div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <div className="h-8 w-24 bg-white/30 rounded-lg"></div>
                                </div>
                            </div>
                        </div>

                        {/* Abstract Code Lines */}
                        <div className="absolute bottom-48 left-20 hidden xl:block opacity-40 font-mono text-[10px] text-white space-y-1">
                            <div className="flex gap-2"><span>&lt;section</span><span className="text-blue-200">className="portal-container"</span><span>&gt;</span></div>
                            <div className="flex gap-2 pl-4"><span>&lt;header&gt;</span><span className="text-blue-200">Main Navigation</span><span>&lt;/header&gt;</span></div>
                            <div className="flex gap-2 pl-4"><span>&lt;div</span><span className="text-blue-200">id="dynamic-content"</span><span>&gt;</span></div>
                            <div className="flex gap-2 pl-8"><span>&lt;img</span><span className="text-blue-200">src="logo.png"</span><span>/&gt;</span></div>
                            <div className="flex gap-2 pl-4"><span>&lt;/div&gt;</span></div>
                            <div className="flex gap-2"><span>&lt;/section&gt;</span></div>
                        </div>

                        {/* Geometric Decoration */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
                    </div>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-16 left-16 right-16">
                    <blockquote className="text-white">
                        <p className="text-2xl font-light leading-relaxed">
                            "La construcción de portales web nunca fue tan intuitiva. Diseñamos para el futuro de la web modular."
                        </p>
                        <footer className="mt-6 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
                                <Grid size={18} className="text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-bold">Generador de Portales</div>
                                <div className="text-xs text-white/60">Sistema Modular SaaS</div>
                            </div>
                        </footer>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}
