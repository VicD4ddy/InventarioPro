import {
    LayoutDashboard,
    Building2,
    Users,
    CreditCard,
    Settings,
    ShieldCheck,
    Box,
    LogOut,
} from "lucide-react";
import { getCurrentUser, signOut } from "@/app/actions/auth";

const adminNavItems = [
    { label: "Consola Global", icon: LayoutDashboard, href: "/admin" },
    { label: "Negocios", icon: Building2, href: "/admin/negocios" },
    { label: "Usuarios", icon: Users, href: "/admin/usuarios" },
    { label: "Suscripciones", icon: CreditCard, href: "/admin/suscripciones" },
    { label: "Configuración SaaS", icon: Settings, href: "/admin/configuracion" },
];

interface AdminSidebarProps {
    currentPath?: string;
}

export default async function AdminSidebar({ currentPath = "/admin" }: AdminSidebarProps) {
    const user = await getCurrentUser();

    const initials = user?.fullName
        ? user.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "AD";

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-30 shadow-xl">
            {/* Logo Admin */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                    <ShieldCheck size={22} className="text-white" />
                </div>
                <div className="flex flex-col leading-tight">
                    <span className="text-[16px] font-black text-white tracking-tight">SaaS Admin</span>
                    <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase">InventarioPRO</span>
                </div>
            </div>

            {/* Navegación Admin */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-none">
                <ul className="space-y-1.5">
                    {adminNavItems.map((item) => {
                        const isActive = currentPath === item.href || currentPath.startsWith(item.href + "/");
                        const Icon = item.icon;
                        return (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                                        }`}
                                >
                                    <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
                                    {item.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>

            </nav>

            {/* Perfil Admin */}
            <div className="px-4 pb-6 space-y-3">
                <div className="flex items-center gap-3 bg-slate-800/50 rounded-2xl px-4 py-3 border border-slate-700/50">
                    <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center border-2 border-slate-700">
                        <span className="text-white text-sm font-bold">{initials}</span>
                    </div>
                    <div className="flex flex-col leading-tight min-w-0 flex-1">
                        <span className="text-[13px] font-black text-white truncate">
                            Administrador
                        </span>
                        <span className="text-[11px] text-slate-500 truncate font-medium">
                            {user?.email}
                        </span>
                    </div>
                </div>

                <form action={signOut}>
                    <button
                        type="submit"
                        className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                    >
                        <LogOut size={16} />
                        Cerrar sesión segura
                    </button>
                </form>
            </div>
        </aside>
    );
}
