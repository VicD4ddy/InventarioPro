import { getSuppliers } from "@/app/actions/suppliers";
import SuppliersTable from "@/components/SuppliersTable";
import { Building2, Users } from "lucide-react";

interface PageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function SuppliersPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const suppliers = await getSuppliers({ search: params.q });

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-14 h-14 rounded-[22px] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-200 animate-bounce-subtle">
                            <Building2 size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Directorio de Proveedores</h1>
                            <p className="text-slate-500 font-medium">Gestiona tus contactos comerciales y fuentes de suministro.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[32px] p-2 pr-8 flex items-center gap-5 text-white shadow-2xl shadow-slate-200 border border-slate-800">
                    <div className="w-14 h-14 rounded-[26px] bg-slate-800 flex items-center justify-center border border-slate-700">
                        <Users size={24} className="text-blue-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5">Total Aliados</p>
                        <p className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                            {suppliers.length} <span className="text-sm text-slate-500 ml-1 font-bold tracking-normal">Empresas</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Listado Interactivo */}
            <SuppliersTable suppliers={suppliers} />

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 4s ease-in-out infinite;
                }
            `}} />
        </div>
    );
}
