import { getStockMovements } from "@/app/actions/historial";
import {
    Package,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCcw,
    Search,
    Filter,
    Tag,
    Calendar,
    Hash,
    Layers,
    ClipboardList,
    ArrowRight,
    Sparkles
} from "lucide-react";
import ExportHistoryButton from "@/components/ExportHistoryButton";

interface PageProps {
    searchParams: Promise<{ q?: string; type?: string; demo?: string }>;
}

const MOCK_MOVEMENTS = [
    {
        id: "m1",
        created_at: new Date(Date.now() - 3600000).toISOString(),
        type: "purchase",
        quantity: 50,
        stock_after: 50,
        stock_before: 0,
        unit_cost: 10,
        reference: "INV-001",
        notes: "Entrada inicial de mercadería",
        products: { name: "Nike Air Max 270", sku: "NIKE-270-B" }
    },
    {
        id: "m2",
        created_at: new Date(Date.now() - 1800000).toISOString(),
        type: "sale",
        quantity: -5,
        stock_after: 45,
        stock_before: 50,
        unit_cost: 10,
        reference: "TICKET-442",
        notes: "Venta POS Mostrador",
        products: { name: "Nike Air Max 270", sku: "NIKE-270-B" }
    },
    {
        id: "m3",
        created_at: new Date(Date.now() - 600000).toISOString(),
        type: "adjustment",
        quantity: -2,
        stock_after: 43,
        stock_before: 45,
        unit_cost: 10,
        reference: "DAÑO",
        notes: "Ajuste por producto defectuoso",
        products: { name: "Nike Air Max 270", sku: "NIKE-270-B" }
    }
];

