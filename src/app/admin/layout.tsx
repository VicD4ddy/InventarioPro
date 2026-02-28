import AdminSidebar from "@/components/AdminSidebar";
import { Search, Bell, HelpCircle } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
            {/* Sidebar Admin */}
            <AdminSidebar />

            <div className="flex-1 flex flex-col ml-64 min-w-0">
                {/* Header Admin */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar negocios, usuarios o suscripciones..."
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                            <HelpCircle size={20} />
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 mx-2" />
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end leading-tight">
                                <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Admin Global</span>
                                <span className="text-[10px] font-bold text-blue-600 uppercase">Superusuario</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Contenido Principal */}
                <main className="flex-1 p-8 lg:p-12">
                    {children}
                </main>
            </div>
        </div>
    );
}
