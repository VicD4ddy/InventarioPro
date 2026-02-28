"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import IconSelector from "./IconSelector";
import QuickCategoryModal from "./QuickCategoryModal";
import QuickSupplierModal from "./QuickSupplierModal";
import { createProduct, updateProduct } from "@/app/actions/products";
import type { Category, Supplier } from "@/lib/supabase/types";

interface ProductFormProps {
    categories: Category[];
    suppliers: Supplier[];
    defaultValues?: {
        name?: string;
        subtitle?: string;
        sku?: string;
        category_id?: string;
        supplier_id?: string;
        price?: number;
        cost?: number;
        stock?: number;
        max_stock?: number;
        reorder_point?: number;
        image_url?: string;
        wholesale_price?: number;
    };
    mode?: "create" | "edit";
    productId?: string;
}

const inputClass =
    "w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition placeholder-slate-300";
const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5";

export default function ProductForm({
    categories,
    suppliers,
    defaultValues = {},
    mode = "create",
    productId,
}: ProductFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [localCategories, setLocalCategories] = useState<Category[]>(categories);
    const [localSuppliers, setLocalSuppliers] = useState<Supplier[]>(suppliers);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(defaultValues.category_id ?? "");
    const [selectedSupplierId, setSelectedSupplierId] = useState(defaultValues.supplier_id ?? "");
    const [imageUrl, setImageUrl] = useState(defaultValues.image_url ?? "");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result =
                mode === "edit" && productId
                    ? await updateProduct(productId, formData)
                    : await createProduct(formData);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => router.push("/dashboard"), 1000);
            } else {
                setError(result.error ?? "Error desconocido");
            }
        });
    };

    return (
        <div className="space-y-5">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                {/* Éxito */}
                {success && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl border border-emerald-100">
                        ✅ Producto {mode === "create" ? "creado" : "actualizado"} correctamente. Redirigiendo...
                    </div>
                )}
                {/* Error */}
                {error && (
                    <div className={`flex flex-col gap-3 px-4 py-4 rounded-xl border ${error.includes("límite") ? "bg-amber-50 text-amber-800 border-amber-100" : "bg-red-50 text-red-600 border-red-100"
                        }`}>
                        <div className="flex items-center gap-2 text-sm font-bold">
                            {error.includes("límite") ? "🚀" : "⚠️"} {error}
                        </div>
                        {error.includes("límite") && (
                            <button
                                type="button"
                                className="w-full py-2 bg-amber-600 text-white rounded-lg text-xs font-black uppercase tracking-wider hover:bg-amber-700 transition shadow-sm"
                                onClick={() => router.push("/admin/suscripciones")}
                            >
                                Ver Planes Premium
                            </button>
                        )}
                    </div>
                )}

                {/* Fila 1: Nombre + Código */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>
                            Nombre del producto *
                            <InfoTooltip text="El nombre comercial que verán tus clientes y en el inventario." />
                        </label>
                        <input
                            name="name"
                            required
                            defaultValue={defaultValues.name}
                            placeholder="Ej: Nike Air Max 270"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>
                            Código de Producto *
                            <InfoTooltip text="Identificador único (SKU) para control de inventario y búsquedas rápidas." />
                        </label>
                        <input
                            name="sku"
                            required
                            defaultValue={defaultValues.sku}
                            placeholder="Ej: PROD-001"
                            className={`${inputClass} font-mono`}
                        />
                    </div>
                </div>

                {/* Subtítulo */}
                <div>
                    <label className={labelClass}>
                        Descripción corta
                        <InfoTooltip text="Detalles adicionales como talla, color o material (ej: Talla M, Algodón)." />
                    </label>
                    <input
                        name="subtitle"
                        defaultValue={defaultValues.subtitle ?? ""}
                        placeholder="Ej: Talla: 42 • Color: Rojo"
                        className={inputClass}
                    />
                </div>

                {/* Fila 2: Categoría + Proveedor */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-slate-600">
                                Categoría
                                <InfoTooltip text="Grupo al que pertenece el producto para facilitar el filtrado." />
                            </label>
                            <button
                                type="button"
                                onClick={() => setIsCategoryModalOpen(true)}
                                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 bg-blue-50 px-2 py-0.5 rounded-lg transition-colors"
                            >
                                <Plus size={10} />
                                Nueva
                            </button>
                        </div>
                        <select
                            name="category_id"
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            className={inputClass}
                        >
                            <option value="">Sin categoría</option>
                            {localCategories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-slate-600">
                                Proveedor
                                <InfoTooltip text="Empresa o persona que te suministra este producto." />
                            </label>
                            <button
                                type="button"
                                onClick={() => setIsSupplierModalOpen(true)}
                                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 bg-blue-50 px-2 py-0.5 rounded-lg transition-colors"
                            >
                                <Plus size={10} />
                                Nuevo
                            </button>
                        </div>
                        <select
                            name="supplier_id"
                            value={selectedSupplierId}
                            onChange={(e) => setSelectedSupplierId(e.target.value)}
                            className={inputClass}
                        >
                            <option value="">Sin proveedor</option>
                            {localSuppliers.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Fila 3: Precio + Costo */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>
                            Precio de venta (USD) *
                            <InfoTooltip text="El precio final al cual venderás el producto a tus clientes." />
                        </label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            defaultValue={defaultValues.price}
                            placeholder="0.00"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>
                            Precio al Mayor (USD)
                            <InfoTooltip text="Precio especial para ventas por volumen o clientes mayoristas." />
                        </label>
                        <input
                            name="wholesale_price"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={defaultValues.wholesale_price}
                            placeholder="0.00"
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Fila 3.5: Costo */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>
                            Costo unitario (USD)
                            <InfoTooltip text="Lo que te cuesta a ti adquirir una unidad de este producto." />
                        </label>
                        <input
                            name="cost"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={defaultValues.cost}
                            placeholder="0.00"
                            className={inputClass}
                        />
                    </div>
                    <div className="opacity-0 pointer-events-none">
                        <label className={labelClass}>Espaciador</label>
                        <input className={inputClass} disabled />
                    </div>
                </div>

                {/* Fila 4: Stock + Máx + Punto de reorden */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className={labelClass}>
                            Stock inicial *
                            <InfoTooltip text="Cantidad disponible actualmente al momento de crear el producto." />
                        </label>
                        <input
                            name="stock"
                            type="number"
                            min="0"
                            required
                            defaultValue={defaultValues.stock ?? 0}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>
                            Stock máximo
                            <InfoTooltip text="Capacidad máxima recomendada para tu almacén." />
                        </label>
                        <input
                            name="max_stock"
                            type="number"
                            min="1"
                            defaultValue={defaultValues.max_stock ?? 100}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>
                            Punto de reorden
                            <InfoTooltip text="El nivel de stock donde debes pedir más producto para no quedarte sin existencias." />
                        </label>
                        <input
                            name="reorder_point"
                            type="number"
                            min="0"
                            defaultValue={defaultValues.reorder_point ?? 10}
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Icono / Imagen del producto */}
                <IconSelector value={imageUrl} onChange={setImageUrl} />

                {/* Acciones */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isPending || success}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition shadow-md shadow-blue-100"
                    >
                        {isPending ? "Guardando..." : mode === "create" ? "Crear Producto" : "Guardar cambios"}
                    </button>
                </div>
            </form>

            {/* Modal de Categoría Rápida - FUERA DEL FORM PRINCIPAL */}
            {isCategoryModalOpen && (
                <QuickCategoryModal
                    onClose={() => setIsCategoryModalOpen(false)}
                    onSuccess={(newCat) => {
                        setLocalCategories(prev => [...prev, newCat].sort((a, b: any) => a.name.localeCompare(b.name)));
                        setSelectedCategoryId(newCat.id);
                    }}
                />
            )}

            {/* Modal de Proveedor Rápido - FUERA DEL FORM PRINCIPAL */}
            {isSupplierModalOpen && (
                <QuickSupplierModal
                    onClose={() => setIsSupplierModalOpen(false)}
                    onSuccess={(newSup) => {
                        setLocalSuppliers(prev => [...prev, newSup].sort((a, b: any) => a.name.localeCompare(b.name)));
                        setSelectedSupplierId(newSup.id);
                    }}
                />
            )}
        </div>
    );
}
