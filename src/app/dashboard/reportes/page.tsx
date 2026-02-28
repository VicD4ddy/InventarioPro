import { createClient } from "@/lib/supabase/server";
import { BarChart2, TrendingUp, Package, AlertCircle, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";

async function getReportData(userId: string) {
    const supabase = await createClient();

    // KPIs resumidos
    const { data: summary } = await supabase.rpc("get_kpi_summary");
    const kpi = (summary as any)?.[0] || { total_value: 0, total_products: 0, low_stock_count: 0 };

    // Datos por categoría para el gráfico de barras
    const { data: categoryStats } = await supabase
        .from("products")
        .select("categories(name), stock, price")
        .eq("user_id", userId)
        .eq("is_active", true);

    const statsByCategory: Record<string, { count: number, value: number }> = {};
    (categoryStats || []).forEach((p: any) => {
        const catName = p.categories?.name || "Sin Categoría";
        if (!statsByCategory[catName]) statsByCategory[catName] = { count: 0, value: 0 };
        statsByCategory[catName].count += 1;
        statsByCategory[catName].value += (p.stock * p.price);
    });

    return { kpi, statsByCategory: Object.entries(statsByCategory).sort((a, b) => b[1].value - a[1].value) };
}

export default async function ReportesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { kpi, statsByCategory } = await getReportData(user.id);

    return (
        <div className="max-w-[1200px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 rounded-[22px] bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-100">
                            <BarChart2 size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reportes Avanzados</h1>
                            <p className="text-slate-500 font-medium font-bold flex items-center gap-2">
                                <Calendar size={16} className="text-slate-300" />
                                Periodo actual: {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-200">
                    Sincronizado <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
                </div>
            </div>

            {/* Grid de Reportes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Distribución por Categoría (Gráfico CSS) */}
                <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:text-slate-100 transition-colors">
                        <TrendingUp size={120} strokeWidth={1} />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            Valor de Inventario por Categoría
                            <span className="text-xs font-bold text-slate-400 px-3 py-1 bg-slate-50 rounded-full">USD</span>
                        </h3>

                        <div className="space-y-8">
                            {statsByCategory.length === 0 ? (
                                <p className="text-center py-20 text-slate-400 italic">No hay datos suficientes para generar gráficos.</p>
                            ) : (
                                statsByCategory.map(([name, data]) => {
                                    const maxValue = statsByCategory[0][1].value;
                                    const percentage = (data.value / maxValue) * 100;
                                    return (
                                        <div key={name} className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className="text-sm font-black text-slate-700">{name}</span>
                                                <span className="text-sm font-black text-slate-900">
                                                    ${data.value.toLocaleString('es-ES', { minimumFractionDigits: 0 })}
                                                </span>
                                            </div>
                                            <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                                                <span>{data.count} Productos</span>
                                                <span>{Math.round(percentage)}% del volumen</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Resumen Lateral */}
                <div className="space-y-8">
                    {/* Tarjeta de Utilidad Proyectada */}
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-200 border border-slate-800 relative overflow-hidden">
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Stock Crítico</h4>
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-4xl font-black tracking-tighter">{kpi.low_stock_count}</span>
                            <div className="flex items-center gap-1 text-orange-400 text-xs font-bold mb-1">
                                <ArrowUpRight size={14} />
                                Requiere acción
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">
                            Tienes {kpi.low_stock_count} productos por debajo del punto de reorden. Te recomendamos reponer stock.
                        </p>
                    </div>

                    {/* Quick Analytics */}
                    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 underline decoration-blue-500 decoration-2 underline-offset-4">Métricas Rápidas</h4>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <TrendingUp size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">Salud de Stock</span>
                                </div>
                                <span className="text-xs font-black text-slate-900">92%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Package size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">Variedad de Productos</span>
                                </div>
                                <span className="text-xs font-black text-slate-900">{kpi.total_products}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                                        <AlertCircle size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">Pérdida Estimada</span>
                                </div>
                                <span className="text-xs font-black text-slate-900">$0.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
