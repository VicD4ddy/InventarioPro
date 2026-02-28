"use client";

import {
    X, BookOpen, Package, ClipboardList, ShieldCheck, Zap, ChevronRight, ChevronLeft,
    Tag, Truck, BarChart3, Upload, Download, Lightbulb, Sparkles, AlertTriangle
} from "lucide-react";
import { useState } from "react";

interface TutorialStep {
    title: string;
    description: string;
    tips?: string[];
    icon: React.ReactNode;
    color: string;
    bgGradient: string;
}

const steps: TutorialStep[] = [
    {
        title: "¡Bienvenido a InventarioPRO!",
        description: "Tu sistema inteligente de gestión de inventario. En esta guía te enseñaremos todo lo que necesitas para dominar tu stock como un profesional.",
        tips: [
            "Puedes abrir esta guía en cualquier momento desde el botón ❓ del header.",
            "Cada sección del menú lateral tiene una función específica.",
        ],
        icon: <Sparkles size={28} />,
        color: "bg-gradient-to-br from-blue-500 to-indigo-600",
        bgGradient: "from-blue-50 to-indigo-50",
    },
    {
        title: "Panel de Control",
        description: "Tu centro de operaciones. Aquí verás un resumen de todo tu negocio: valor del inventario, stock total, productos activos y alertas de stock bajo.",
        tips: [
            "Las tarjetas KPI muestran datos en tiempo real.",
            "La gráfica de tendencia refleja la evolución del valor de tu inventario.",
            "Los productos con stock bajo aparecerán señalados automáticamente.",
        ],
        icon: <Zap size={28} />,
        color: "bg-gradient-to-br from-amber-400 to-orange-500",
        bgGradient: "from-amber-50 to-orange-50",
    },
    {
        title: "Catálogo de Productos",
        description: "El corazón de tu inventario. Gestiona todos tus productos desde una sola vista: busca, filtra, edita y organiza tu stock.",
        tips: [
            "Usa la barra de búsqueda para encontrar por nombre, código o descripción.",
            "Filtra por 'Stock Bajo' para encontrar productos que necesitan reposición.",
            "Los tres puntos (⋮) abren las opciones: Editar, Ajustar Stock y Eliminar.",
            "Selecciona varios productos con el checkbox para eliminarlos en bloque.",
        ],
        icon: <Package size={28} />,
        color: "bg-gradient-to-br from-blue-400 to-cyan-500",
        bgGradient: "from-blue-50 to-cyan-50",
    },
    {
        title: "Crear un Producto",
        description: "Al añadir un producto, cada campo tiene un icono ℹ️ que explica su significado. Los más importantes:",
        tips: [
            "SKU → Código único de identificación (ej: CBT-001).",
            "Punto de reorden → Stock mínimo para hacer un nuevo pedido. Es tu 'red de seguridad'.",
            "Stock máximo → Capacidad máxima recomendada de tu almacén.",
            "¿No creaste la categoría o proveedor? Usa el botón '+ Nueva/Nuevo' para crearlos al instante sin salir del formulario.",
        ],
        icon: <Lightbulb size={28} />,
        color: "bg-gradient-to-br from-yellow-400 to-amber-500",
        bgGradient: "from-yellow-50 to-amber-50",
    },
    {
        title: "Importar y Exportar",
        description: "Maneja miles de productos en segundos con las herramientas de importación y exportación masiva.",
        tips: [
            "Exportar → Descarga tu catálogo en Excel con formato profesional.",
            "Importar → Sube un archivo Excel (.xlsx) para crear o actualizar productos.",
            "La previsualización te muestra los cambios ANTES de aplicarlos.",
            "Los productos existentes (por SKU) se actualizan automáticamente.",
        ],
        icon: <Upload size={28} />,
        color: "bg-gradient-to-br from-teal-400 to-emerald-500",
        bgGradient: "from-teal-50 to-emerald-50",
    },
    {
        title: "Categorías y Proveedores",
        description: "Organiza tu inventario y lleva el control de tus socios comerciales.",
        tips: [
            "Categorías → Agrupa productos (ej: Electrónica, Ropa, Alimentos).",
            "Proveedores → Registra nombre, teléfono, email y país.",
            "Ambos se pueden crear 'al vuelo' desde el formulario de producto.",
            "Al eliminar, los datos se desactivan (no se borran) para proteger el historial.",
        ],
        icon: <Tag size={28} />,
        color: "bg-gradient-to-br from-violet-400 to-purple-500",
        bgGradient: "from-violet-50 to-purple-50",
    },
    {
        title: "Historial y Auditoría",
        description: "Cada movimiento de stock queda registrado. Nunca pierdas el rastro de tu mercancía.",
        tips: [
            "Se registran: Compras, Ventas, Ajustes, Devoluciones y Transferencias.",
            "La columna 'Transición' muestra Stock Antes → Después (ej: 50 → 45).",
            "El costo unitario queda congelado en el momento exacto del movimiento.",
            "Descarga el historial en Excel para contabilidad o auditorías externas.",
        ],
        icon: <ClipboardList size={28} />,
        color: "bg-gradient-to-br from-emerald-400 to-green-500",
        bgGradient: "from-emerald-50 to-green-50",
    },
    {
        title: "Reportes y Análisis",
        description: "Visualiza el rendimiento de tu negocio con gráficas interactivas y métricas clave.",
        tips: [
            "Gráficas de evolución del valor de inventario en el tiempo.",
            "Distribución de productos por categoría.",
            "Identificación rápida de productos con stock bajo.",
        ],
        icon: <BarChart3 size={28} />,
        color: "bg-gradient-to-br from-pink-400 to-rose-500",
        bgGradient: "from-pink-50 to-rose-50",
    },
    {
        title: "Seguridad y Privacidad",
        description: "Tus datos están completamente protegidos. Cada usuario tiene su propio espacio aislado.",
        tips: [
            "Row Level Security (RLS) → Solo tú ves tus productos.",
            "Los datos viajan cifrados entre tu navegador y el servidor.",
            "Las contraseñas se almacenan con hash seguro (nunca en texto plano).",
            "Puedes cambiar tu contraseña en Configuración → Seguridad.",
        ],
        icon: <ShieldCheck size={28} />,
        color: "bg-gradient-to-br from-slate-500 to-slate-700",
        bgGradient: "from-slate-50 to-slate-100",
    },
    {
        title: "¡Estás listo! 🎉",
        description: "Ya conoces todas las herramientas de InventarioPRO. ¡Es hora de potenciar tu negocio!",
        tips: [
            "Empieza creando tu primera categoría y luego tu primer producto.",
            "Si tienes un Excel con productos, impórtalos masivamente para ahorrar tiempo.",
            "Cualquier duda, visita el Centro de Soporte desde el menú lateral.",
        ],
        icon: <Sparkles size={28} />,
        color: "bg-gradient-to-br from-blue-500 to-indigo-600",
        bgGradient: "from-blue-50 to-indigo-50",
    },
];

