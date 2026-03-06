"use client";

import { useState, useMemo } from "react";
import { Search, ShoppingCart, Trash2, Plus, Minus, CheckCircle, AlertCircle, Sparkles, XCircle } from "lucide-react";
import { Product } from "@/lib/supabase/types";
import { processSale, SaleItem } from "@/app/actions/pos";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface POSSystemProps {
    initialProducts: Product[];
}

interface CartItem extends Product {
    quantity: number;
}

const MOCK_PRODUCTS: Product[] = [
    { id: "d1", name: "Nike Air Max 270", subtitle: "Zapatillas Urbanas", sku: "NIKE-270-B", price: 150, wholesale_price: 0, cost: 80, stock: 12, max_stock: 50, reorder_point: 5, image_url: "👟", user_id: "", category_id: "", supplier_id: "", is_active: true, created_at: "", updated_at: "" },
    { id: "d2", name: "MacBook Pro M3", subtitle: "Laptop de Alto Rendimiento", sku: "MAC-PRO-G", price: 1999, wholesale_price: 0, cost: 1400, stock: 5, max_stock: 20, reorder_point: 2, image_url: "💻", user_id: "", category_id: "", supplier_id: "", is_active: true, created_at: "", updated_at: "" },
    { id: "d3", name: "Café Espresso Premium", subtitle: "Grano Arábica Seleccionado", sku: "COFFEE-01", price: 4.50, wholesale_price: 0, cost: 1.20, stock: 100, max_stock: 500, reorder_point: 50, image_url: "☕", user_id: "", category_id: "", supplier_id: "", is_active: true, created_at: "", updated_at: "" },
    { id: "d4", name: "iPhone 15 Pro", subtitle: "Titanio Natural", sku: "IPHONE-15-P", price: 999, wholesale_price: 0, cost: 600, stock: 8, max_stock: 30, reorder_point: 5, image_url: "📱", user_id: "", category_id: "", supplier_id: "", is_active: true, created_at: "", updated_at: "" },
    { id: "d5", name: "Sudadera Minimalist", subtitle: "Algodón Orgánico", sku: "HOOD-MIN-G", price: 45, wholesale_price: 0, cost: 15, stock: 25, max_stock: 100, reorder_point: 10, image_url: "🧥", user_id: "", category_id: "", supplier_id: "", is_active: true, created_at: "", updated_at: "" },
];

