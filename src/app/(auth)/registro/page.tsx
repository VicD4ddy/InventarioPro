"use client";

import { useActionState } from "react";
import { signUp } from "@/app/actions/auth";
import { Box, Mail, Lock, User, Building2, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const initialState = { error: null as string | null, success: false };

export default function RegistroPage() {
    const [state, formAction, isPending] = useActionState(signUp, initialState);

    if (state.success) {
        return (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">¡Cuenta creada!</h2>
                <p className="text-slate-400 text-sm mb-6">
                    Revisa tu correo electrónico y confirma tu cuenta para comenzar.
                </p>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition"
                >
                    Ir al Login
                    <ArrowRight size={16} />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/40 mb-4">
                    <Box size={28} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Crear cuenta</h1>
                <p className="text-sm text-slate-400 mt-1">Acceso gratuito · Sin tarjeta de crédito</p>
            </div>

            {/* Error */}
            {state.error && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                    {state.error}
                </div>
            )}

            {/* Form */}
            <form action={formAction} className="space-y-3.5">
                {/* Nombre completo */}
                <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                        name="full_name"
                        type="text"
                        required
                        placeholder="Nombre completo"
                        autoComplete="name"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                    />
                </div>

                {/* Empresa */}
                <div className="relative">
                    <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                        name="company"
                        type="text"
                        placeholder="Nombre de tu empresa (opcional)"
                        autoComplete="organization"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                    />
                </div>

                {/* Email */}
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

                {/* Contraseña */}
                <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        placeholder="Contraseña (mín. 6 caracteres)"
                        autoComplete="new-password"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-blue-600/30 mt-1"
                >
                    {isPending ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Creando cuenta...
                        </>
                    ) : (
                        <>
                            Crear cuenta gratis
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>

            <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-slate-500">¿Ya tienes cuenta?</span>
                <div className="flex-1 h-px bg-white/10" />
            </div>

            <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-semibold rounded-xl transition"
            >
                Iniciar sesión
            </Link>
        </div>
    );
}
