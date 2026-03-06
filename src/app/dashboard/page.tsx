import {
    TrendingUp,
    Package,
    AlertTriangle,
    Download,
    Plus,
    RefreshCcw
} from "lucide-react";
import KpiCard from "@/components/KpiCard";
import { createClient } from "@/lib/supabase/server";
import type { Product, KpiSummary, KpiSnapshot } from "@/lib/supabase/types";
import { getStockMovements } from "@/app/actions/historial";
import InfoTooltip from "@/components/InfoTooltip";

export const revalidate = 60; // Re-validar cada 60s

async function getKpiData(userId: string): Promise<{
    summary: KpiSummary;
    sparklines: { value: number[]; products: number[]; lowStock: number[] };
    lastUpdated: string | null;
}> {
    const supabase = await createClient();

    // KPI summary via RPC
    const { data: summaryData } = await supabase.rpc("get_kpi_summary");

    const summary: KpiSummary = (summaryData as any)?.[0] ?? {
        total_value: 0,
        total_products: 0,
        low_stock_count: 0,
        out_of_stock: 0,
    };

    // Últimos 8 snapshots para sparklines
    const { data: snapshots } = await supabase
        .from("kpi_snapshots")
        .select("total_inventory_value, total_products, low_stock_count, snapshot_date")
        .eq("user_id", userId)
        .order("snapshot_date", { ascending: false })
        .limit(8);

    const reversed = (snapshots ?? []).reverse() as Pick<
        KpiSnapshot,
        "total_inventory_value" | "total_products" | "low_stock_count" | "snapshot_date"
    >[];

    // Si no hay snapshots aún, usar datos de ejemplo para el sparkline
    const fallback = [30, 42, 38, 55, 48, 65, 70, 80];
    const sparklines = {
        value: reversed.length >= 2
            ? reversed.map((s) => s.total_inventory_value)
            : fallback,
        products: reversed.length >= 2
            ? reversed.map((s) => s.total_products)
            : [50, 55, 48, 60, 65, 70, 68, 78],
        lowStock: reversed.length >= 2
            ? reversed.map((s) => s.low_stock_count)
            : [60, 55, 70, 50, 65, 45, 55, 50],
    };

    // Fecha de última actualización (producto más reciente)
    const { data: lastProduct } = await supabase
        .from("products")
        .select("updated_at")
        .eq("is_active", true)
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

    const lastUpdated = (lastProduct as any)?.updated_at ?? null;

    return { summary, sparklines, lastUpdated };
}

