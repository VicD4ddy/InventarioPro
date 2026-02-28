"use client";

import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    Truck,
    BarChart2,
    Settings,
    HelpCircle,
    Box,
    LogOut,
    ShieldCheck,
    ShoppingCart,
    Layers,
    X
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { signOut } from "@/app/actions/auth";

const mainNavItems = [
    { label: "Inicio", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Punto de Venta", icon: ShoppingCart, href: "/dashboard/pos" },
    { label: "Catálogo", icon: BookOpen, href: "/dashboard/catalogo" },
    { label: "Categorías", icon: Layers, href: "/dashboard/categorias" },
    { label: "Historial", icon: ClipboardList, href: "/dashboard/historial" },
    { label: "Proveedores", icon: Truck, href: "/dashboard/proveedores" },
    { label: "Reportes", icon: BarChart2, href: "/dashboard/reportes" },
];

const secondaryNavItems = [
    { label: "Configuración", icon: Settings, href: "/dashboard/configuracion" },
    { label: "Soporte", icon: HelpCircle, href: "/dashboard/soporte" },
];

interface SidebarClientProps {
    currentPath: string;
    user: any;
    initials: string;
}

export default function SidebarClient({ currentPath, user, initials }: SidebarClientProps) {
    const { isMobileOpen, closeMobile } = useSidebar();

    return (
        <>
            {/* Overlay para móvil */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={closeMobile}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-100 flex flex-col z-50 shadow-sm transition-transform duration-300 ease-in-out
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                            <Box size={20} className="text-white" />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-[15px] font-bold text-slate-800 tracking-tight">InventarioPRO</span>
                            <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">Gestión</span>
                        </div>
                    </div>
                    {/* Botón cerrar móvil */}
                    <button
                        onClick={closeMobile}
                        className="md:hidden p-2 text-slate-400 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navegación principal */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-none">
                    <ul className="space-y-0.5">
                        {mainNavItems.map((item) => {
                            const isActive = item.href === "/dashboard"
                                ? currentPath === "/dashboard"
                                : currentPath.startsWith(item.href);
                            const Icon = item.icon;
                            return (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        onClick={closeMobile}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                            }`}
                                    >
                                        <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-400"} />
                                        {item.label}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="my-4 border-t border-slate-100" />

                    <ul className="space-y-0.5">
                        {secondaryNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        onClick={closeMobile}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${currentPath.startsWith(item.href)
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
                                    >
                                        <Icon size={18} className={currentPath.startsWith(item.href) ? "text-blue-600" : "text-slate-400"} />
                                        {item.label}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                    {user?.email === "admin@gmail.com" && (
                        <div className="mt-4 px-3">
                            <a
                                href="/admin"
                                onClick={closeMobile}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-black bg-slate-900 text-white hover:bg-black transition-all shadow-lg shadow-slate-200"
                            >
                                <ShieldCheck size={18} className="text-blue-400" />
                                Panel de Admin
                            </a>
                        </div>
                    )}
                </nav>

                {/* Perfil de usuario + Cerrar Sesión */}
                <div className="px-3 pb-4 space-y-2">
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-3 border border-slate-100">
                        {user?.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={user.fullName}
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">{initials}</span>
                            </div>
                        )}
                        <div className="flex flex-col leading-tight min-w-0 flex-1">
                            <span className="text-[13px] font-semibold text-slate-800 truncate">
                                {user?.fullName ?? "Usuario"}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate">
                                {user?.companyName || user?.email?.split("@")[0] || "Mi cuenta"}
                            </span>
                        </div>
                    </div>

                    <form action={signOut}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
                        >
                            <LogOut size={16} className="text-slate-400 group-hover:text-red-400" />
                            Cerrar sesión
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}