export default function POSSystem({ initialProducts }: POSSystemProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isDemoActive, setIsDemoActive] = useState(false);

    // Listado de productos (Real o Demo)
    const availableProducts = isDemoActive ? MOCK_PRODUCTS : initialProducts;

    // Filtrar productos basados en el término de búsqueda o mostrar por defecto
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return availableProducts.slice(0, 24); // Mostrar 24 por defecto
        return availableProducts.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 24);
    }, [searchTerm, availableProducts]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setSearchTerm("");
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(1, Math.min(item.quantity + delta, item.stock));
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleFinalizeSale = async () => {
        if (cart.length === 0) return;

        setIsProcessing(true);
        setError(null);

        if (isDemoActive) {
            // Simulamos retraso de red
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess(true);
            setCart([]);
            toast.success("¡Venta completada! (Modo Demo)", {
                description: "En el modo real, el stock se descontaría automáticamente."
            });
            setTimeout(() => setSuccess(false), 3000);
            setIsProcessing(false);
            return;
        }

        const saleItems: SaleItem[] = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
            unitCost: item.cost
        }));

        const result = await processSale(saleItems);

        if (result.success) {
            setSuccess(true);
            setCart([]);
            toast.success("Venta procesada con éxito");
            setTimeout(() => {
                setSuccess(false);
                router.refresh();
            }, 3000);
        } else {
            setError(result.error);
            toast.error(result.error);
        }
        setIsProcessing(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* Sección de Búsqueda y Selección */}
            <div className="lg:col-span-2 space-y-6">
                {/* Banner Modo Demo */}
                {!isDemoActive && initialProducts.length === 0 && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] p-8 text-white shadow-xl shadow-blue-200 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                                <Sparkles size={32} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-black mb-1">Tu inventario está vacío</h2>
                                <p className="text-white/80 text-sm font-medium">¿Quieres probar el punto de venta? Activa el modo demo para usar productos de ejemplo.</p>
                            </div>
                            <button
                                onClick={() => setIsDemoActive(true)}
                                className="px-6 py-3 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-lg active:scale-95"
                            >
                                Activar Modo Demo
                            </button>
                        </div>
                    </div>
                )}

                {isDemoActive && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-3 flex items-center justify-between gap-4 animate-in fade-in duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                                <Sparkles size={16} />
                            </div>
                            <p className="text-sm font-bold text-amber-800">Estás en Modo Demo. Los productos y ventas son simulados.</p>
                        </div>
                        <button
                            onClick={() => { setIsDemoActive(false); setCart([]); }}
                            className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-[10px] font-black uppercase tracking-widest text-amber-600 hover:bg-amber-100 transition-colors"
                        >
                            Salir del Demo
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o SKU (ej: Nike, CBT-001...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 text-slate-800 font-medium placeholder:text-slate-400"
                        />
                    </div>

                    {/* Resultados de búsqueda */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {filteredProducts.map(product => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                disabled={product.stock <= 0}
                                className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl">
                                    {product.image_url && (product.image_url.length < 5 || !product.image_url.startsWith("http")) ? product.image_url : "📦"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-800 truncate text-sm">{product.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">{product.sku}</span>
                                        <span className={`text-[10px] font-black uppercase ${product.stock <= 5 ? "text-amber-600" : "text-slate-400"}`}>
                                            Stock: {product.stock}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-blue-600">${product.price.toFixed(2)}</p>
                                    <Plus size={16} className="text-blue-400 ml-auto group-hover:scale-125 transition-transform" />
                                </div>
                            </button>
                        ))}
                    </div>

                    {!isDemoActive && initialProducts.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                            <ShoppingCart size={48} className="text-slate-300" />
                            <p className="text-sm font-bold text-slate-400">No hay productos en el inventario</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sección del Carrito / Resumen */}
            <div className="space-y-6">
                <div className="bg-slate-900 rounded-[32px] text-white p-6 shadow-xl shadow-slate-200 sticky top-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black tracking-tight">Venta Actual</h2>
                        <span className="bg-blue-600 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest leading-none">
                            {itemsCount} {itemsCount === 1 ? 'Ítem' : 'Ítems'}
                        </span>
                    </div>

                    {/* Mensajes de estado */}
                    {success && (
                        <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <CheckCircle className="text-emerald-400" size={20} />
                            <p className="text-xs font-bold text-emerald-100">Venta procesada con éxito</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="text-red-400" size={20} />
                            <p className="text-xs font-bold text-red-100">{error}</p>
                        </div>
                    )}

                    {/* Lista del carrito */}
                    <div className="space-y-3 mb-8 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                        {cart.length === 0 && !success && (
                            <div className="text-center py-8 opacity-30">
                                <p className="text-sm font-medium">El carrito está vacío</p>
                            </div>
                        )}
                        {cart.map(item => (
                            <div key={item.id} className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-3 animate-in slide-in-from-right-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">{item.name}</p>
                                    <p className="text-xs font-black text-blue-400 tracking-tight">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center bg-white/10 rounded-xl px-1 py-1">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Resumen Final */}
                    <div className="space-y-4 pt-6 border-t border-white/10 mt-auto">
                        <div className="flex items-center justify-between text-white/60">
                            <span className="text-sm font-medium">Subtotal</span>
                            <span className="text-sm font-bold">${total.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-black tracking-tight">Total USD</span>
                            <span className="text-3xl font-black text-blue-400 tracking-tighter">${total.toFixed(2)}</span>
                        </div>

                        <button
                            disabled={cart.length === 0 || isProcessing}
                            onClick={handleFinalizeSale}
                            className={`w-full py-5 ${isDemoActive ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'} disabled:opacity-50 text-white rounded-[24px] font-black text-lg tracking-widest uppercase transition-all shadow-xl active:scale-[0.98] mt-4 flex items-center justify-center gap-3`}
                        >
                            {isProcessing ? (
                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <ShoppingCart size={20} />
                                    {isDemoActive ? "Simular Venta Demo" : "Finalizar Venta"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
