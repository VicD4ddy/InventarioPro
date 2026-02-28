"use client";

import { Search, Plus, HelpCircle, Menu } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import TutorialModal from "./TutorialModal";
import NotificationBell from "./NotificationBell";
import { useSidebar } from "./SidebarContext";

import BcvWidget from "./BcvWidget";

export default function TopHeader({ initialBcvRate = 0 }: { initialBcvRate?: number }) {
    const { toggleMobile } = useSidebar();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");
    const [showTutorial, setShowTutorial] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sincronizar si cambian los searchParams externos
    useEffect(() => {
        setSearchValue(searchParams.get("q") ?? "");
    }, [searchParams]);

    const handleSearch = useCallback(
        (value: string) => {
            setSearchValue(value);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                const params = new URLSearchParams(searchParams.toString());
                if (value.trim()) {
                    params.set("q", value.trim());
                } else {
                    params.delete("q");
                }
                // Solo aplica búsqueda en el dashboard
                if (pathname.startsWith("/dashboard")) {
                    const base = pathname.split("?")[0];
                    router.push(`${base}?${params.toString()}`);
                }
            }, 350);
        },
        [router, pathname, searchParams]
    );

    return (
        <header className="sticky top-0 z-20 bg-white border-b border-slate-100 px-4 md:px-6 py-3.5 flex items-center gap-3 md:gap-4">
            {/* Botón menú móvil */}
            <button
                onClick={toggleMobile}
                className="md:hidden p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 transition shadow-sm"
                aria-label="Abrir menú"
            >
                <Menu size={18} />
            </button>
            {/* Barra de búsqueda */}
            <div className="flex-1 relative max-w-lg">
                <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Buscar por código, productos, proveedores..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-600 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition"
                />
            </div>

            {/* Acciones derechas */}
            <div className="flex items-center gap-3 ml-auto">
                {/* Tasa BCV Dinámica */}
                <BcvWidget initialRate={initialBcvRate} />

                {/* Campana de notificaciones dinámica */}
                <NotificationBell />

                {/* Botón de Tutorial/Ayuda */}
                <button
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition text-slate-600 hover:text-blue-600"
                    aria-label="Ayuda y Tutorial"
                    onClick={() => setShowTutorial(true)}
                >
                    <HelpCircle size={16} />
                </button>

                {/* Acción Rápida */}
                <a
                    href="/dashboard/productos/nuevo"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition"
                >
                    <Plus size={15} />
                    Acción Rápida
                </a>
            </div>

            {/* Modal de Tutorial */}
            <TutorialModal
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
            />
        </header>
    );
}
