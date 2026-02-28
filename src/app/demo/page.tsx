import {
    LayoutDashboard, BookOpen, ClipboardList, Truck,
    BarChart2, Settings, HelpCircle, Box, LogIn,
    TrendingUp, AlertTriangle, Package,
    Search, Bell, Plus, MoreVertical,
} from "lucide-react";
import Link from "next/link";

// ─── DATOS FICTICIOS ────────────────────────────────────────────────────────

const DEMO_PRODUCTS = [
    { id: "1", name: "MacBook Pro 14\"", sku: "APPLE-MBP-14", category: "Tecnología", price: 1999, stock: 12, reorder: 5, status: "En Stock" },
    { id: "2", name: "Monitor LG 27\"", sku: "LG-MON-27", category: "Tecnología", price: 349, stock: 3, reorder: 5, status: "Stock Bajo" },
    { id: "3", name: "Teclado Mecánico", sku: "KB-MECH-RGB", category: "Periféricos", price: 129, stock: 28, reorder: 10, status: "En Stock" },
    { id: "4", name: "Auriculares Sony", sku: "SONY-WH1000", category: "Audio", price: 299, stock: 0, reorder: 8, status: "Sin Stock" },
    { id: "5", name: "Webcam Logitech", sku: "LOGI-C922", category: "Periféricos", price: 89, stock: 15, reorder: 5, status: "En Stock" },
    { id: "6", name: "SSD Samsung 1TB", sku: "SAM-SSD-1TB", category: "Almacenamiento", price: 99, stock: 4, reorder: 10, status: "Stock Bajo" },
    { id: "7", name: "iPad Air 5ta Gen", sku: "APPLE-IPAD-A5", category: "Tecnología", price: 749, stock: 7, reorder: 5, status: "En Stock" },
    { id: "8", name: "Silla Ergonómica", sku: "CHAIR-ERG-PRO", category: "Mobiliario", price: 459, stock: 2, reorder: 3, status: "Stock Bajo" },
];

const KPIS = [
    {
        label: "Valor Total del Inventario",
        value: "$184,362",
        sub: "8 productos activos",
        trend: "+12.4%",
        positive: true,
        icon: TrendingUp,
        color: "text-blue-600",
        bg: "bg-blue-50",
        spark: [40, 55, 48, 62, 70, 65, 80, 88],
    },
    {
        label: "Total de Productos",
        value: "8",
        sub: "1 sin stock",
        trend: "En línea",
        positive: true,
        icon: Package,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        spark: [30, 35, 33, 40, 38, 44, 42, 48],
    },
    {
        label: "Alertas de Stock Bajo",
        value: "3",
        sub: "Acción requerida",
        trend: "Urgente",
        positive: false,
        icon: AlertTriangle,
        color: "text-orange-500",
        bg: "bg-orange-50",
        spark: [2, 3, 2, 4, 3, 5, 4, 3],
    },
];

const STATUS_STYLES: Record<string, string> = {
    "En Stock": "bg-emerald-50 text-emerald-700 border border-emerald-200",
    "Stock Bajo": "bg-orange-50  text-orange-700  border border-orange-200",
    "Sin Stock": "bg-red-50     text-red-700     border border-red-200",
};

function Sparkline({ data, color = "#3b82f6" }: { data: number[]; color?: string }) {
    const max = Math.max(...data), min = Math.min(...data);
    const range = max - min || 1;
    const w = 80, h = 32;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${x},${y}`;
    }).join(" ");
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-80">
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ─── COMPONENTES ────────────────────────────────────────────────────────────

function DemoSidebar() {
    const navItems = [
        { label: "Inicio", icon: LayoutDashboard, active: true },
        { label: "Catálogo", icon: BookOpen },
        { label: "Historial", icon: ClipboardList },
        { label: "Proveedores", icon: Truck },
        { label: "Reportes", icon: BarChart2 },
    ];
    return (
        <aside className="fixed top-0 left-0 h-screen w-56 bg-white border-r border-slate-100 flex flex-col z-30 shadow-sm">
            <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                    <Box size={20} className="text-white" />
                </div>
                <div className="flex flex-col leading-tight">
                    <span className="text-[15px] font-bold text-slate-800">InventarioPRO</span>
                    <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">Demo</span>
                </div>
            </div>
            <nav className="flex-1 px-3 py-4">
                <ul className="space-y-0.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.label}>
                                <span className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-default select-none ${item.active ? "bg-blue-50 text-blue-600" : "text-slate-500"}`}>
                                    <Icon size={18} className={item.active ? "text-blue-600" : "text-slate-400"} />
                                    {item.label}
                                </span>
                            </li>
                        );
                    })}
                </ul>
                <div className="my-4 border-t border-slate-100" />
                <ul className="space-y-0.5">
                    {[{ label: "Configuración", icon: Settings }, { label: "Soporte", icon: HelpCircle }].map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.label}>
                                <span className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 cursor-default select-none">
                                    <Icon size={18} className="text-slate-400" />
                                    {item.label}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            {/* Perfil demo */}
            <div className="px-3 pb-4 space-y-2">
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-3 border border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">DM</span>
                    </div>
                    <div className="flex flex-col leading-tight min-w-0">
                        <span className="text-[13px] font-semibold text-slate-800 truncate">Demo Mode</span>
                        <span className="text-[11px] text-slate-400 truncate">demo@empresa.com</span>
                    </div>
                </div>
                <Link href="/login" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition w-full">
                    <LogIn size={16} />
                    Crear mi cuenta
                </Link>
            </div>
        </aside>
    );
}

