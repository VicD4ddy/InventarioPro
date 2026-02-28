"use client";

import { useState, useTransition } from "react";
import {
    Shield,
    Zap,
    Bell,
    Database,
    Lock,
    Save,
    Globe,
    Info,
    Package,
    ChevronRight,
    Mail,
    Layout,
    AlertTriangle,
    CheckCircle2,
    Activity
} from "lucide-react";
import { updateSystemConfig } from "@/app/actions/admin";

interface ConfigFormProps {
    initialConfig: {
        maintenance_mode: boolean;
        global_notification_message: string | null;
        free_plan_product_limit: number;
        free_plan_category_limit?: number;
        system_name?: string;
        support_email?: string;
        notification_type?: 'info' | 'warning' | 'success';
        is_notification_active?: boolean;
    };
}

type TabType = "general" | "limites" | "notificaciones" | "mantenimiento";

export default function ConfigForm({ initialConfig }: ConfigFormProps) {
    const [config, setConfig] = useState(initialConfig);
    const [activeTab, setActiveTab] = useState<TabType>("general");
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSave = () => {
        setMessage(null);
        startTransition(async () => {
            const result = await updateSystemConfig(config);
            if (result.success) {
                setMessage({ type: 'success', text: 'Configuración guardada correctamente.' });
            } else {
                setMessage({ type: 'error', text: result.error || 'Error al guardar.' });
            }
        });
    };

    const tabs = [
        { id: "general", label: "General y Seguridad", icon: Shield, color: "text-blue-600", bg: "bg-blue-50", shadow: "shadow-blue-500/10" },
        { id: "limites", label: "Límites de Planes", icon: Zap, color: "text-amber-600", bg: "bg-amber-50", shadow: "shadow-amber-500/10" },
        { id: "notificaciones", label: "Notificaciones Sistema", icon: Bell, color: "text-purple-600", bg: "bg-purple-50", shadow: "shadow-purple-500/10" },
        { id: "mantenimiento", label: "Mantenimiento DB", icon: Database, color: "text-rose-600", bg: "bg-rose-50", shadow: "shadow-rose-500/10" },
    ];

    return (
        <>
            {/* Columna Izquierda: Navegación de Categorías */}
            <div className="space-y-6">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-[32px] flex flex-col gap-2 shadow-sm">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`flex items-center justify-between px-6 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all duration-500 group ${isActive
                                    ? `bg-white ${tab.color} shadow-xl ${tab.shadow} translate-x-1 border border-slate-100`
                                    : "text-slate-400 hover:bg-slate-100/50 hover:text-slate-600"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${isActive ? tab.bg : "bg-slate-100 group-hover:bg-white"}`}>
                                        <Icon size={20} className={isActive ? tab.color : "text-slate-400"} />
                                    </div>
                                    {tab.label}
                                </div>
                                {isActive && (
                                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-500' : ''} animate-pulse`} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Card de Aviso */}
                <div className="p-8 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-[40px] text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <Info size={24} className="text-blue-200" />
                            <h4 className="text-[12px] font-black uppercase tracking-[0.2em]">Aviso Global</h4>
                        </div>
                        <p className="text-[11px] text-blue-100 font-bold leading-relaxed">
                            Cualquier cambio aquí afectará instantáneamente a todos los clientes. Procede con cautela y verifica antes de guardar.
                        </p>
                    </div>
                </div>
            </div>

            {/* Columna Derecha: Contenido Dinámico */}
            <div className="lg:col-span-2 space-y-8">
                {message && (
                    <div className={`p-5 rounded-[24px] border text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-500 shadow-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                        <div className="flex items-center gap-3">
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                            {message.text}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden p-8 lg:p-14 min-h-[600px] flex flex-col relative">
                    <div className="flex-1 relative z-10">
                        {activeTab === 'general' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="flex items-center gap-5 mb-12">
                                    <div className="w-16 h-16 rounded-[24px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                                        <Shield size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">General y Seguridad</h3>
                                        <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
                                            <div className="w-4 h-[2px] bg-blue-500" />
                                            Identidad del Ecosistema
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-slate-50 border border-slate-100 rounded-[32px] group hover:bg-white hover:shadow-xl transition-all duration-500">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 flex items-center gap-2 text-slate-400">
                                            <Layout size={14} /> Nombre de la Aplicación
                                        </label>
                                        <input
                                            type="text"
                                            value={config.system_name || "InventarioPRO"}
                                            onChange={(e) => setConfig({ ...config, system_name: e.target.value })}
                                            className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-black text-slate-800 outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-200 transition-all"
                                        />
                                    </div>
                                    <div className="p-8 bg-slate-50 border border-slate-100 rounded-[32px] group hover:bg-white hover:shadow-xl transition-all duration-500">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 flex items-center gap-2 text-slate-400">
                                            <Mail size={14} /> Email de Soporte
                                        </label>
                                        <input
                                            type="email"
                                            value={config.support_email || "soporte@inventariopro.com"}
                                            onChange={(e) => setConfig({ ...config, support_email: e.target.value })}
                                            className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-black text-slate-800 outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-200 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="p-10 bg-slate-900 rounded-[40px] text-white shadow-3xl shadow-slate-200 border border-slate-800 group overflow-hidden relative">
                                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full -mb-24 -mr-24 blur-3xl" />
                                    <div className="relative z-10">
                                        <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                                            <Lock size={20} className="text-blue-400" />
                                            Certificación de Datos
                                        </h4>
                                        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8 max-w-md">
                                            Toda la información reside en contenedores aislados mediante <span className="text-white font-bold">Supabase RLS</span>. Esto garantiza la privacidad absoluta entre inquilinos (Tenants).
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Encriptación AES-256</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">v2.1.0 STABLE</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'limites' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="flex items-center gap-5 mb-12">
                                    <div className="w-16 h-16 rounded-[24px] bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                                        <Zap size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Límites de Planes</h3>
                                        <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
                                            <div className="w-4 h-[2px] bg-amber-500" />
                                            Control de Monetización
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="p-8 border-2 border-slate-50 rounded-[40px] flex items-center justify-between group hover:border-amber-100 transition-all duration-500">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-[24px] bg-slate-100 text-slate-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                                <Package size={28} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 tracking-tight">Límite de Productos (Plan Free)</p>
                                                <p className="text-xs text-slate-400 font-medium mt-1">Capacidad máxima del catálogo gratuito.</p>
                                            </div>
                                        </div>
                                        <input
                                            type="number"
                                            value={config.free_plan_product_limit}
                                            onChange={(e) => setConfig({ ...config, free_plan_product_limit: parseInt(e.target.value) || 0 })}
                                            className="w-28 px-5 py-4 bg-slate-50 border border-slate-200 rounded-[24px] text-center font-black text-2xl text-slate-800 outline-none focus:ring-8 focus:ring-amber-50 focus:border-amber-200 transition-all shadow-inner"
                                        />
                                    </div>

                                    <div className="p-8 border-2 border-slate-50 rounded-[40px] flex items-center justify-between group hover:border-amber-100 transition-all duration-500">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-[24px] bg-slate-100 text-slate-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                                <Layout size={28} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 tracking-tight">Límite de Categorías (Plan Free)</p>
                                                <p className="text-xs text-slate-400 font-medium mt-1">Nivel de organización para el usuario gratuito.</p>
                                            </div>
                                        </div>
                                        <input
                                            type="number"
                                            value={config.free_plan_category_limit || 10}
                                            onChange={(e) => setConfig({ ...config, free_plan_category_limit: parseInt(e.target.value) || 0 })}
                                            className="w-28 px-5 py-4 bg-slate-50 border border-slate-200 rounded-[24px] text-center font-black text-2xl text-slate-800 outline-none focus:ring-8 focus:ring-amber-50 focus:border-amber-200 transition-all shadow-inner"
                                        />
                                    </div>
                                </div>

                                <div className="p-8 bg-amber-50/50 rounded-[32px] border border-amber-100/50 flex gap-4">
                                    <Info className="text-amber-500 flex-shrink-0" size={20} />
                                    <p className="text-[11px] text-amber-700 font-bold leading-relaxed">
                                        IMPORTANTE: Estos límites se aplican en el momento de creación del recurso. Los usuarios que ya superen estos límites mantendrán sus datos actuales pero no podrán añadir nuevos.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notificaciones' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="flex items-center justify-between mb-12">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-[24px] bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
                                            <Bell size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Notificaciones Sistema</h3>
                                            <div className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
                                                <div className="w-4 h-[2px] bg-purple-500" />
                                                Alertas en Tiempo Real
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setConfig({ ...config, is_notification_active: !config.is_notification_active })}
                                        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${config.is_notification_active ? 'bg-purple-600 text-white shadow-xl shadow-purple-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                    >
                                        {config.is_notification_active ? 'Banner Activo' : 'Banner Inactivo'}
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {(['info', 'warning', 'success'] as const).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setConfig({ ...config, notification_type: type })}
                                                className={`p-6 rounded-[28px] border-2 transition-all flex flex-col items-center gap-3 ${config.notification_type === type
                                                    ? 'border-purple-500 bg-purple-50/50 shadow-lg'
                                                    : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-100'}`}
                                            >
                                                {type === 'info' && <Info className="text-blue-500" />}
                                                {type === 'warning' && <AlertTriangle className="text-amber-500" />}
                                                {type === 'success' && <CheckCircle2 className="text-emerald-500" />}
                                                <span className="text-[10px] font-black uppercase tracking-widest">{type}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-4">Contenido de la Notificación</label>
                                        <textarea
                                            value={config.global_notification_message || ""}
                                            onChange={(e) => setConfig({ ...config, global_notification_message: e.target.value })}
                                            placeholder="Ej: El sistema estará Offline por 5 min a las 22:00..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-[40px] p-8 text-sm font-black text-slate-700 outline-none focus:ring-8 focus:ring-purple-50 focus:border-purple-200 focus:bg-white transition-all min-h-[200px] resize-none shadow-inner"
                                        />
                                        <div className="absolute right-8 bottom-8 p-3 bg-purple-600 text-white rounded-2xl shadow-xl shadow-purple-200 group-focus-within:scale-125 transition-all duration-500">
                                            <Bell size={20} className="animate-swing" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'mantenimiento' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="flex items-center gap-5 mb-12">
                                    <div className="w-16 h-16 rounded-[24px] bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner">
                                        <Database size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Manteinimiento DB</h3>
                                        <div className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
                                            <div className="w-4 h-[2px] bg-rose-500" />
                                            Salud de Infraestructura
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-10 rounded-[48px] border-4 transition-all duration-700 relative overflow-hidden ${config.maintenance_mode ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                    <div className="absolute top-0 right-0 p-8">
                                        <Activity size={48} className={`opacity-10 ${config.maintenance_mode ? 'text-rose-600' : 'text-emerald-600'}`} />
                                    </div>

                                    <div className="flex items-center justify-between gap-10 relative z-10">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl transition-all duration-700 ${config.maintenance_mode ? 'bg-rose-600 text-white rotate-12 shadow-rose-200' : 'bg-emerald-600 text-white shadow-emerald-200'}`}>
                                                <Globe size={36} />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-slate-900 tracking-tight mb-1">
                                                    {config.maintenance_mode ? 'SISTEMA BAJO MANTENIMIENTO' : 'SERVICIOS ONLINE / ÓPTIMO'}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full animate-pulse ${config.maintenance_mode ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                                    <p className="text-xs font-bold text-slate-500 tracking-tight">
                                                        {config.maintenance_mode
                                                            ? 'Redireccionando público a página de espera.'
                                                            : 'Todos los nodos operativos en 4 regiones.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setConfig({ ...config, maintenance_mode: !config.maintenance_mode })}
                                            className={`w-20 h-10 rounded-full transition-all relative shadow-inner group ${config.maintenance_mode ? 'bg-rose-600' : 'bg-emerald-500'}`}
                                        >
                                            <div className={`w-8 h-8 bg-white rounded-full absolute top-1 transition-all shadow-xl group-hover:scale-90 ${config.maintenance_mode ? 'left-11' : 'left-1'}`} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                                    {[
                                        { label: "Latencia DB", val: "14ms", status: "Excelente", color: "text-emerald-500" },
                                        { label: "Disponibilidad", val: "99.99%", status: "Nominal", color: "text-blue-500" },
                                        { label: "Carga de Querys", val: "2%", status: "Baja", color: "text-emerald-500" }
                                    ].map((stat, i) => (
                                        <div key={i} className="p-8 bg-white border border-slate-100 rounded-[36px] shadow-sm hover:shadow-xl transition-all duration-500 group">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
                                            <div className="flex items-end justify-between">
                                                <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
                                                <span className="text-[9px] font-black text-slate-300 uppercase leading-none mb-1 group-hover:text-slate-900 transition-colors uppercase tracking-widest">{stat.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Fijo del Formulario */}
                    <div className="mt-16 flex items-center justify-between pt-10 border-t border-slate-50 relative z-10">
                        <div className="flex items-center gap-3 text-slate-400 group">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                <Info size={16} className="group-hover:text-blue-500 transition-colors" />
                            </div>
                            <span className="text-[10px] font-bold tracking-tight">Recuerda: estos ajustes son de <span className="text-slate-900 font-extrabold">Alcance Global</span>.</span>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isPending}
                            className="flex items-center gap-4 px-12 py-5 bg-slate-900 text-white rounded-[28px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black hover:shadow-2xl hover:shadow-slate-300 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-200"
                        >
                            <Save size={20} className={isPending ? 'animate-spin' : ''} />
                            {isPending ? "Procesando..." : "Aplicar Configuración"}
                        </button>
                    </div>

                    {/* Fondo decorativo sutil */}
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <Shield size={400} />
                    </div>
                </div>
            </div>
        </>
    );
}
