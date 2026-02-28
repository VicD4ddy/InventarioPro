"use client";

import { useActionState } from "react";
import { signIn } from "@/app/actions/auth";
import { Box, Mail, Lock, ArrowRight, Loader2, Play } from "lucide-react";
import Link from "next/link";

const initialState = { error: null as string | null };

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(signIn, initialState);

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/40 mb-4">
                    <Box size={28} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">InventarioPRO</h1>
                <p className="text-sm text-slate-400 mt-1">Ingresa a tu panel de inventario</p>
            </div>

            {/* Error */}
            {state.error && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                    {state.error}
                </div>
            )}

            {/* Formulario */}
            <form action={formAction} className="space-y-4">
                <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="correo@empresa.com"
                        autoComplete="email"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                    />
                </div>

                <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-blue-600/30"
                >
                    {isPending ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Ingresando...
                        </>
                    ) : (
                        <>
                            Ingresar
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>

            {/* Botón demo */}
            <Link
                href="/demo"
                className="mt-3 flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-semibold rounded-xl transition"
            >
                <Play size={14} className="text-slate-400" />
                Ver Demo
            </Link>

            <p className="text-center text-xs text-slate-600 mt-4">
                InventarioPRO · Acceso restringido
            </p>
        </div>
    );
}