function formatTimeAgo(dateStr: string | null): string {
    if (!dateStr) return "Sin datos";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Justo ahora";
    if (mins < 60) return `hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `hace ${hrs}h`;
    return `hace ${Math.floor(hrs / 24)}d`;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("es-VE", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
}

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { summary, sparklines, lastUpdated } = await getKpiData(user.id);

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto animate-in fade-in duration-500">
            {/* Encabezado de la Página */}
            <div className="flex items-start justify-between flex-wrap gap-y-3">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Panel de Control
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                        Resumen estratégico del rendimiento de tu inventario.
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mr-2">
                        Actualizado: {formatTimeAgo(lastUpdated)}
                    </span>
                    <a
                        href="/dashboard/productos/nuevo"
                        className="flex items-center gap-2 px-6 py-3.5 text-sm font-black rounded-2xl bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        Acción Rápida
                    </a>
                </div>
            </div>

            {/* Tarjetas KPI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard
                    title="Valor de Inventario"
                    tooltipText="Suma total del costo de todos los productos en stock."
                    value={formatCurrency(summary.total_value)}
                    icon={<TrendingUp size={18} className="text-blue-600" />}
                    iconBg="bg-blue-50"
                    badge={
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600">
                            En Tiempo Real
                        </span>
                    }
                    subtext="Actualizado ahora"
                    sparklineColor="#3b82f6"
                    sparklinePoints={sparklines.value}
                />

                <KpiCard
                    title="Stock Total"
                    tooltipText="Cantidad total de unidades físicas almacenadas."
                    value={summary.total_products.toLocaleString("es")}
                    icon={<Package size={18} className="text-indigo-600" />}
                    iconBg="bg-indigo-50"
                    badge={
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-indigo-600">
                            {summary.out_of_stock > 0 ? `${summary.out_of_stock} agotados` : "Saludable"}
                        </span>
                    }
                    sparklineColor="#6366f1"
                    sparklinePoints={sparklines.products}
                />

                <KpiCard
                    title="Alertas Activas"
                    tooltipText="Productos que están cerca o por debajo de su punto de reorden."
                    value={summary.low_stock_count.toString()}
                    icon={<AlertTriangle size={18} className="text-orange-500" />}
                    iconBg="bg-orange-50"
                    badge={
                        <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                            Acción Requerida
                        </span>
                    }
                    subtext={summary.low_stock_count > 0 ? "Reponer pronto" : "Todo despejado"}
                    sparklineColor="#f97316"
                    sparklinePoints={sparklines.lowStock}
                    alert={summary.low_stock_count > 0}
                />
            </div>

            {/* Contenido Principal: Resumen Ejecutivo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Actividad Reciente (Dash) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                                    <RefreshCcw size={20} />
                                </div>
                                <div className="flex items-center">
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Actividad Reciente</h3>
                                    <InfoTooltip text="Últimos movimientos de entradas o salidas registrados en tu inventario." position="bottom" />
                                </div>
                            </div>
                            <a href="/dashboard/historial" className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">Ver Todo</a>
                        </div>
                        <div className="p-2">
                            <RecentMovementsDash />
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Alertas y Sugerencias */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden border-t-4 border-t-orange-500">
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center">
                                <h3 className="text-lg font-black text-slate-800 tracking-tight">Stock Crítico</h3>
                                <InfoTooltip text="Productos que necesitan ser reabastecidos urgentemente." position="bottom" />
                            </div>
                        </div>
                        <div className="p-4">
                            <LowStockAlerts userId={user.id} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10">
                            <h4 className="text-xl font-black mb-2">Análisis de Stock</h4>
                            <p className="text-xs text-blue-100 leading-relaxed mb-6">Optimiza tus compras basándote en el historial de movimientos.</p>
                            <a href="/dashboard/reportes" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-lg">
                                Ver Reportes
                                <TrendingUp size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function RecentMovementsDash() {
    const movements = await getStockMovements();
    const recent = movements.slice(0, 5);

    if (recent.length === 0) {
        return (
            <div className="py-20 text-center">
                <p className="text-sm text-slate-400 font-medium italic">No hay actividad registrada aún.</p>
            </div>
        )
    }

    return (
        <div className="divide-y divide-slate-50">
            {recent.map((m: any) => (
                <div key={m.id} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.type === 'purchase' ? 'bg-emerald-50 text-emerald-600' :
                            m.type === 'sale' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                            }`}>
                            <Package size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors tracking-tight">{m.products?.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                {m.type === 'purchase' ? 'Entrada' : 'Salida'} · {Math.abs(m.quantity)} unidades
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-black text-slate-800">
                            {new Date(m.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Stock: {m.stock_after}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

async function LowStockAlerts({ userId }: { userId: string }) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .gt("stock", 0)
        .lte("stock", 10)
        .order("stock", { ascending: true })
        .limit(4) as { data: Product[] | null };

    if (!data || data.length === 0) {
        return (
            <div className="py-10 text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package size={20} />
                </div>
                <p className="text-xs font-bold text-slate-400 px-4">Inventario completo.</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {data.map((p) => (
                <div key={p.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-lg hover:shadow-slate-200/20 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500 group-hover:animate-pulse" />
                        <div>
                            <p className="text-xs font-bold text-slate-800 tracking-tight truncate max-w-[120px]">{p.name}</p>
                            <p className="text-[10px] text-orange-600 font-black tracking-widest uppercase mt-0.5">{p.stock} Uds.</p>
                        </div>
                    </div>
                    <a href={`/dashboard/productos/${p.id}/editar`} className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                        <TrendingUp size={14} />
                    </a>
                </div>
            ))}
            <a href="/dashboard/catalogo?status=stock-bajo" className="block text-center py-3 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors mt-2 tracking-widest">Ver Gestionar Alertas</a>
        </div>
    )
}