// ─── PÁGINA DEMO ─────────────────────────────────────────────────────────────

export default function DemoPage() {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <DemoSidebar />

            <div className="flex flex-col flex-1 overflow-hidden ml-56">
                {/* Header */}
                <header className="sticky top-0 z-20 bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4">
                    {/* Banner demo */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-700 mr-2 flex-shrink-0">
                        ⚡ Modo Demo — datos ficticios
                    </div>
                    <div className="flex-1 relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input readOnly value="" placeholder="Buscar código, productos, proveedores..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 placeholder-slate-400 outline-none cursor-default" />
                    </div>
                    <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition">
                        <Bell size={18} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    </button>
                    <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition shadow-sm shadow-blue-600/30">
                        <Plus size={15} />
                        Crear mi cuenta
                    </Link>
                </header>

                {/* Contenido */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Título */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Panel de Inventario</h1>
                            <p className="text-sm text-slate-500 mt-0.5">Resumen de niveles de stock y rendimiento logístico.</p>
                        </div>
                        <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">Actualizado: hace 2 horas</span>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-3 gap-5 mb-6">
                        {KPIS.map((kpi) => {
                            const Icon = kpi.icon;
                            return (
                                <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500 font-medium">{kpi.label}</span>
                                        <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                                            <Icon size={18} className={kpi.color} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-slate-900 tracking-tight">{kpi.value}</div>
                                        <div className={`text-xs font-semibold mt-0.5 ${kpi.positive ? "text-emerald-600" : "text-orange-600"}`}>
                                            ▲ {kpi.trend}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-0.5">{kpi.sub}</div>
                                    </div>
                                    <Sparkline data={kpi.spark} color={kpi.positive ? "#3b82f6" : "#f97316"} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Tabla */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <h2 className="text-base font-bold text-slate-900">Inventario de Productos</h2>
                                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">{DEMO_PRODUCTS.length} artículos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">Todos los estados ▾</span>
                                <span className="text-xs text-slate-400 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">Todas las categorías ▾</span>
                            </div>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                                    <th className="text-left px-6 py-3">Producto</th>
                                    <th className="text-left px-4 py-3">Código</th>
                                    <th className="text-left px-4 py-3">Categoría</th>
                                    <th className="text-right px-4 py-3">Precio</th>
                                    <th className="text-left px-4 py-3">Stock</th>
                                    <th className="text-left px-4 py-3">Estado</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {DEMO_PRODUCTS.map((p) => {
                                    const pct = p.reorder > 0 ? Math.min((p.stock / (p.reorder * 4)) * 100, 100) : 100;
                                    const barColor = p.status === "En Stock" ? "bg-emerald-500" : p.status === "Stock Bajo" ? "bg-orange-400" : "bg-red-400";
                                    return (
                                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
                                                        <Package size={14} className="text-slate-400" />
                                                    </div>
                                                    <span className="font-semibold text-slate-800">{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{p.sku}</span>
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-600">{p.category}</td>
                                            <td className="px-4 py-3.5 text-right font-semibold text-slate-800">${p.price.toLocaleString()}</td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="text-slate-600 font-medium tabular-nums">{p.stock}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${STATUS_STYLES[p.status]}`}>{p.status}</span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition" title="Menú">
                                                    <MoreVertical size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-blue-600/20">
                        <div>
                            <h3 className="text-white font-bold text-lg">¿Listo para gestionar tu inventario real?</h3>
                            <p className="text-blue-200 text-sm mt-0.5">Crea tu cuenta gratuita y empieza en menos de 2 minutos.</p>
                        </div>
                        <Link href="/login" className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 transition shadow-sm">
                            Crear mi cuenta
                            <LogIn size={16} />
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
}
