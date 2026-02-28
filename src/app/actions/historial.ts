"use server";

import { createClient } from "@/lib/supabase/server";
import type { StockMovement } from "@/lib/supabase/types";

export async function getStockMovements(params?: {
    search?: string;
    type?: string;
}): Promise<StockMovement[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = (supabase as any)
        .from("stock_movements")
        .select(`
            *,
            products (
                id,
                name,
                sku
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (params?.type && params.type !== "all") {
        query = query.eq("type", params.type);
    }

    // El filtro de búsqueda por nombre de producto tendríamos que hacerlo en JS si Supabase no soporta filtro en el join de esta manera sin rpc
    const { data, error } = await query;

    if (error) {
        console.error("Error fetching stock movements:", error);
        return [];
    }

    let movements = data as (StockMovement & { products: { name: string; sku: string } })[];

    if (params?.search) {
        const search = params.search.toLowerCase();
        movements = movements.filter(m =>
            // Obtener los movimientos de stock del usuario (Historial)
            m.products?.name.toLowerCase().includes(search) ||
            m.products?.sku.toLowerCase().includes(search) ||
            m.reference?.toLowerCase().includes(search)
        );
    }

    return movements;
}
