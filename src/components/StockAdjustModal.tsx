"use client";

import { useState, useTransition } from "react";
import { X, Plus, Minus, Loader2, CheckCircle2 } from "lucide-react";
import { adjustStock } from "@/app/actions/products";
import type { Product } from "@/lib/supabase/types";

interface StockAdjustModalProps {
    product: Product;
    onClose: () => void;
}

const MOVEMENT_TYPES = [
    { value: "purchase", label: "Compra / Entrada" },
    { value: "sale", label: "Venta / Salida" },
    { value: "adjustment", label: "Ajuste manual" },
    { value: "return", label: "Devolución" },
    { value: "transfer", label: "Transferencia" },
] as const;

type MovType = "purchase" | "sale" | "adjustment" | "return" | "transfer";

export default function StockAdjustModal({ product, onClose }: StockAdjustModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [type, setType] = useState<MovType>("adjustment");
    const [reference, setReference] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Las ventas/salidas son negativas
    const isNegative = type === "sale" || type === "transfer";
    const finalQty = isNegative ? -Math.abs(quantity) : Math.abs(quantity);
    const newStock = product.stock + finalQty;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (quantity <= 0) { setError("La cantidad debe ser mayor a 0."); return; }
        if (newStock < 0) { setError("Stock insuficiente para esta operación."); return; }
        setError(null);

        startTransition(async () => {
            const result = await adjustStock(product.id, finalQty, type, reference || undefined, notes || undefined);
            if (result.success) {
                setSuccess(true);
                setTimeout(onClose, 1200);
            } else {
                setError(result.error ?? "Error desconocido");
            }
        });
    };

    return (
        /* Overlay */
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Ajustar Stock</h2>
                        <p className="text-xs text-slate-500 mt-0.5">{product.name} · Stock actual: <strong>{product.stock}</strong></p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
                        <X size={18} />
                    </button>
                </div>

                {success ? (
                    <div className="flex flex-col items-center py-10 gap-3">
                        <CheckCircle2 size={40} className="text-emerald-500" />
                        <p className="text-sm font-semibold text-slate-700">Stock actualizado a <strong>{newStock}</strong></p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                        {/* Tipo de movimiento */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipo de movimiento</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as MovType)}
                                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                            >
                                {MOVEMENT_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Cantidad */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cantidad</label>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition flex-shrink-0"
                                >
                                    <Minus size={15} />
                                </button>
                                <input
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="flex-1 text-center px-3 py-2.5 text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition flex-shrink-0"
                                >
                                    <Plus size={15} />
                                </button>
                            </div>
                            {/* Preview */}
                            <div className={`mt-2 text-xs font-medium text-center rounded-lg py-1.5 ${newStock < 0 ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-500"}`}>
                                {product.stock} {isNegative ? "−" : "+"} {quantity} = <strong className={newStock < 0 ? "text-red-600" : "text-slate-800"}>{newStock} unidades</strong>
                            </div>
                        </div>

                        {/* Referencia */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Referencia <span className="text-slate-400 font-normal">(opcional)</span></label>
                            <input
                                type="text"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                placeholder="Nº de factura, orden, etc."
                                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition placeholder-slate-300"
                            />
                        </div>

                        {/* Notas */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Notas <span className="text-slate-400 font-normal">(opcional)</span></label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={2}
                                placeholder="Motivo del ajuste..."
                                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition placeholder-slate-300 resize-none"
                            />
                        </div>

                        {error && (
                            <div className="px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Acciones */}
                        <div className="flex gap-3 pt-1">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isPending || newStock < 0}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition shadow-sm shadow-blue-100"
                            >
                                {isPending ? <><Loader2 size={15} className="animate-spin" /> Guardando...</> : "Confirmar ajuste"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
