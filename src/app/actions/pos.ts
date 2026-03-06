"use client";

import { createClient } from "@/lib/supabase/client";
import { StockMovement, MovementType, Database } from "@/lib/supabase/types";

export interface SaleItem {
    productId: string;
    quantity: number;
    unitPrice: number;
    unitCost: number | null;
}

export async function processSale(items: SaleItem[]) {
    const supabase = createClient<Database>();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No autenticado");

        // 1. Obtener estados actuales para validación de stock y calcular nuevos stocks
        const productIds = items.map(p => p.productId);
        const { data: products, error: fetchError } = await supabase
            .from("products")
            .select("id, name, stock, cost")
            .in("id", productIds);

        if (fetchError) throw fetchError;
        if (!products || products.length !== items.length) {
            throw new Error("Algunos productos no fueron encontrados");
        }

        // Validación de stock antes de empezar
        for (const item of items) {
            const product = (products as any[]).find(p => p.id === item.productId);
            if (!product || (product.stock ?? 0) < item.quantity) {
                throw new Error(`Stock insuficiente para: ${product?.name || "Producto desconocido"}`);
            }
        }

        // 2. Procesar cada item (Idealmente esto sería un RPC para atomicidad, pero por ahora en bucle)
        // Nota: En un entorno real, usaríamos un Procedimiento Almacenado de PostgreSQL (RPC)
        // para asegurar que toda la venta sea atómica.

        for (const item of items) {
            const product = (products as any[]).find(p => p.id === item.productId)!;
            const currentStock = product.stock ?? 0;
            const newStock = currentStock - item.quantity;

            // Actualizar Stock
            const { error: updateError } = await supabase
                .from("products")
                .update({ stock: newStock } as any)
                .eq("id", item.productId);

            if (updateError) throw updateError;

            // Registrar Movimiento
            const movement = {
                user_id: user.id,
                product_id: item.productId,
                type: "sale" as const,
                quantity: -item.quantity,
                stock_before: currentStock,
                stock_after: newStock,
                unit_cost: item.unitCost ?? product.cost ?? 0,
                reference: "Venta POS",
                notes: `Venta de ${item.quantity} unidades a $${item.unitPrice}`,
            };

            const { error: moveError } = await supabase
                .from("stock_movements")
                .insert(movement as any);

            if (moveError) throw moveError;
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error en processSale:", error);
        return { success: false, error: error.message };
    }
}
