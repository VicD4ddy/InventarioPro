"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { MoreVertical, Pencil, Trash2, PackageMinus, ChevronDown, Package, AlertTriangle, Search } from "lucide-react";
import { toast } from "sonner";
import type { Product, Category } from "@/lib/supabase/types";
import { getProductStatus } from "@/lib/supabase/types";
import { deleteProduct, deleteProducts } from "@/app/actions/products";
import StockAdjustModal from "@/components/StockAdjustModal";

interface InventoryTableProps {
    products: Product[];
    categories: Category[];
    currentSearch?: string;
    currentStatus?: string;
    currentCategory?: string;
}

// ──────────────────────────────────────────────
// Sub-componentes
// ──────────────────────────────────────────────
function StatusBadge({ status }: { status: ReturnType<typeof getProductStatus> }) {
    const styles = {
        "En Stock": "bg-emerald-50 text-emerald-600 border-emerald-100",
        "Stock Bajo": "bg-orange-50 text-orange-500 border-orange-100",
        "Sin Stock": "bg-red-50 text-red-500 border-red-100",
    };
    const dots = {
        "En Stock": "bg-emerald-500",
        "Stock Bajo": "bg-orange-500",
        "Sin Stock": "bg-red-500",
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
            {status}
        </span>
    );
}

