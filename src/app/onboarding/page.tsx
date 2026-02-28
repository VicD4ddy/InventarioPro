"use client";

import { useActionState } from "react";
import { completeProfile } from "@/app/actions/profile";
import {
    Box,
    User,
    Building2,
    Briefcase,
    Users,
    ArrowRight,
    Loader2,
    Sparkles,
} from "lucide-react";

const initialState = { error: null as string | null };

const INDUSTRIES = [
    "Retail / Comercio",
    "Manufactura",
    "Tecnología",
    "Salud / Farmacia",
    "Alimentación / Bebidas",
    "Construcción / Ferretería",
    "Moda / Textil",
    "Logística / Transporte",
    "Otro",
];

const TEAM_SIZES = [
    { label: "Solo yo", value: "1" },
    { label: "2 – 5 personas", value: "2-5" },
    { label: "6 – 20 personas", value: "6-20" },
    { label: "Más de 20", value: "20+" },
];

const inputClass =
    "w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition";
const labelClass = "block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest";

export default function OnboardingPage() {
    const [state, formAction, isPending] = useActionState(completeProfile, initialState);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
            {/* Orbes de fondo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-lg">
                {/* Encabezado */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/40 mx-auto mb-4">
                        <Box size={28} className="text-white" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-3">
                        <Sparkles size={13} className="text-blue-400" />
                        <span className="text-xs font-semibold text-blue-400">Bienvenido a InventarioPRO</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Cuéntanos sobre ti</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Esto nos ayuda a personalizar tu experiencia. Solo toma 1 minuto.
                    </p>
                </div>

                {/* Card del formulario */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {state.error && (
                        <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                            {state.error}
                        </div>
                    )}

                    <form action={formAction} className="space-y-5">
                        {/* Nombre completo */}
                        <div>
                            <label className={labelClass}>Tu nombre *</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                <input
                                    name="full_name"
                                    type="text"
                                    required
                                    placeholder="Ej: Carlos Rodríguez"
                                    autoComplete="name"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Nombre de la empresa */}
                        <div>
                            <label className={labelClass}>Nombre de tu empresa</label>
                            <div className="relative">
                                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                <input
                                    name="company_name"
                                    type="text"
                                    placeholder="Ej: Distribuidora López"
                                    autoComplete="organization"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Industria */}
                        <div>
                            <label className={labelClass}>¿A qué se dedica tu empresa?</label>
                            <div className="relative">
                                <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10" />
                                <select
                                    name="industry"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition appearance-none"
                                >
                                    <option value="" className="bg-slate-800">Selecciona una industria</option>
                                    {INDUSTRIES.map((i) => (
                                        <option key={i} value={i} className="bg-slate-800">{i}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Tamaño del equipo */}
                        <div>
                            <label className={labelClass}>Tamaño de tu equipo</label>
                            <div className="grid grid-cols-4 gap-2">
                                {TEAM_SIZES.map((size) => (
                                    <label
                                        key={size.value}
                                        className="relative cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="team_size"
                                            value={size.value}
                                            className="peer sr-only"
                                        />
                                        <div className="flex flex-col items-center justify-center py-3 px-1 bg-white/5 border border-white/10 rounded-xl text-center text-xs text-slate-400 font-medium hover:bg-white/10 hover:border-blue-500/30 peer-checked:bg-blue-600/20 peer-checked:border-blue-500 peer-checked:text-blue-300 transition cursor-pointer select-none">
                                            <Users size={14} className="mb-1.5 opacity-60" />
                                            {size.label}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-blue-600/30 mt-2"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    Comenzar con InventarioPRO
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-slate-600 mt-5">
                    Puedes actualizar esta información más tarde en Configuración.
                </p>
            </div>
        </div>
    );
}
