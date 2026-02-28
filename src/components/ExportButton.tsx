"use client";

import { Download } from "lucide-react";
import { Product } from "@/lib/supabase/types";

interface ExportButtonProps {
    products: Product[];
    totalCount: number;
}

export default function ExportButton({ products, totalCount }: ExportButtonProps) {
    const handleExport = () => {
        // Definir columnas (Maestras para InventarioPRO)
        const headers = [
            "Código",
            "Producto",
            "Modelo/Subtítulo",
            "Categoría",
            "Proveedor",
            "Stock Actual",
            "Precio",
            "Stock Mínimo",
            "Ubicación"
        ];

        // Crear filas de datos
        const rows = products.map(p => [
            p.sku || "",
            p.name || "",
            p.subtitle || "",
            (p as any).categories?.name || "",
            (p as any).suppliers?.name || "",
            p.stock?.toString() || "0",
            p.price?.toString() || "0",
            p.reorder_point?.toString() || "0",
            "" // Ubicación (si existiera en el esquema, por ahora vacío)
        ]);

        // Estilos Inline para Excel
        const headerStyle = "background-color: #4F46E5; color: #FFFFFF; font-weight: bold; height: 35px; text-align: left; padding: 8px; border: 1px solid #E2E8F0;";
        const cellStyle = "padding: 8px; border: 1px solid #F1F5F9; color: #1E293B; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 11px;";
        const titleStyle = "font-size: 20px; font-weight: 800; color: #0F172A; padding-bottom: 15px; font-family: 'Segoe UI', sans-serif;";

        // Generar contenido profesional compatible con Excel (vía XML/HTML)
        const htmlContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8">
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>InventarioPRO</x:Name>
                                <x:WorksheetOptions>
                                    <x:DisplayGridlines/>
                                </x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
            </head>
            <body style="font-family: 'Segoe UI', sans-serif;">
                <table>
                    <tr>
                        <td colspan="${headers.length}" style="${titleStyle}">REPORTE DE INVENTARIO - INVENTARIOPRO</td>
                    </tr>
                    <tr style="height: 10px;"></tr>
                    <tr>
                        ${headers.map(h => `<th style="${headerStyle}">${h}</th>`).join('')}
                    </tr>
                    ${rows.map(row => `
                        <tr>
                            ${row.map(cell => `<td style="${cellStyle}">${cell}</td>`).join('')}
                        </tr>
                    `).join('')}
                </table>
            </body>
            </html>
        `;

        // Crear Blob y descargar
        const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        const fileName = totalCount === 0
            ? "InventarioPRO_Plantilla.xls"
            : `InventarioPRO_Export_${new Date().toISOString().split('T')[0]}.xls`;

        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-3.5 text-sm font-bold rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-sm group active:scale-95"
        >
            <Download size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <span className="group-hover:text-indigo-600 transition-colors">
                {totalCount === 0 ? "Descargar Plantilla Excel" : "Exportar Inventario"}
            </span>
        </button>
    );
}
