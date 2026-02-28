"use client";

import { useState, useRef } from "react";
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2, ChevronRight } from "lucide-react";
import { importProducts } from "@/app/actions/products";

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [results, setResults] = useState<{ created: number, updated: number, errors: string[] } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        setFile(selectedFile);
        parseFile(selectedFile);
    };

    const parseFile = async (file: File) => {
        setIsParsing(true);
        const text = await file.text();
        let rows: any[] = [];

        try {
            if (text.includes("<table") || text.includes("<html")) {
                // Parse HTML (XLS Profesional que generamos)
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, "text/html");
                const trs = Array.from(doc.querySelectorAll("tr"));

                // Saltar el título y la fila vacía si existen
                const dataRows = trs.filter(tr => tr.querySelectorAll("td, th").length >= 5);
                const headers = Array.from(dataRows[0].querySelectorAll("th, td")).map(el => el.textContent?.trim());

                rows = dataRows.slice(1).map(tr => {
                    const cells = Array.from(tr.querySelectorAll("td"));
                    const obj: any = {};
                    headers.forEach((h, i) => {
                        if (h) obj[h] = cells[i]?.textContent?.trim() || "";
                    });
                    return obj;
                });
            } else {
                // Parse CSV (Semicolon)
                const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
                if (lines.length > 0) {
                    const headers = lines[0].replace(/\uFEFF/g, "").split(";").map(h => h.replace(/"/g, "").trim());
                    rows = lines.slice(1).map(line => {
                        const values = line.split(";").map(v => v.replace(/"/g, "").trim());
                        const obj: any = {};
                        headers.forEach((h, i) => {
                            if (h) obj[h] = values[i] || "";
                        });
                        return obj;
                    });
                }
            }
            setPreviewData(rows);
        } catch (err) {
            console.error("Error parsing file:", err);
        } finally {
            setIsParsing(false);
        }
    };

    const handleConfirmImport = async () => {
        setIsImporting(true);
        const res = await importProducts(previewData);
        if (res.success && res.results) {
            setResults(res.results);
        }
        setIsImporting(false);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Importación Masiva</h2>
                        <p className="text-slate-500 text-sm font-medium">Sube tu archivo Excel o CSV para actualizar el inventario.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    {!file && !results && (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-200 rounded-[40px] p-16 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition-all group"
                        >
                            <div className="w-20 h-20 rounded-[28px] bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload size={32} />
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-slate-900">Arrastra tu archivo aquí</p>
                                <p className="text-slate-400 font-medium">O haz clic para seleccionar (Excel .xls o CSV)</p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".xls,.csv,.txt"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}

                    {file && !results && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{file.name}</p>
                                        <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(2)} KB - {previewData.length} filas detectadas</p>
                                    </div>
                                </div>
                                <button onClick={() => { setFile(null); setPreviewData([]); }} className="text-xs font-bold text-rose-500 hover:underline">Cambiar archivo</button>
                            </div>

                            <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-4 py-3 font-black text-slate-400 uppercase text-[10px]">SKU</th>
                                            <th className="px-4 py-3 font-black text-slate-400 uppercase text-[10px]">Producto</th>
                                            <th className="px-4 py-3 font-black text-slate-400 uppercase text-[10px]">Categoría</th>
                                            <th className="px-4 py-3 font-black text-slate-400 uppercase text-[10px]">Stock</th>
                                            <th className="px-4 py-3 font-black text-slate-400 uppercase text-[10px]">Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {previewData.slice(0, 5).map((row, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50">
                                                <td className="px-4 py-3 font-mono text-slate-600">{row.sku || row["Código"] || "-"}</td>
                                                <td className="px-4 py-3 font-bold text-slate-900">{row.name || row["Producto"] || "-"}</td>
                                                <td className="px-4 py-3 text-slate-500">{row.category || row["Categoría"] || "-"}</td>
                                                <td className="px-4 py-3 text-slate-900 font-bold">{row.stock || row["Stock Actual"] || "0"}</td>
                                                <td className="px-4 py-3 text-indigo-600 font-black">${row.price || row["Precio"] || "0"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {previewData.length > 5 && (
                                    <div className="px-4 py-2 bg-slate-50/50 text-center text-xs text-slate-400 italic">
                                        Y {previewData.length - 5} productos más...
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {results && (
                        <div className="space-y-8 py-4 animate-in zoom-in duration-300">
                            <div className="text-center space-y-2">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900">¡Importación Exitosa!</h3>
                                <p className="text-slate-500 font-medium">Los cambios se han aplicado al inventario maestro.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl text-center">
                                    <p className="text-emerald-800 font-black text-3xl">{results.created}</p>
                                    <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mt-1">Nuevos Creados</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl text-center">
                                    <p className="text-blue-800 font-black text-3xl">{results.updated}</p>
                                    <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mt-1">Existentes Actualizados</p>
                                </div>
                            </div>

                            {results.errors.length > 0 && (
                                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                                        <AlertCircle size={18} />
                                        Log de incidencias ({results.errors.length})
                                    </div>
                                    <ul className="text-xs text-amber-700 space-y-1">
                                        {results.errors.slice(0, 3).map((err, i) => <li key={i}>• {err}</li>)}
                                        {results.errors.length > 3 && <li>y {results.errors.length - 3} errores más...</li>}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        {results ? "Cerrar" : "Cancelar"}
                    </button>
                    {!results && file && (
                        <button
                            disabled={isImporting || isParsing}
                            onClick={handleConfirmImport}
                            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                        >
                            {isImporting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Importando...
                                </>
                            ) : (
                                <>
                                    Confirmar Importación
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>
                    )}
                    {results && (
                        <button
                            onClick={() => { window.location.reload(); onClose(); }}
                            className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all"
                        >
                            Terminar y Refrescar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
