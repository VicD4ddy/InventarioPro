"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/types";

import { getPlanLimit } from "@/lib/plans";

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

// ──────────────────────────────────────────────
// CREAR PRODUCTO
// ──────────────────────────────────────────────
export async function createProduct(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autorizado" };

    // 1. Verificar plan y límites
    const { data: profile } = await supabase
        .from("profiles")
        .select("plan, bcv_rate")
        .eq("id", user.id)
        .single();

    const currentExchangeRate = (profile as any)?.bcv_rate || 0;

    const planName = (profile as any)?.plan || 'basic'; // Por defecto básico si no tiene
    const plan = getPlanLimit(planName);

    const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_active", true);

    if ((count || 0) >= plan.products) {
        return {
            success: false,
            error: `Has alcanzado el límite de ${plan.products} productos de tu plan ${plan.label}. ¡Pásate a un plan superior para más capacidad!`,
            errorCode: "LIMIT_REACHED"
        };
    }

    const data: any = {
        user_id: user.id,
        name: formData.get("name") as string,
        subtitle: formData.get("subtitle") as string | null,
        sku: formData.get("sku") as string,
        category_id: (formData.get("category_id") as string) || null,
        supplier_id: (formData.get("supplier_id") as string) || null,
        price: parseFloat(formData.get("price") as string) || 0,
        cost: parseFloat(formData.get("cost") as string) || 0,
        stock: parseInt(formData.get("stock") as string) || 0,
        max_stock: parseInt(formData.get("max_stock") as string) || 100,
        reorder_point: parseInt(formData.get("reorder_point") as string) || 10,
        image_url: (formData.get("image_url") as string) || null,
        wholesale_price: parseFloat(formData.get("wholesale_price") as string) || 0,
        is_active: true,
    };

    const { data: newP, error } = await (supabase as any).from("products").insert(data).select("id").single();

    if (error) {
        return { success: false, error: error.message };
    }

    // REGISTRAR MOVIMIENTO INICIAL EN HISTORIAL (Audit v2)
    if (data.stock > 0) {
        await (supabase as any).from("stock_movements").insert({
            user_id: user.id,
            product_id: (newP as any).id,
            type: "adjustment",
            quantity: data.stock,
            stock_before: 0,
            stock_after: data.stock,
            exchange_rate: currentExchangeRate,
            unit_cost: data.cost || 0,
            notes: "Carga inicial de inventario (Creación)",
        });
    }

    revalidatePath("/dashboard");
    return { success: true };
}

