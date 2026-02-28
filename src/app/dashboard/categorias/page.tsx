import { getCategories } from "@/app/actions/categories";
import CategoriesList from "@/components/CategoriesList";
import { Tag, Layers } from "lucide-react";

export default async function CategoriasPage() {
    const categories = await getCategories();

    return (
        <div className="max-w-[1000px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 rounded-[22px] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100 animate-pulse-slow">
                            <Tag size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Categorías</h1>
                            <p className="text-slate-500 font-medium">Clasifica tus productos para un control de inventario preciso.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[32px] p-2 pr-8 flex items-center gap-5 text-white shadow-2xl shadow-indigo-200 border border-slate-800">
                    <div className="w-14 h-14 rounded-[26px] bg-slate-800 flex items-center justify-center border border-slate-700">
                        <Layers size={24} className="text-blue-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5">Estructura</p>
                        <p className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                            {categories.length} <span className="text-sm text-slate-500 ml-1 font-bold tracking-normal">Tipos</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Listado de Categorías */}
            <CategoriesList initialCategories={categories} />

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.9; transform: scale(0.98); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
            `}} />
        </div>
    );
}
