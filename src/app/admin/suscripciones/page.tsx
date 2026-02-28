import { CreditCard, TrendingUp, Users, DollarSign, Calendar, ArrowUpRight, BarChart3, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@/lib/plans";

export default async function AdminSuscripcionesPage() {
    const supabase = await createClient();

    // Obtener todos los perfiles para calcular MRR proyectado
    const { data: profiles } = await supabase.from("profiles").select("plan");

    const stats_calc = (profiles || []).reduce((acc, curr: any) => {
        const planKey = (curr.plan || 'basic') as keyof typeof PLAN_LIMITS;
        const price = PLAN_LIMITS[planKey]?.price || 0;
        return {
            mrr: acc.mrr + price,
            count: acc.count + 1
        };
    }, { mrr: 0, count: 0 });

    const stats = [
        { label: "MRR (Proyectado)", value: `$${stats_calc.mrr}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Suscripciones Activas", value: stats_calc.count.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Ticket Promedio", value: `$${stats_calc.count > 0 ? (stats_calc.mrr / stats_calc.count).toFixed(2) : 0}`, icon: DollarSign, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Churn Rate", value: "0%", icon: BarChart3, color: "text-rose-600", bg: "bg-rose-50" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <CreditCard size={32} className="text-blue-600" />
                    Monitor de Suscripciones
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-2">
                    Análisis financiero y gestión de planes premium.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform`}>
                                    <Icon size={22} />
                                </div>
                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Global</div>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{s.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Empty State / Coming Soon */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-20 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full translate-x-32 -translate-y-32 group-hover:scale-110 transition-transform duration-700" />

                <div className="relative z-10 max-w-md mx-auto">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Wallet size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-4">Módulo de Pagos en Preparación</h2>
                    <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                        Estamos integrando la pasarela de pagos para automatizar la gestión de planes Pro. Pronto podrás ver facturación, renovaciones y métricas de ingresos aquí.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="px-6 py-3 bg-slate-100 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Checkout Seguro
                        </div>
                        <div className="px-6 py-3 bg-slate-100 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Facturación Automática
                        </div>
                    </div>
                </div>
            </div>

            {/* Banner Informativo */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Crown size={32} className="text-white" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black mb-1">Estrategia de Monetización</h4>
                            <p className="text-sm text-slate-400 font-medium max-w-sm">
                                El plan **Pro** incluirá stock ilimitado, reportes avanzados y soporte prioritario.
                            </p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all">
                        Definir Precios
                        <ArrowUpRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function Crown({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
        </svg>
    );
}