export default async function HistorialPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const isDemo = params.demo === "true";

    let movements = isDemo
        ? MOCK_MOVEMENTS as any
        : await getStockMovements({
            search: params.q,
            type: params.type
        });

    const getTypeDetails = (type: string) => {
        switch (type) {
            case "purchase":
                return { label: "Compra", color: "text-emerald-600 bg-emerald-50", icon: <ArrowDownLeft size={14} /> };
            case "sale":
                return { label: "Venta", color: "text-blue-600 bg-blue-50", icon: <ArrowUpRight size={14} /> };
            case "adjustment":
                return { label: "Ajuste", color: "text-amber-600 bg-amber-50", icon: <RefreshCcw size={14} /> };
            case "return":
                return { label: "Devolución", color: "text-purple-600 bg-purple-50", icon: <RefreshCcw size={14} /> };
            default:
                return { label: type, color: "text-slate-600 bg-slate-50", icon: <Tag size={14} /> };
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Historial de Inventario</h1>
                    <p className="text-slate-500 mt-1.5 flex items-center gap-2">
                        <Layers size={16} className="text-slate-400" />
                        Rastreo completo de entradas, salidas y ajustes de stock.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <ExportHistoryButton movements={movements} />
                    <div className="bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-sm flex items-center gap-5">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Movimientos</span>
                            <span className="text-xl font-black text-slate-800 tracking-tight">{movements.length}</span>
                        </div>
                        <div className="w-px h-8 bg-slate-100" />
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <ClipboardList size={22} className="text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Banner Modo Demo */}
            {isDemo && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-3 flex items-center justify-between gap-4 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                            <Sparkles size={16} />
                        </div>
                        <p className="text-sm font-bold text-amber-800">Estás visualizando datos de ejemplo. Los movimientos mostrados son simulados.</p>
                    </div>
                    <a
                        href="/dashboard/historial"
                        className="bg-white px-4 py-2 rounded-xl border border-amber-200 text-xs font-black uppercase tracking-widest text-amber-600 hover:bg-amber-100 transition-all shadow-sm"
                    >
                        Salir del Demo
                    </a>
                </div>
            )}

            {!isDemo && movements.length === 0 && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] p-8 text-white shadow-xl shadow-blue-200 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                            <Sparkles size={32} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-black mb-1">Tu historial está vacío</h2>
                            <p className="text-white/80 text-sm font-medium">¿Quieres ver cómo funciona el rastreo de inventario? Activa el modo demo para ver movimientos de ejemplo.</p>
                        </div>
                        <a
                            href="/dashboard/historial?demo=true"
                            className="px-6 py-3 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-lg active:scale-95 text-sm"
                        >
                            Ver Movimientos de Ejemplo
                        </a>
                    </div>
                </div>
            )}

            {/* Filtros y Búsqueda */}
            <div className="bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-2 items-center">
                <form className="flex-1 w-full relative group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        name="q"
                        type="text"
                        placeholder="Buscar por producto, código o referencia..."
                        defaultValue={params.q}
                        className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50/50 border border-transparent rounded-[18px] focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all"
                    />
                </form>

                <div className="flex items-center gap-2 w-full md:w-auto p-1">
                    <select
                        name="type"
                        defaultValue={params.type || "all"}
                        className="flex-1 md:w-44 px-4 py-3 text-sm bg-white border border-slate-100 rounded-[18px] text-slate-600 font-medium outline-none focus:ring-4 focus:ring-slate-50 transition-all cursor-pointer hover:bg-slate-50"
                    >
                        <option value="all">Todos los tipos</option>
                        <option value="purchase">Compras (Entradas)</option>
                        <option value="sale">Ventas (Salidas)</option>
                        <option value="adjustment">Ajustes</option>
                        <option value="return">Devoluciones</option>
                    </select>

                    <button className="h-[46px] w-[46px] flex items-center justify-center bg-slate-900 text-white rounded-[18px] shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-transform active:scale-95">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Listado de Movimientos */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden min-h-[400px]">
                {/* Vista Tabla (Escritorio) */}
                <table className="w-full border-collapse hidden md:table">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Fecha y Hora</th>
                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Producto</th>
                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Tipo</th>
                            <th className="px-6 py-5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Cantidad</th>
                            <th className="px-6 py-5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Stock (Antes → Después)</th>
                            <th className="px-6 py-5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Costo Unit.</th>
                            <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Ref / Notas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {movements.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                                            <RefreshCcw size={32} className="text-slate-200 animate-spin-slow" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-slate-900">No se encontraron movimientos</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            movements.map((m: any) => {
                                const type = getTypeDetails(m.type);
                                const dateObj = new Date(m.created_at);
                                const formattedDate = new Intl.DateTimeFormat('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }).format(dateObj);

                                return (
                                    <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <Calendar size={14} className="text-slate-300" />
                                                <span className="text-sm font-medium text-slate-600">{formattedDate}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                                                    {(m as any).products?.name || "Producto Eliminado"}
                                                </span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <Hash size={10} className="text-slate-400" />
                                                    <span className="text-[11px] font-semibold text-slate-400 tracking-wide">
                                                        {(m as any).products?.sku || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${type.color}`}>
                                                {type.icon}
                                                {type.label}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right font-mono">
                                            <span className={`text-sm font-black ${m.quantity > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                                {m.quantity > 0 ? "+" : ""}{m.quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-xs font-bold text-slate-400">{(m as any).stock_before || 0}</span>
                                                <ArrowRight size={12} className="text-slate-300" />
                                                <span className="text-sm font-black text-slate-900">{m.stock_after}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right font-mono">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-xs font-bold text-blue-600">
                                                    ${(m as any).unit_cost?.toFixed(2) || "0.00"}
                                                </span>
                                                {m.exchange_rate > 0 && (
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                            {((m.unit_cost || 0) * m.exchange_rate).toLocaleString("es-VE", { minimumFractionDigits: 2 })} Bs
                                                        </span>
                                                        <span className="text-[8px] text-slate-300 font-medium">
                                                            Tasa: {m.exchange_rate.toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col max-w-[200px]">
                                                {m.reference && (
                                                    <span className="text-[11px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md inline-block self-start mb-1">
                                                        REF: {m.reference}
                                                    </span>
                                                )}
                                                <p className="text-xs text-slate-500 italic truncate" title={m.notes || ""}>
                                                    {m.notes || "Sin notas adicionales"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

                {/* Vista Móvil (Cards) */}
                <div className="md:hidden divide-y divide-slate-50">
                    {movements.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 py-20">
                            <RefreshCcw size={32} className="text-slate-200" />
                            <p className="text-sm font-bold text-slate-400">Sin movimientos</p>
                        </div>
                    ) : (
                        movements.map((m: any) => {
                            const type = getTypeDetails(m.type);
                            const dateObj = new Date(m.created_at);
                            const formattedDate = new Intl.DateTimeFormat('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                            }).format(dateObj);

                            return (
                                <div key={m.id} className="p-4 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} className="text-slate-300" />
                                            <span className="text-[11px] font-bold text-slate-400 tracking-tight uppercase">{formattedDate}</span>
                                        </div>
                                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${type.color}`}>
                                            {type.icon}
                                            {type.label}
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900">
                                            {(m as any).products?.name || "Producto Eliminado"}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-400 underline decoration-slate-200">
                                            {(m as any).products?.sku || "N/A"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cantidad</span>
                                            <span className={`text-base font-black ${m.quantity > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                                {m.quantity > 0 ? "+" : ""}{m.quantity}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock Final</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] font-bold text-slate-300">{(m as any).stock_before || 0}</span>
                                                <ArrowRight size={10} className="text-slate-300" />
                                                <span className="text-sm font-black text-slate-900">{m.stock_after}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {m.reference && (
                                        <div className="text-[10px] font-bold text-blue-600 bg-blue-50/50 px-2 py-1 rounded-lg self-start">
                                            REF: {m.reference}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}} />
        </div>
    );
}
