import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Product, Category, Supplier } from "@/lib/supabase/types";

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) notFound();

    // Cargar producto, categorías y proveedores en paralelo
    const [productRes, categoriesRes, suppliersRes] = await Promise.all([
        supabase.from("products").select("*").eq("id", id).eq("user_id", user.id).single(),
        supabase.from("categories").select("id, name, color_class").eq("user_id", user.id).order("name"),
        supabase.from("suppliers").select("id, name").eq("user_id", user.id).eq("is_active", true).order("name"),
    ]);

    const product = productRes.data as Product | null;
    const categories = categoriesRes.data as Category[] | null;
    const suppliers = suppliersRes.data as Supplier[] | null;

    if (!product) notFound();

    return (
        <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3 mb-6">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition"
                >
                    <ArrowLeft size={16} />
                    Volver al inventario
                </Link>
            </div>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Editar Producto</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    Modifica los datos de <strong>{product.name}</strong>
                </p>
            </div>

            <ProductForm
                mode="edit"
                productId={id}
                categories={categories ?? []}
                suppliers={suppliers ?? []}
                defaultValues={{
                    name: product.name,
                    subtitle: product.subtitle ?? undefined,
                    sku: product.sku,
                    category_id: product.category_id ?? undefined,
                    supplier_id: product.supplier_id ?? undefined,
                    price: product.price,
                    cost: product.cost ?? undefined,
                    stock: product.stock,
                    max_stock: product.max_stock,
                    reorder_point: product.reorder_point,
                    image_url: product.image_url ?? undefined,
                }}
            />
        </div>
    );
}
