"use client";

import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import ExportButton from "./ExportButton";
import ImportModal from "./ImportModal";
import { Product } from "@/lib/supabase/types";

interface CatalogHeaderProps {
    products: Product[];
}

export default function CatalogHeader({ products }: CatalogHeaderProps) {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-14 h-14 rounded-[22px] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                        <Upload size={28} className="translate-y-[-1px]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Catálogo de Productos</h1>
                        <p className="text-slate-500 font-medium">Gestiona tu inventario maestro, precios y categorías.</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3.5 text-sm font-bold rounded-2xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all border border-indigo-100"
                >
                    <Upload size={18} />
                    Importar Excel
                </button>

                <ExportButton
                    products={products}
                    totalCount={products.length}
                />

                <a
                    href="/dashboard/productos/nuevo"
                    className="flex items-center gap-2 px-6 py-3.5 text-sm font-black rounded-2xl bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    Nuevo Producto
                </a>
            </div>

            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
            />
        </div>
    );
}