// ──────────────────────────────────────────────
// ACTUALIZAR PRODUCTO
// ──────────────────────────────────────────────
export async function updateProduct(id: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const data: any = {
        name: formData.get("name") as string,
        subtitle: formData.get("subtitle") as string | null,
        sku: formData.get("sku") as string,
        category_id: (formData.get("category_id") as string) || null,
        supplier_id: (formData.get("supplier_id") as string) || null,
        price: parseFloat(formData.get("price") as string) || 0,
        cost: parseFloat(formData.get("cost") as string) || 0,
        max_stock: parseInt(formData.get("max_stock") as string) || 100,
        reorder_point: parseInt(formData.get("reorder_point") as string) || 10,
        image_url: (formData.get("image_url") as string) || null,
        wholesale_price: parseFloat(formData.get("wholesale_price") as string) || 0,
    };

    const { error } = await (supabase as any).from("products").update(data).eq("id", id).eq("user_id", user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

// ──────────────────────────────────────────────
// ELIMINAR PRODUCTO (soft delete)
// ──────────────────────────────────────────────
export async function deleteProduct(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autorizado" };

    // 1. Obtener stock para el historial de auditoría
    const { data: product } = await (supabase as any)
        .from("products")
        .select("stock, cost")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    const { error } = await (supabase as any)
        .from("products")
        .update({ is_active: false })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    // REGISTRAR EVENTO DE ELIMINACIÓN EN HISTORIAL (Audit v2)
    await (supabase as any).from("stock_movements").insert({
        user_id: user.id,
        product_id: id,
        type: "adjustment",
        quantity: 0,
        stock_before: (product as any)?.stock || 0,
        stock_after: (product as any)?.stock || 0,
        unit_cost: (product as any)?.cost || 0,
        notes: "Producto Desactivado (Eliminado del Inventario)",
    });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

// ──────────────────────────────────────────────
// ELIMINAR PRODUCTOS (bulk soft delete)
// ──────────────────────────────────────────────
export async function deleteProducts(ids: string[]) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autorizado" };

    // 1. Obtener datos para el historial de auditoría
    const { data: products } = await (supabase as any)
        .from("products")
        .select("id, stock, cost")
        .in("id", ids)
        .eq("user_id", user.id);

    const { error } = await (supabase as any)
        .from("products")
        .update({ is_active: false })
        .in("id", ids)
        .eq("user_id", user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    // REGISTRAR EVENTOS DE ELIMINACIÓN EN HISTORIAL (Audit v2)
    if (products && products.length > 0) {
        const movements = products.map((p: any) => ({
            user_id: user.id,
            product_id: p.id,
            type: "adjustment",
            quantity: 0,
            stock_before: p.stock,
            stock_after: p.stock,
            unit_cost: p.cost || 0,
            notes: "Producto Desactivado (Eliminación Masiva)",
        }));
        await (supabase as any).from("stock_movements").insert(movements);
    }

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

// ──────────────────────────────────────────────
// AJUSTAR STOCK + REGISTRAR MOVIMIENTO EN HISTORIAL
// ──────────────────────────────────────────────
export async function adjustStock(
    productId: string,
    quantity: number,
    type: "purchase" | "sale" | "adjustment" | "return" | "transfer",
    reference?: string,
    notes?: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autorizado" };

    // 0. Obtener tasa BCV actual del perfil
    const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("bcv_rate")
        .eq("id", user.id)
        .single();
    const currentExchangeRate = (profile as any)?.bcv_rate || 0;

    // 1. Obtener stock actual
    const { data: product, error: fetchError } = await (supabase as any)
        .from("products")
        .select("stock, cost")
        .eq("id", productId)
        .eq("user_id", user.id)
        .single();

    if (fetchError || !product) {
        return { success: false, error: "Producto no encontrado" };
    }

    const newStock = (product as any).stock + quantity;
    if (newStock < 0) {
        return { success: false, error: "Stock insuficiente para realizar la operación" };
    }

    // 2. Actualizar stock en productos
    const { error: updateError } = await (supabase as any)
        .from("products")
        .update({ stock: newStock })
        .eq("id", productId)
        .eq("user_id", user.id);

    if (updateError) {
        return { success: false, error: updateError.message };
    }

    // 3. Registrar movimiento en historial
    const { error: movementError } = await (supabase as any).from("stock_movements").insert({
        user_id: user.id,
        product_id: productId,
        type,
        quantity,
        stock_before: (product as any).stock,
        stock_after: newStock,
        unit_cost: (product as any).cost || 0,
        reference: reference || null,
        notes: notes || null,
    });

    if (movementError) {
        return { success: false, error: movementError.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/historial");
    return { success: true, newStock };
}

// ──────────────────────────────────────────────
// MARCAR NOTIFICACIÓN COMO LEÍDA
// ──────────────────────────────────────────────
export async function markNotificationRead(id: string) {
    const supabase = await createClient();

    await (supabase as any).from("notifications").update({ is_read: true }).eq("id", id);

    revalidatePath("/dashboard");
    return { success: true };
}
// ──────────────────────────────────────────────
// IMPORTACIÓN MASIVA
// ──────────────────────────────────────────────
export async function importProducts(items: any[]) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autorizado" };

    // 1. Obtener categorías y proveedores del usuario para mapear nombres a IDs
    const [{ data: categories }, { data: suppliers }, { data: existingProducts }] = await Promise.all([
        supabase.from("categories").select("id, name").eq("user_id", user.id),
        supabase.from("suppliers").select("id, name").eq("user_id", user.id),
        supabase.from("products").select("id, sku, stock").eq("user_id", user.id).eq("is_active", true),
    ]);

    const results = { created: 0, updated: 0, errors: [] as string[] };
    const stockMap = new Map<string, number>(existingProducts?.map(p => [(p as any).sku, (p as any).stock]) || []);
    const skuMap = new Map<string, string>(existingProducts?.map(p => [(p as any).sku, (p as any).id]) || []);
    const catMap = new Map<string, string>(categories?.map(c => [(c as any).name.toLowerCase().trim(), (c as any).id]) || []);
    const supMap = new Map<string, string>(suppliers?.map(s => [(s as any).name.toLowerCase().trim(), (s as any).id]) || []);

    // Procesar cada ítem
    for (const item of items) {
        try {
            const sku = item.sku || item["Código"] || "";
            if (!sku) continue;

            const categoryName = (item.category || item["Categoría"] || "").toLowerCase().trim();
            const supplierName = (item.supplier || item["Proveedor"] || "").toLowerCase().trim();

            const productData: any = {
                user_id: user.id,
                name: item.name || item["Producto"] || "Producto sin nombre",
                subtitle: item.subtitle || item["Modelo/Subtítulo"] || null,
                sku: sku,
                category_id: catMap.get(categoryName) || null,
                supplier_id: supMap.get(supplierName) || null,
                price: parseFloat(item.price || item["Precio"] || 0),
                cost: parseFloat(item.cost || 0),
                stock: parseInt(item.stock || item["Stock Actual"] || 0),
                wholesale_price: parseFloat(item.wholesale_price || item["Precio Mayorista"] || item["Precio Mayor"] || 0),
                reorder_point: parseInt(item.reorder_point || item["Stock Mínimo"] || 10),
                is_active: true
            };

            const existingId = skuMap.get(sku);
            const stockBefore = stockMap.get(sku) || 0;
            let finalProductId = existingId;

            if (existingId) {
                // UPDATE
                const { error } = await (supabase as any).from("products").update(productData).eq("id", existingId);
                if (error) throw error;
                results.updated++;
            } else {
                // INSERT
                const { data: newP, error } = await supabase.from("products").insert(productData as any).select("id").single();
                if (error) throw error;
                finalProductId = (newP as any).id;
                results.created++;
            }

            // REGISTRAR MOVIMIENTO EN HISTORIAL (Audit v2)
            const diff = productData.stock - stockBefore;
            if (diff !== 0) {
                await (supabase as any).from("stock_movements").insert({
                    user_id: user.id,
                    product_id: finalProductId,
                    type: "adjustment",
                    quantity: diff,
                    stock_before: stockBefore,
                    stock_after: productData.stock,
                    unit_cost: productData.cost || 0,
                    notes: "Importación Masiva vía Excel/CSV",
                });
            }
        } catch (err: any) {
            results.errors.push(`Error en SKU ${item.sku || 'N/A'}: ${err.message}`);
        }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/catalogo");
    return { success: true, results };
}
// ──────────────────────────────────────────────
// OBTENER PRODUCTOS
// ──────────────────────────────────────────────
export async function getProducts() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const { data, error } = await supabase
        .from("products")
        .select(`
            *,
            category:categories(id, name),
            supplier:suppliers(id, name)
        `)
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, products: data };
}
