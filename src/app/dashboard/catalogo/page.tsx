import { createClient } from "@/lib/supabase/server";
import { Package, Plus, Search, Tag, Filter, Download } from "lucide-react";
import InventoryTable from "@/components/InventoryTable";
import type { Product, Category } from "@/lib/supabase/types";
import CatalogHeader from "@/components/CatalogHeader";

export const revalidate = 60;

async function getProducts(userId: string, params: {
    search?: string;
    status?: string;
    category?: string;
}): Promise<Product[]> {
    const supabase = await createClient();

    let query = supabase
        .from("products")
        .select("*, categories(id, name, color_class)")
        .eq("is_active", true)
        .eq("user_id", userId)
        .order("name", { ascending: true });

    if (params.search) {
        query = query.or(
            `name.ilike.%${params.search}%,sku.ilike.%${params.search}%,subtitle.ilike.%${params.search}%`
        );
    }

    if (params.status === "en-stock") {
        query = query.gt("stock", 0);
    } else if (params.status === "stock-bajo") {
        // En una implementación real usaríamos un filtro dinámico basado en reorder_point
        // Por ahora simulamos con < 10 si no podemos hacer el join de comparación fácilmente en una sola query de supabase-js
        query = query.gt("stock", 0).lte("stock", 10);
    } else if (params.status === "sin-stock") {
        query = query.eq("stock", 0);
    }

    if (params.category) {
        const { data: cat } = await supabase
            .from("categories")
            .select("id")
            .eq("user_id", userId)
            .ilike("name", `%${params.category}%`)
            .single();
        if (cat) {
            query = query.eq("category_id", (cat as any).id);
        }
    }

    const { data } = await query;
    return (data ?? []) as Product[];
}

async function getCategories(userId: string): Promise<Category[]> {
    const supabase = await createClient();
    const { data } = await supabase.from("categories").select("*").eq("user_id", userId).order("name");
    return (data ?? []) as Category[];
}

interface PageProps {
    searchParams: Promise<{ q?: string; status?: string; category?: string }>;
}

export default async function CatalogoPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const [products, categories] = await Promise.all([
        getProducts(user.id, {
            search: params.q,
            status: params.status,
            category: params.category,
        }),
        getCategories(user.id),
    ]);

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Actions */}
            <CatalogHeader products={products} />

            {/* Stats Rápidos de Catálogo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm transition-hover hover:shadow-md">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Productos</p>
                    <p className="text-2xl font-black text-slate-900">{products.length}</p>
                </div>
                <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm transition-hover hover:shadow-md">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Categorías</p>
                    <p className="text-2xl font-black text-slate-900">{categories.length}</p>
                </div>
                <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm transition-hover hover:shadow-md border-l-4 border-l-emerald-500">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">En Stock</p>
                    <p className="text-2xl font-black text-emerald-600">{products.filter(p => p.stock > 0).length}</p>
                </div>
                <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm transition-hover hover:shadow-md border-l-4 border-l-rose-500">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Agotados</p>
                    <p className="text-2xl font-black text-rose-600">{products.filter(p => p.stock === 0).length}</p>
                </div>
            </div>

            {/* Tabla Maestra */}
            <InventoryTable
                products={products}
                categories={categories}
                currentSearch={params.q}
                currentStatus={params.status}
                currentCategory={params.category}
            />
        </div>
    );
}
