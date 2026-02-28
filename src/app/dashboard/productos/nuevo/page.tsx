import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/ProductForm";
import type { Category, Supplier } from "@/lib/supabase/types";

export default async function NuevoProductoPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null; // O redirigir vía middleware
    }

    const [{ data: categories }, { data: suppliers }] = await Promise.all([
        supabase.from("categories").select("*").eq("user_id", user.id).order("name"),
        supabase.from("suppliers").select("*").eq("user_id", user.id).eq("is_active", true).order("name"),
    ]);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Agregar Producto
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Complete los campos para registrar un nuevo producto en el inventario.
                </p>
            </div>
            <ProductForm
                categories={(categories ?? []) as Category[]}
                suppliers={(suppliers ?? []) as Supplier[]}
            />
        </div>
    );
}
