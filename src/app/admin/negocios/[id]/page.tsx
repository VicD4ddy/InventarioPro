import { getBusinessDetails } from "@/app/actions/admin";
import {
    Building2,
    ArrowLeft,
    Package,
    Crown,
    Calendar,
    Users,
    Mail,
    ChevronRight,
    Search,
    Clock
} from "lucide-react";
import { notFound } from "next/navigation";
import PlanSelector from "@/components/PlanSelector";

export default async function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getBusinessDetails(id);

    if (!data) {
        notFound();
    }

    const profile = data.profile as any;
    const products = data.products as any[];

    // Calcular estadísticas
    const totalInventoryValue = products.reduce((acc: number, p: any) => acc + (p.price * p.stock), 0);
    const lowStockCount = products.filter((p: any) => p.stock <= p.reorder_point).length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Breadcrumbs & Back */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <a href="/admin/negocios" className="hover:text-blue-600 transition-colors">Negocios</a>
                    <ChevronRight size={14} />
                    <span className="text-slate-600">Detalle de Negocio</span>
                </nav>
                <a
                    href="/admin/negocios"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                >
                    <ArrowLeft size={14} />
                    Volver a la lista
                </a>
            </div>

            {/* Business Header Card */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-8 lg:p-12 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full translate-x-32 -translate-y-32 -z-1" />

                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-4xl font-black shadow-xl shadow-blue-500/20">
                        {profile.company_name?.[0] || profile.full_name?.[0] || "?"}
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profile.company_name || 'Sin nombre de empresa'}</h1>
                            </div>
                            <div className="w-px h-8 bg-slate-100 hidden sm:block mx-2" />
                            <div className="min-w-[200px]">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Gestionar Suscripción</p>
                                <PlanSelector userId={profile.id} currentPlan={profile.plan || 'basic'} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Users className="text-blue-500" size={20} />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Responsable</p>
                                    <p className="text-sm font-bold">{profile.full_name || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Clock className="text-indigo-500" size={20} />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Miembro desde</p>
                                    <p className="text-sm font-bold">{new Date(profile.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Productos Totales</p>
                        <h4 className="text-2xl font-black text-slate-900">{products.length}</h4>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Bajo / Agotado</p>
                        <h4 className="text-2xl font-black text-slate-900">{lowStockCount}</h4>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Estimado</p>
                        <h4 className="text-2xl font-black text-slate-900">${totalInventoryValue.toLocaleString()}</h4>
                    </div>
                </div>
            </div>

            {/* Inventory Table for this Business */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between gap-4">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <Package size={22} className="text-blue-500" />
                        Inventario del Negocio
                    </h3>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar en el inventario..."
                            className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Producto</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Precio / Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {products.map((p: any) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-10 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-800">{p.name}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">CÓDIGO: {p.sku}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                                            {p.categories?.name || "Sin categoría"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-black ${p.stock <= p.reorder_point ? 'text-rose-600' : 'text-slate-700'}`}>
                                                {p.stock} units
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Mín: {p.reorder_point}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-800">${p.price.toLocaleString()}</span>
                                            <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">Total: ${(p.price * p.stock).toLocaleString()}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center text-slate-300 italic text-sm">
                                        Este negocio aún no ha registrado productos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
