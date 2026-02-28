import { getGlobalActivity } from "@/app/actions/admin";
import { History, Zap, Package, Building2, Clock, ArrowLeft } from "lucide-react";

export default async function AdminActividadPage() {
    const activity = await getGlobalActivity();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <History size={32} className="text-blue-600" />
                        Historial de Actividad Global
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">
                        Registro maestro de todos los movimientos de inventario en la plataforma.
                    </p>
                </div>
                <a
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Volver al Dashboard
                </a>
            </div>

            {/* Lista de Actividad */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Producto</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Negocio</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cantidad</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha y Hora</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {activity.map((act: any) => (
                                <tr key={act.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-10 py-5">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${act.type === 'in' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                act.type === 'out' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-slate-50 text-slate-400 border-slate-100'
                                            }`}>
                                            <Zap size={10} />
                                            {act.type === 'in' ? 'Entrada' : act.type === 'out' ? 'Salida' : 'Ajuste'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-800 tracking-tight">
                                                {act.products?.name || "Actividad de Inventario"}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono">{act.product_id.split('-')[0]}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Building2 size={14} className="text-slate-300" />
                                            <span className="text-xs font-bold">{act.profiles?.company_name || act.profiles?.full_name || "Negocio en plataforma"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-sm font-black ${act.type === 'in' ? 'text-emerald-500' : act.type === 'out' ? 'text-blue-500' : 'text-slate-400'}`}>
                                            {act.type === 'in' ? '+' : act.type === 'out' ? '-' : ''}{act.quantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock size={14} />
                                            <span className="text-xs font-medium">
                                                {new Date(act.created_at).toLocaleString('es-ES', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {activity.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center opacity-40">
                                        <History size={40} className="mx-auto mb-2 text-slate-300" />
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No hay actividad registrada</p>
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