export default function TutorialModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [currentStep, setCurrentStep] = useState(0);

    if (!isOpen) return null;

    const step = steps[currentStep];

    const next = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
        else { setCurrentStep(0); onClose(); }
    };

    const prev = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const goToStep = (index: number) => setCurrentStep(index);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden relative border border-slate-100 animate-in zoom-in-95 duration-300">
                {/* Botón cerrar */}
                <button
                    onClick={() => { setCurrentStep(0); onClose(); }}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600 z-10"
                >
                    <X size={20} />
                </button>

                {/* Header con gradiente */}
                <div className={`bg-gradient-to-r ${step.bgGradient} px-8 pt-10 pb-6`}>
                    {/* Icono animado */}
                    <div className="flex justify-center mb-6">
                        <div className={`${step.color} w-20 h-20 rounded-[24px] flex items-center justify-center text-white shadow-xl animate-bounce-subtle`}>
                            {step.icon}
                        </div>
                    </div>

                    {/* Título y descripción */}
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
                            {step.title}
                        </h2>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-[340px] mx-auto">
                            {step.description}
                        </p>
                    </div>
                </div>

                {/* Tips / consejos */}
                {step.tips && step.tips.length > 0 && (
                    <div className="px-8 py-5 space-y-2.5 max-h-[180px] overflow-y-auto">
                        {step.tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-2.5 group">
                                <span className="mt-0.5 w-5 h-5 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                                    {i + 1}
                                </span>
                                <p className="text-[13px] text-slate-600 leading-relaxed">
                                    {tip}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Indicadores de pasos (dots clicables) */}
                <div className="flex justify-center gap-1.5 py-4 px-8">
                    {steps.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToStep(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:opacity-80 ${i === currentStep ? "w-6 bg-blue-600" : "w-1.5 bg-slate-200 hover:bg-slate-300"
                                }`}
                        />
                    ))}
                </div>

                {/* Botones de navegación */}
                <div className="flex items-center justify-between gap-4 px-8 pb-6">
                    <button
                        onClick={prev}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-2xl transition-all ${currentStep === 0
                                ? "text-transparent pointer-events-none"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                            }`}
                    >
                        <ChevronLeft size={18} />
                        Anterior
                    </button>

                    <button
                        onClick={next}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[20px] transition-all shadow-lg shadow-blue-600/20 group active:scale-[0.98]"
                    >
                        {currentStep === steps.length - 1 ? "¡Comenzar!" : "Siguiente"}
                        {currentStep < steps.length - 1 && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>

                {/* Footer decorativo */}
                <div className="bg-slate-50 px-8 py-4 flex items-center justify-between border-t border-slate-100">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <BookOpen size={14} />
                        Guía de Inicio Rápido
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        {currentStep + 1} / {steps.length}
                    </span>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
