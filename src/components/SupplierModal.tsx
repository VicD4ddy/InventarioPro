"use client";

import { useState, useTransition } from "react";
import { X, Loader2, CheckCircle2, Building2, Mail, Phone, Globe } from "lucide-react";
import { createSupplier, updateSupplier } from "@/app/actions/suppliers";
import type { Supplier } from "@/lib/supabase/types";

interface SupplierModalProps {
    supplier?: Supplier; // Si existe, es modo edición
    onClose: () => void;
}

export default function SupplierModal({ supplier, onClose }: SupplierModalProps) {
    const isEdit = !!supplier;
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);

        if (!formData.get("name")) {
            setError("El nombre del proveedor es obligatorio.");
            return;
        }

        startTransition(async () => {
            const result = isEdit
                ? await updateSupplier(supplier.id, formData)
                : await createSupplier(formData);

            if (result.success) {
                setSuccess(true);
                setTimeout(onClose, 1200);
            } else {
                setError(result.error ?? "Error desconocido");
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm shadow-xl" onClick={onClose} />

            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isEdit ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}`}>
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                                {isEdit ? "Editar Proveedor" : "Nuevo Proveedor"}
                            </h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                {isEdit ? "Actualiza los datos de contacto" : "Registra un nuevo contacto comercial"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                {success ? (
                    <div className="flex flex-col items-center py-16 gap-4 bg-white">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 animate-in zoom-in duration-300">
                            <CheckCircle2 size={40} />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-slate-800">Proveedor guardado</p>
                            <p className="text-sm text-slate-400">Los cambios se han aplicado correctamente.</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre Comercial</label>
                            <div className="relative group">
                                <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    defaultValue={supplier?.name}
                                    placeholder="Ej: Distribuidora Central S.A."
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                                <div className="relative group">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        defaultValue={supplier?.email || ""}
                                        placeholder="contacto@proveedor.com"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            {/* Teléfono */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Teléfono</label>
                                <div className="relative group">
                                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        name="phone"
                                        type="text"
                                        defaultValue={supplier?.phone || ""}
                                        placeholder="+34 600 000 000"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* País */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">País / Ubicación</label>
                            <div className="relative group">
                                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    name="country"
                                    type="text"
                                    defaultValue={supplier?.country || ""}
                                    placeholder="Ej: España, México, etc."
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-bold flex items-center gap-2">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <div className="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-4 text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all active:scale-95"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className={`flex-[2] flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold text-white rounded-2xl transition-all shadow-lg active:scale-95 ${isEdit ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"}`}
                            >
                                {isPending ? (
                                    <><Loader2 size={18} className="animate-spin" /> Guardando...</>
                                ) : (
                                    <>{isEdit ? "Actualizar Proveedor" : "Crear Proveedor"}</>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
