import { getAllBusinesses } from "@/app/actions/admin";
import { Building2, Package, Calendar, Crown, Search, Filter } from "lucide-react";
import StatusToggle from "@/components/StatusToggle";

export default async function AdminNegociosPage() {
    const businesses = await getAllBusinesses();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header de la Sección */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Building2 size={32} className="text-blue-600" />
                        Gestión de Negocios
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">
                        Supervisa todas las empresas registradas y su actividad en la plataforma.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group flex-1 md:w-64">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por empresa..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all outline-none"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Tabla de Negocios */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Negocio / Empresa</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Responsable</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Plan Actual</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Productos</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fecha Registro</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {businesses.map((biz) => (
                                <tr key={biz.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                                                {biz.company_name?.[0] || biz.full_name?.[0] || "B"}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                                                    {biz.company_name || "Sin Empresa"}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
                                                    ID: {biz.id.slice(0, 8)}...
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-medium text-slate-600">{biz.full_name || "N/A"}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${biz.plan === 'pro'
                                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                                            }`}>
                                            {biz.plan === 'pro' && <Crown size={12} />}
                                            {biz.plan || 'Free'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Package size={14} className="text-slate-400" />
                                            <span className="text-sm font-black text-slate-700">{biz.productCount}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Calendar size={14} />
                                            <span className="text-xs font-medium">
                                                {new Date(biz.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 flex items-center gap-4">
                                        <a
                                            href={`/admin/negocios/${biz.id}`}
                                            className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-[0.1em] border-b border-transparent hover:border-blue-200 transition-all inline-block"
                                        >
                                            Ver Detalles
                                        </a>
                                        <StatusToggle userId={biz.id} initialStatus={biz.is_active ?? true} />
                                    </td>
                                </tr>
                            ))}

                            {businesses.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
                                                <Building2 size={32} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No hay negocios registrados aún</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer de la Tabla / Paginación */}
                <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-400">
                        Mostrando <span className="font-bold text-slate-600">{businesses.length}</span> negocios totales
                    </p>
                    <div className="flex items-center gap-2">
                        <button disabled className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-400 bg-white opacity-50 cursor-not-allowed">Anterior</button>
                        <button disabled className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-400 bg-white opacity-50 cursor-not-allowed">Siguiente</button>
                    </div>
                </div>
            </div>

            {/* Sugerencia SaaS */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/10">
                <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-xl font-black tracking-tight flex items-center gap-2 justify-center md:justify-start">
                        <Crown size={22} className="text-amber-400" />
                        Monitoreo de Conversión
                    </h3>
                    <p className="text-sm text-blue-100 font-medium">
                        Identifica negocios con más de 50 productos en plan Free para ofrecerles el upgrade a Pro.
                    </p>
                </div>
                <button className="px-8 py-3.5 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-lg">
                    Generar Reporte de Conversión
                </button>
            </div>
        </div>
    );
}
