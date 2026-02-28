"use client";

import { useState, useTransition } from "react";
import { User, Building2, Save, Loader2, CheckCircle2, ShieldCheck, CreditCard, BellRing } from "lucide-react";
import { updateSettings } from "@/app/actions/auth";
import { getPlanLimit } from "@/lib/plans";

interface SettingsFormProps {
    initialData: {
        fullName: string;
        companyName: string;
        email: string;
        plan: string;
        productCount: number;
        bcvRate: number;
    };
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const plan = getPlanLimit(initialData.plan);
    const usagePercent = plan.products === Infinity ? 0 : Math.min(100, (initialData.productCount / plan.products) * 100);
    const isLimitClose = usagePercent > 90;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccess(false);
        setError(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await updateSettings(formData);
            if (result.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(result.error ?? "Error al actualizar");
            }
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar de Configuración */}
            <div className="space-y-4">
                <div className="bg-white rounded-[32px] border border-slate-100 p-2 shadow-sm">
                    <button className="w-full flex items-center gap-3 px-6 py-4 rounded-[24px] bg-blue-50 text-blue-600 font-bold text-sm transition-all">
                        <User size={18} />
                        Perfil y Empresa
                    </button>
                    <button className="w-full flex items-center gap-3 px-6 py-4 rounded-[24px] text-slate-400 font-bold text-sm hover:bg-slate-50 transition-all group">
                        <ShieldCheck size={18} className="group-hover:text-slate-600" />
                        Seguridad
                    </button>
                    <button className="w-full flex items-center gap-3 px-6 py-4 rounded-[24px] text-slate-400 font-bold text-sm hover:bg-slate-50 transition-all group">
                        <BellRing size={18} className="group-hover:text-slate-600" />
                        Notificaciones
                    </button>
                    <button className="w-full flex items-center gap-3 px-6 py-4 rounded-[24px] text-slate-400 font-bold text-sm hover:bg-slate-50 transition-all group">
                        <CreditCard size={18} className="group-hover:text-slate-600" />
                        Suscripción
                    </button>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full translate-x-10 -translate-y-10" />
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Plan Actual</p>
                        <h4 className="text-2xl font-black mb-1 capitalize">{plan.label}</h4>

                        <div className="mt-6 space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-400">Uso de Catálogo</span>
                                <span className={isLimitClose ? "text-rose-400" : "text-blue-400"}>
                                    {initialData.productCount} / {plan.products === Infinity ? "∞" : plan.products}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${isLimitClose ? "bg-rose-500" : "bg-blue-500"}`}
                                    style={{ width: `${usagePercent}%` }}
                                />
                            </div>
                        </div>

                        <p className="text-[10px] text-slate-400 leading-relaxed mt-4 mb-6 italic">
                            {plan.products === Infinity
                                ? "Cuentas con capacidad ilimitada para tu negocio."
                                : `Te quedan ${Math.max(0, plan.products - initialData.productCount)} productos en este nivel.`}
                        </p>
                        <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20">
                            Mejorar Suscripción
                        </button>
                    </div>
                </div>
            </div>

            {/* Formulario Principal */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                    <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Información General</h3>
                            <p className="text-sm text-slate-400 font-medium">Actualiza tus datos personales y corporativos.</p>
                        </div>
                        {success && (
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-xs font-bold animate-in fade-in zoom-in duration-300">
                                <CheckCircle2 size={16} />
                                ¡Guardado con éxito!
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                                <div className="relative group">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        name="full_name"
                                        type="text"
                                        defaultValue={initialData.fullName}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-[20px] text-slate-800 font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre de la Empresa</label>
                                <div className="relative group">
                                    <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        name="company_name"
                                        type="text"
                                        defaultValue={initialData.companyName}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-[20px] text-slate-800 font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-blue-50 border border-blue-100 rounded-[32px] space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900">Economía Multi-moneda</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Referencia BCV Venezuela</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tasa de Cambio (Bs / USD)</label>
                                    <input
                                        name="bcv_rate"
                                        type="number"
                                        step="0.01"
                                        defaultValue={initialData.bcvRate}
                                        className="w-full px-5 py-4 bg-white border border-slate-100 rounded-[20px] text-slate-800 font-black text-lg outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                    />
                                </div>
                                <div className="pb-1">
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic mb-2">
                                        Esta tasa se usará para registrar el valor histórico de cada movimiento de inventario en Bolívares.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                            <input
                                type="email"
                                value={initialData.email}
                                disabled
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[20px] text-slate-400 font-bold text-sm cursor-not-allowed opacity-70"
                            />
                            <p className="text-[10px] text-slate-400 font-medium ml-1">El correo electrónico no puede ser modificado por razones de seguridad.</p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-bold">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="pt-4 flex justify-end gap-4">
                            <button
                                type="button"
                                className="px-8 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all"
                            >
                                Descartar Cambios
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex items-center gap-3 px-10 py-4 bg-slate-900 hover:bg-black text-white rounded-[22px] font-black text-sm shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <><Loader2 size={18} className="animate-spin" /> Guardando...</>
                                ) : (
                                    <><Save size={18} /> Guardar Cambios</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Zona de peligro o acciones adicionales */}
                <div className="bg-red-50/30 rounded-[32px] border border-red-100/50 p-8 flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-black text-red-600 uppercase tracking-wider">Cerrar mi Cuenta</h4>
                        <p className="text-xs text-red-400 font-medium mt-1">Borra toda tu información y el inventario de forma permanente.</p>
                    </div>
                    <button className="px-6 py-3 bg-white border border-red-200 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm">
                        Borrar Cuenta
                    </button>
                </div>
            </div>
        </div>
    );
}
