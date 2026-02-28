"use client";

import { useState, useTransition } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { createCategory } from "@/app/actions/categories";
import { Category } from "@/lib/supabase/types";

interface QuickCategoryModalProps {
    onClose: () => void;
    onSuccess: (category: Category) => void;
}

export default function QuickCategoryModal({ onClose, onSuccess }: QuickCategoryModalProps) {
    const [name, setName] = useState("");
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        startTransition(async () => {
            const formData = new FormData();
            formData.append("name", name.trim());
            // Color por defecto para creación rápida
            formData.append("color_class", "bg-blue-100 text-blue-800");

            const result = await createCategory(formData);
            if (result.success && result.category) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess(result.category);
                    onClose();
                }, 1000);
            } else {
                setError(result.error ?? "Error al crear la categoría");
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900">Nueva Categoría</h2>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
                        <X size={18} />
                    </button>
                </div>

                {success ? (
                    <div className="flex flex-col items-center py-10 gap-3">
                        <CheckCircle2 size={40} className="text-emerald-500" />
                        <p className="text-sm font-semibold text-slate-700">¡Categoría creada!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nombre de la categoría</label>
                            <input
                                autoFocus
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Electrónica, Ropa..."
                                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                                ⚠️ {error}
                            </p>
                        )}

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isPending || !name.trim()}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
                            >
                                {isPending ? <Loader2 size={16} className="animate-spin" /> : "Guardar"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
