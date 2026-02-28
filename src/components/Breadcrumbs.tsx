"use client";

import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const routeLabels: Record<string, string> = {
    dashboard: "Dashboard",
    pos: "Punto de Venta",
    catalogo: "Catálogo",
    categorias: "Categorías",
    historial: "Historial",
    proveedores: "Proveedores",
    reportes: "Reportes",
    configuracion: "Configuración",
    soporte: "Soporte",
    productos: "Productos",
    nuevo: "Nuevo",
    editar: "Editar",
};

export default function Breadcrumbs() {
    const pathname = usePathname();
    const paths = pathname.split("/").filter((path) => path !== "");

    return (
        <nav className="flex items-center gap-1.5 py-2 px-4 md:px-6 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest bg-white/50 border-b border-slate-100/50 backdrop-blur-sm">
            <Link
                href="/dashboard"
                className="hover:text-blue-600 transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded-lg hover:bg-blue-50/50"
            >
                <Home size={12} className="text-slate-300" />
                Inicio
            </Link>

            {paths.map((path, index) => {
                let href = `/${paths.slice(0, index + 1).join("/")}`;

                // Corrección: Mapear 'productos' a 'catalogo' para evitar 404
                if (path === "productos") {
                    href = "/dashboard/catalogo";
                }

                const isLast = index === paths.length - 1;
                const label = routeLabels[path] || path;

                // Si es un ID (UUID o similar), lo mostramos truncado o como "Detalle"
                const displayLabel = path.length > 20 ? "Detalle" : label;

                if (path === "dashboard") return null;

                return (
                    <div key={href} className="flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                        <ChevronRight size={10} className="text-slate-300" />
                        {isLast ? (
                            <span className="text-slate-800 bg-slate-100/80 px-2 py-0.5 rounded-lg border border-slate-200/50 font-black">
                                {displayLabel}
                            </span>
                        ) : (
                            <Link
                                href={href}
                                className="hover:text-blue-600 transition-colors px-1.5 py-0.5 rounded-lg hover:bg-blue-50/50"
                            >
                                {displayLabel}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
