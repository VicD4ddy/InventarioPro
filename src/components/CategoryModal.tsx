"use client";

import { useState, useTransition } from "react";
import { X, Tag, Loader2, Save, Trash2, Palette, Check } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/categories";
import type { Category } from "@/lib/supabase/types";

interface CategoryModalProps {
    category?: Category;
    onClose: () => void;
}

const COLOR_OPTIONS = [
    { label: "Azul", class: "bg-blue-100 text-blue-700 border-blue-200" },
    { label: "Índigo", class: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    { label: "Esmeralda", class: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { label: "Violeta", class: "bg-violet-100 text-violet-700 border-violet-200" },
    { label: "Ámbar", class: "bg-amber-100 text-amber-700 border-amber-200" },
    { label: "Rosa", class: "bg-rose-100 text-rose-700 border-rose-200" },
    { label: "Pizarra", class: "bg-slate-100 text-slate-700 border-slate-200" },
    { label: "Cian", class: "bg-cyan-100 text-cyan-700 border-cyan-200" },
];

export default function CategoryModal({ category, onClose }: CategoryModalProps) {
    const [isPending, startTransition] = useTransition();
    const [selectedColor, setSelectedColor] = useState(category?.color_class || COLOR_OPTIONS[0].class);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!category;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        formData.append("color_class", selectedColor);

        startTransition(async () => {
            const result = isEditing
                ? await updateCategory(category.id, formData)
                : await createCategory(formData);

            if (result.error) {
                setError(result.error);
            } else {
                onClose();
            }
        });
    };

    const handleDelete = async () => {
        if (!category) return;
        if (!confirm("¿Seguro que deseas eliminar esta categoría? Los productos asociados quedarán sin categoría.")) return;

        startTransition(async () => {
            const result = await deleteCategory(category.id);
            if (result.error) {
                setError(result.error);
            } else {
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                            <Tag size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 truncate">
                            {isEditing ? "Editar Categoría" : "Nueva Categoría"}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-100 shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre de la Categoría</label>
                        <input
                            name="name"
                            type="text"
                            defaultValue={category?.name}
                            placeholder="Ej: Electrónica, Ropa, Alimentos..."
                            required
                            autoFocus
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[22px] text-slate-800 font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Palette size={12} className="text-blue-500" />
                            Estilo y Color
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {COLOR_OPTIONS.map((opt) => (
                                <button
                                    key={opt.class}
                                    type="button"
                                    onClick={() => setSelectedColor(opt.class)}
                                    className={`h-12 rounded-2xl border transition-all flex items-center justify-center ${opt.class} ${selectedColor === opt.class
                                            ? "ring-4 ring-blue-50 border-blue-400 scale-105"
                                            : "opacity-60 hover:opacity-100 grayscale-[0.5] hover:grayscale-0"
                                        }`}
                                >
                                    {selectedColor === opt.class && <Check size={18} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[11px] text-red-600 font-bold animate-pulse">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="pt-4 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-[22px] font-black text-sm shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <><Loader2 size={18} className="animate-spin" /> Procesando...</>
                            ) : (
                                <><Save size={18} /> {isEditing ? "Guardar Cambios" : "Crear Categoría"}</>
                            )}
                        </button>

                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-500 rounded-[22px] font-black text-sm transition-all flex items-center justify-center gap-2 group"
                            >
                                <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                                Eliminar Categoría
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
