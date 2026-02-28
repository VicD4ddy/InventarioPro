import { getCurrentUser } from "@/app/actions/auth";
import SettingsForm from "@/components/SettingsForm";
import { Settings, UserCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ConfiguracionPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    // Preparar datos con tipos seguros para evitar errores de nulidad en el cliente
    const supabase = await createClient();
    const { count: productCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_active", true);

    const initialData = {
        fullName: user.fullName || "Usuario",
        companyName: user.companyName || "Empresa",
        email: user.email || "",
        plan: user.plan || "basic",
        productCount: productCount || 0
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 rounded-[22px] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                            <Settings size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configuración del Sistema</h1>
                            <p className="text-slate-500 font-medium">Personaliza tu espacio de trabajo y gestiona tu cuenta.</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-[24px] px-6 py-4 shadow-sm">
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Estado de Cuenta</p>
                        <p className={`text-sm font-black tracking-tight flex items-center justify-end gap-1.5 ${initialData.plan !== 'free' ? 'text-emerald-500' : 'text-amber-500'}`}>
                            <span className={`w-2 h-2 rounded-full animate-pulse ${initialData.plan !== 'free' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            {initialData.plan !== 'free' ? 'Suscripción Activa' : 'Periodo de Prueba'}
                        </p>
                    </div>
                    <div className="w-px h-10 bg-slate-100 mx-2" />
                    <UserCircle size={24} className="text-slate-300" />
                </div>
            </div>

            {/* Formulario y Secciones */}
            <SettingsForm initialData={initialData} />
        </div>
    );
}
