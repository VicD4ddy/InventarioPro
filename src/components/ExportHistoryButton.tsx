"use client";

import { Download } from "lucide-react";
import { StockMovement } from "@/lib/supabase/types";

interface ExportHistoryButtonProps {
    movements: StockMovement[];
}

export default function ExportHistoryButton({ movements }: ExportHistoryButtonProps) {
    const handleExport = () => {
        const headers = [
            "Fecha",
            "SKU",
            "Producto",
            "Tipo",
            "Cantidad",
            "Stock Anterior",
            "Stock Final",
            "Costo Unitario",
            "Referencia",
            "Notas"
        ];

        const rows = movements.map(m => {
            const date = new Date(m.created_at).toLocaleString('es-ES');
            let typeLabel: string = m.type;
            switch (m.type) {
                case "purchase": typeLabel = "Compra"; break;
                case "sale": typeLabel = "Venta"; break;
                case "adjustment": typeLabel = "Ajuste"; break;
                case "return": typeLabel = "Devolución"; break;
            }

            return [
                date,
                (m as any).products?.sku || "N/A",
                (m as any).products?.name || "Producto Eliminado",
                typeLabel,
                m.quantity.toString(),
                (m as any).stock_before?.toString() || "0",
                m.stock_after.toString(),
                (m as any).unit_cost?.toString() || "0",
                m.reference || "",
                m.notes || ""
            ];
        });

        // Estilos profesionales
        const headerStyle = "background-color: #1E293B; color: #FFFFFF; font-weight: bold; padding: 10px; border: 1px solid #334155;";
        const cellStyle = "padding: 8px; border: 1px solid #E2E8F0; font-family: Segoe UI, sans-serif; font-size: 11px;";
        const titleStyle = "font-size: 18px; font-weight: bold; color: #0F172A; padding-bottom: 20px;";

        const htmlContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head><meta charset="utf-8"></head>
            <body>
                <table>
                    <tr><td colspan="${headers.length}" style="${titleStyle}">AUDITORÍA DE MOVIMIENTOS - INVENTARIOPRO</td></tr>
                    <tr>${headers.map(h => `<th style="${headerStyle}">${h}</th>`).join('')}</tr>
                    ${rows.map(row => `<tr>${row.map(cell => `<td style="${cellStyle}">${cell}</td>`).join('')}</tr>`).join('')}
                </table>
            </body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Auditoria_Inventario_${new Date().toISOString().split('T')[0]}.xls`;
        link.click();
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
            <Download size={16} className="text-slate-400" />
            Exportar Auditoría
        </button>
    );
}