function StockBar({ product }: { product: Product }) {
    const status = getProductStatus(product.stock, product.reorder_point);
    const pct = product.max_stock > 0
        ? Math.min(Math.round((product.stock / product.max_stock) * 100), 100)
        : 0;
    const barColor = status === "En Stock"
        ? "bg-emerald-500"
        : status === "Stock Bajo"
            ? "bg-orange-400"
            : "bg-slate-200";
    const textColor = status === "Stock Bajo"
        ? "text-orange-500"
        : status === "Sin Stock"
            ? "text-red-500"
            : "text-slate-800";

    return (
        <div className="flex flex-col items-end gap-1">
            <span className={`text-sm font-bold ${textColor}`}>
                {product.stock.toLocaleString("es")}
            </span>
            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

function ActionMenu({
    product,
    onAdjustStock,
}: {
    product: Product;
    onAdjustStock: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteProduct(product.id);
            if (result.success) {
                toast.success("Producto eliminado");
                router.refresh();
            } else {
                toast.error(result.error || "Error al eliminar producto");
            }
        });
        setOpen(false);
        setConfirming(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => { setOpen((p) => !p); setConfirming(false); }}
                disabled={isPending}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition mx-auto disabled:opacity-50"
            >
                <MoreVertical size={16} />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => { setOpen(false); setConfirming(false); }} />
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                        {/* Editar */}
                        <a
                            href={`/dashboard/productos/${product.id}/editar`}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                        >
                            <Pencil size={14} className="text-slate-400" />
                            Editar producto
                        </a>

                        {/* Ajustar stock */}
                        <button
                            onClick={() => { setOpen(false); onAdjustStock(); }}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition w-full text-left"
                        >
                            <PackageMinus size={14} className="text-slate-400" />
                            Ajustar stock
                        </button>

                        <div className="border-t border-slate-100 my-1" />

                        {/* Eliminar — con confirmación inline */}
                        {!confirming ? (
                            <button
                                onClick={() => setConfirming(true)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition w-full text-left"
                            >
                                <Trash2 size={14} />
                                Eliminar
                            </button>
                        ) : (
                            <div className="px-4 py-2.5">
                                <p className="text-xs text-slate-600 mb-2">¿Confirmar eliminación?</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setConfirming(false)}
                                        className="flex-1 px-2 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isPending}
                                        className="flex-1 px-2 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-60 transition"
                                    >
                                        {isPending ? "..." : "Sí, eliminar"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
export default function InventoryTable({
    products,
    categories,
    currentSearch,
    currentStatus,
    currentCategory,
}: InventoryTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
    const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
    const [confirmingBulk, setConfirmingBulk] = useState(false);
    const [isBulkPending, startBulkTransition] = useTransition();
    const handleBulkDelete = () => {
        startBulkTransition(async () => {
            const ids = Array.from(selected);
            const result = await deleteProducts(ids);
            if (result.success) {
                setRemovedIds((prev) => new Set([...prev, ...ids]));
                setSelected(new Set());
                setConfirmingBulk(false);
                toast.success(`${ids.length} productos eliminados correctamente`);
                router.refresh();
            } else {
                toast.error(result.error || "Error al eliminar productos");
                setConfirmingBulk(false);
            }
        });
    };

    const visibleProducts = products.filter((p) => !removedIds.has(p.id));
    const allSelected = visibleProducts.length > 0 && selected.size === visibleProducts.length;

    const toggleAll = () => {
        setSelected(allSelected ? new Set() : new Set(visibleProducts.map((p) => p.id)));
    };

    const toggleOne = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const updateFilter = useCallback(
        (key: string, value: string | null) => {
            const url = new URL(window.location.href);
            if (value) url.searchParams.set(key, value);
            else url.searchParams.delete(key);
            router.push(`${pathname}?${url.searchParams.toString()}`);
        },
        [router, pathname]
    );

    const statusOptions = [
        { label: "Todos los estados", value: null },
        { label: "En Stock", value: "en-stock" },
        { label: "Stock Bajo", value: "stock-bajo" },
        { label: "Sin Stock", value: "sin-stock" },
    ];

    return (
        <>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                {/* Cabecera de la tabla */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-bold text-slate-800">Inventario de Productos</h2>
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 text-xs font-semibold rounded-full border border-slate-200">
                            {visibleProducts.length} artículos
                        </span>
                        {selected.size > 0 && (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
                                    {selected.size} seleccionados
                                </span>

                                {!confirmingBulk ? (
                                    <button
                                        onClick={() => setConfirmingBulk(true)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 shadow-sm"
                                        title="Eliminar seleccionados"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-xl px-2 py-1 animate-in zoom-in-95 duration-200">
                                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-tight px-1">¿Borrar {selected.size}?</span>
                                        <button
                                            onClick={() => setConfirmingBulk(false)}
                                            className="px-2 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-700 transition"
                                        >
                                            No
                                        </button>
                                        <button
                                            onClick={handleBulkDelete}
                                            disabled={isBulkPending}
                                            className="px-2 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
                                        >
                                            {isBulkPending ? "..." : "Sí"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                defaultValue={currentSearch}
                                placeholder="Buscar por nombre, código o modelo..."
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        updateFilter("q", (e.target as HTMLInputElement).value || null);
                                    }
                                }}
                                className="w-full pl-11 pr-4 py-2.5 text-sm font-bold bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Filtro Estado */}
                        <div className="relative">
                            <select
                                value={currentStatus ?? ""}
                                onChange={(e) => updateFilter("status", e.target.value || null)}
                                className="appearance-none flex items-center gap-1.5 pl-3 pr-8 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                {statusOptions.map((opt) => (
                                    <option key={opt.value ?? "all"} value={opt.value ?? ""}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Filtro Categoría */}
                        <div className="relative">
                            <select
                                value={currentCategory ?? ""}
                                onChange={(e) => updateFilter("category", e.target.value || null)}
                                className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Vista de Tabla (Escritorio) */}
                <div className="hidden md:block overflow-x-auto">
                    {visibleProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                            <Package size={40} className="mb-3 opacity-30" />
                            <p className="text-sm font-medium">No se encontraron productos</p>
                            {(currentSearch || currentStatus || currentCategory) && (
                                <button
                                    onClick={() => router.push(pathname)}
                                    className="mt-2 text-xs text-blue-500 hover:underline"
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    ) : (
                        <table className="w-full mb-32">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/60">
                                    <th className="w-10 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={toggleAll}
                                            className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Información del Producto</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Código</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Categoría</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Precio</th>
                                    <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Stock</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Estado</th>
                                    <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleProducts.map((product, idx) => {
                                    const status = getProductStatus(product.stock, product.reorder_point);
                                    const category = product.categories;
                                    return (
                                        <tr
                                            key={product.id}
                                            className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${idx === visibleProducts.length - 1 ? "border-b-0" : ""
                                                } ${selected.has(product.id) ? "bg-blue-50/30" : ""}`}
                                        >
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.has(product.id)}
                                                    onChange={() => toggleOne(product.id)}
                                                    className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                        {product.image_url && product.image_url.startsWith("http") ? (
                                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xl">{product.image_url || "📦"}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col leading-tight">
                                                        <span className="text-sm font-semibold text-slate-800">{product.name}</span>
                                                        {product.subtitle && (
                                                            <span className="text-xs text-slate-400 mt-0.5">{product.subtitle}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                                    {product.sku}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {category ? (
                                                    <span className={`inline-flex px-2.5 py-1 rounded-xl text-xs font-semibold border ${category.color_class}`}>
                                                        {category.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-300">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm font-semibold text-slate-800">
                                                    ${product.price.toLocaleString("es", { minimumFractionDigits: 2 })}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <StockBar product={product} />
                                            </td>
                                            <td className="px-4 py-4">
                                                <StatusBadge status={status} />
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <ActionMenu
                                                    product={product}
                                                    onAdjustStock={() => setAdjustingProduct(product)}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Vista de Tarjetas (Móvil) */}
                <div className="md:hidden grid grid-cols-1 gap-4 p-4 pb-32">
                    {visibleProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                            <Package size={32} className="mb-2 opacity-30" />
                            <p className="text-xs font-medium">No se encontraron productos</p>
                        </div>
                    ) : (
                        visibleProducts.map((product) => {
                            const status = getProductStatus(product.stock, product.reorder_point);
                            const category = product.categories;
                            return (
                                <div key={product.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                                                {product.image_url && product.image_url.startsWith("http") ? (
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl">{product.image_url || "📦"}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-800 line-clamp-1">{product.name}</span>
                                                <span className="text-[10px] font-mono text-slate-400">{product.sku}</span>
                                            </div>
                                        </div>
                                        <ActionMenu
                                            product={product}
                                            onAdjustStock={() => setAdjustingProduct(product)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between py-2 border-y border-slate-50 border-dashed">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Precio</span>
                                            <span className="text-sm font-black text-slate-900">${product.price.toLocaleString("es", { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Categoría</span>
                                            {category ? (
                                                <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold border ${category.color_class}`}>
                                                    {category.name}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-300">—</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <StatusBadge status={status} />
                                        <StockBar product={product} />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Modal de ajuste de stock */}
            {adjustingProduct && (
                <StockAdjustModal
                    product={adjustingProduct}
                    onClose={() => { setAdjustingProduct(null); router.refresh(); }}
                />
            )}
        </>
    );
}
