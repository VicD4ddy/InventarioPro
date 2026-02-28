import { Settings, Shield, Zap, Bell, Database, Info } from "lucide-react";
import { getSystemConfig } from "@/app/actions/admin";
import ConfigForm from "@/components/ConfigForm";

export default async function AdminConfiguracionPage() {
    const config = await getSystemConfig();

    return (
        <div className="space-y-10 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Settings size={32} className="text-blue-600" />
                        Configuración del Sistema SaaS
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">
                        Ajustes globales para la plataforma InventarioPRO.
                    </p>
                </div>
                {!("id" in config) && (
                    <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl flex items-center gap-2">
                        <Info size={16} className="text-amber-600" />
                        <span className="text-[10px] font-black uppercase text-amber-700">Requiere Ejecución de Script SQL</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* El componente ConfigForm ahora maneja tanto la navegación (columna 1) como el contenido (columnas 2-3) */}
                <ConfigForm initialConfig={config} />
            </div>
        </div>
    );
}
