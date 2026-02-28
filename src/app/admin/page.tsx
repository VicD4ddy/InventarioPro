import {
    Users,
    Building2,
    CreditCard,
    TrendingUp,
    Activity,
    ShieldCheck,
    Globe,
    Zap,
    ArrowRight,
    Crown
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAllBusinesses, getConversionStats, getGlobalActivity } from "@/app/actions/admin";

import { PLAN_LIMITS, getPlanLimit } from "@/lib/plans";

async function getAdminStats() {
    const supabase = await createClient();
    const convStats = await getConversionStats();

    // Contar negocios
    const { data: profiles } = await supabase
        .from("profiles")
        .select("plan");

    // Contar productos totales globales
    const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

    const stats_calc = (profiles || []).reduce((acc, curr: any) => {
        const planKey = (curr.plan || 'basic') as keyof typeof PLAN_LIMITS;
        const price = PLAN_LIMITS[planKey]?.price || 0;
        return {
            mrr: acc.mrr + price,
            proCount: acc.proCount + (curr.plan !== 'free' && curr.plan !== 'basic' ? 1 : 0),
            total: acc.total + 1
        };
    }, { mrr: 0, proCount: 0, total: 0 });

    return {
        businesses: stats_calc.total,
        products: productsCount || 0,
        proPlans: stats_calc.proCount,
        activeUsers: stats_calc.total,
        nearLimitCount: convStats.nearLimitCount,
        mrr: stats_calc.mrr
    };
}

export default async function AdminDashboard() {
    const stats = await getAdminStats();
    const convData = await getConversionStats();

    const kpis = [
        { label: "Negocios Registrados", value: stats.businesses, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "MRR Proyectado", value: `$${stats.mrr}`, icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Planes Premium", value: stats.proPlans, icon: Crown, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Candidatos Upgrade", value: stats.nearLimitCount, icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Bienvenida */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <ShieldCheck size={32} className="text-blue-600" />
                        Consola de Administración SaaS
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">Supervisión global de métricas y salud de la plataforma.</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronización Global</p>
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-sm mt-1">
                        <Globe size={14} className="animate-spin-slow" />
                        Online
                    </div>
                </div>
            </div>

            {/* KPIs Globales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5 group">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-12 h-12 rounded-2xl ${kpi.bg} flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform`}>
                                    <Icon size={22} />
                                </div>
                                <Activity size={16} className="text-slate-200" />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{kpi.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Secciones del SaaS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Últimos Negocios Registrados</h3>
                        <a href="/admin/negocios" className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest border-b border-transparent hover:border-blue-200 transition-all">Gestionar Todo</a>
                    </div>
                    <div className="flex-1">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/30 border-b border-slate-100">
                                        <th className="px-10 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Empresa</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registro</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {(await getAllBusinesses()).slice(0, 5).map((biz: any) => (
                                        <tr key={biz.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-10 py-4">
                                                <a href={`/admin/negocios/${biz.id}`} className="flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                        {biz.company_name?.[0] || 'B'}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">{biz.company_name || 'Sin nombre'}</span>
                                                </a>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${biz.plan === 'pro' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {biz.plan || 'Free'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-medium text-slate-500">
                                                    {new Date(biz.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {(await getAllBusinesses()).length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-10 py-20 text-center opacity-40">
                                                <Building2 size={40} className="mx-auto mb-2 text-slate-300" />
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No hay negocios</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Actividad Global Reciente */}
                <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-100 border border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 underline decoration-blue-500/30 decoration-4 underline-offset-8">Actividad Global</h4>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase">En Vivo</span>
                        </div>
                    </div>
                    <div className="space-y-5">
                        {(await getGlobalActivity()).map((act: any) => (
                            <div key={act.id} className="flex items-start gap-3 group">
                                <div className={`mt-1 p-1.5 rounded-lg ${act.type === 'in' ? 'bg-emerald-500/10 text-emerald-400' :
                                    act.type === 'out' ? 'bg-rose-500/10 text-rose-400' :
                                        'bg-blue-500/10 text-blue-400'
                                    }`}>
                                    <Zap size={10} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold text-slate-100 truncate">
                                        {act.product_name || act.products?.name || "Actividad de Inventario"}
                                    </p>
                                    <p className="text-[9px] text-slate-500 font-medium truncate">
                                        {act.profiles?.company_name || act.profiles?.full_name || "Negocio en plataforma"}
                                    </p>
                                </div>
                                <span className="text-[9px] font-black text-slate-600 uppercase pt-1">
                                    {act.type === 'in' ? '+' : act.type === 'out' ? '-' : ''}{act.quantity}
                                </span>
                            </div>
                        ))}
                        {(await getGlobalActivity()).length === 0 && (
                            <p className="text-[10px] text-slate-500 font-medium italic py-4">Sin actividad reciente registrada.</p>
                        )}
                    </div>
                    <a href="/admin/actividad" className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center transition-all group">
                        Ver Historial Global
                        <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Candidatos a Upgrade</h4>
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                            <TrendingUp size={16} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {convData.candidates.map((cand: any) => {
                            const plan = getPlanLimit(cand.plan || 'basic');
                            const percent = plan.products === Infinity ? 0 : Math.min(100, (cand.productCount / plan.products) * 100);
                            return (
                                <div key={cand.id} className="flex items-center justify-between group">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700 truncate max-w-[1200x]">{cand.company_name || cand.full_name}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">{cand.productCount} / {plan.products === Infinity ? '∞' : plan.products} prod.</span>
                                    </div>
                                    <div className="flex-1 mx-3 h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${percent > 90 ? 'bg-rose-500' : 'bg-amber-500'} rounded-full`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                    <a href={`/admin/negocios/${cand.id}`} className="text-[10px] font-black text-blue-600 uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Ver</a>
                                </div>
                            );
                        })}
                        {convData.candidates.length === 0 && (
                            <p className="text-[10px] text-slate-400 font-medium italic">No hay candidatos en el umbral crítico.</p>
                        )}
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50">
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                            Estos negocios están al <span className="text-rose-600 font-bold">80% o más</span> de su capacidad actual.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
