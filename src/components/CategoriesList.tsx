"use client";

import { useState } from "react";
import { Plus, Tag, Edit2, LayoutGrid, List } from "lucide-react";
import type { Category } from "@/lib/supabase/types";
import CategoryModal from "./CategoryModal";

interface CategoriesListProps {
    initialCategories: Category[];
}

export default function CategoriesList({ initialCategories }: CategoriesListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const openCreate = () => {
        setSelectedCategory(undefined);
        setIsModalOpen(true);
    };

    const openEdit = (cat: Category) => {
        setSelectedCategory(cat);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="hidden md:flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        <List size={18} />
                    </button>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">
                        {initialCategories.length} categorías registradas
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    Nueva Categoría
                </button>
            </div>

            {/* Listado */}
            {initialCategories.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-[40px] border border-slate-100 border-dashed">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Tag size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">No hay categorías</h3>
                    <p className="text-slate-400 text-sm mt-1">Organiza tus productos creando tu primera categoría.</p>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {initialCategories.map((cat) => (
                        <div key={cat.id} className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-2 h-full ${cat.color_class.split(' ')[0]}`} />
                            <div className="flex justify-between items-start mb-6">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${cat.color_class}`}>
                                    Categoría
                                </div>
                                <button
                                    onClick={() => openEdit(cat)}
                                    className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Edit2 size={16} />
                                </button>
                            </div>
                            <h4 className="text-lg font-black text-slate-800 tracking-tight mb-2 truncate group-hover:text-blue-600 transition-colors">
                                {cat.name}
                            </h4>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                Gestión Activa
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="hidden md:block bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estilo Visual</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {initialCategories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-bold text-slate-800">{cat.name}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold ${cat.color_class}`}>
                                            {cat.name}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => openEdit(cat)}
                                            className="p-2 text-slate-400 hover:text-blue-600 transition-all font-bold text-xs flex items-center gap-2 ml-auto"
                                        >
                                            <Edit2 size={14} /> Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <CategoryModal
                    category={selectedCategory}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
