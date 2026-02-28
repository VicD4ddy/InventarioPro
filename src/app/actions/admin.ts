"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getPlanLimit } from "@/lib/plans";

export async function getAllBusinesses() {
    const supabase = await createClient();

    // Obtener perfiles con conteo de sus productos
    const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
            id,
            full_name,
            company_name,
            plan,
            role,
            is_active,
            created_at
        `)
        .order("created_at", { ascending: false });

    if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        return [];
    }

    // Para cada perfil, obtener el conteo de productos
    const businessesWithStats = await Promise.all(profiles.map(async (profile: any) => {
        const { count, error: countError } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("user_id", profile.id);

        if (countError) {
            console.error(`Error counting products for user ${profile.id}:`, countError);
        }

        return {
            ...profile,
            productCount: count || 0
        };
    }));

    return businessesWithStats;
}

export async function getAllUsers() {
    const supabase = await createClient();

    const { data: users, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }

    return users;
}

export async function getBusinessDetails(userId: string) {
    const supabase = await createClient();

    // 1. Perfil
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (profileError) {
        console.error("Error fetching business profile:", profileError);
        return null;
    }

    // 2. Productos
    const { data: products, error: productsError } = await supabase
        .from("products")
        .select(`
            *,
            categories(name),
            suppliers(name)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (productsError) {
        console.error("Error fetching business products:", productsError);
        return null;
    }

    return {
        profile,
        products: products || []
    };
}

export async function getSystemConfig() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("system_config")
        .select("*")
        .eq("id", 1)
        .single();

    if (error) {
        console.error("Error fetching system config:", error);
        return {
            maintenance_mode: false,
            free_plan_product_limit: 5,
            free_plan_category_limit: 10,
            global_notification_message: "",
            system_name: "InventarioPRO",
            support_email: "soporte@inventariopro.com",
            notification_type: "info",
            is_notification_active: false
        };
    }

    return data;
}

export async function updateSystemConfig(config: any) {
    const supabase = await createClient();
    const { error } = await (supabase as any)
        .from("system_config")
        .update({
            ...config,
            updated_at: new Date().toISOString()
        })
        .eq("id", 1);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/configuracion");
    revalidatePath("/"); // Por si el modo mantenimiento afecta al landing
    return { success: true };
}

export async function toggleUserStatus(userId: string, currentStatus: boolean) {
    const supabase = await createClient();
    const { error } = await (supabase as any)
        .from("profiles")
        .update({ is_active: !currentStatus })
        .eq("id", userId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/negocios");
    revalidatePath("/admin/usuarios");
    return { success: true };
}

export async function updateBusinessPlan(userId: string, newPlan: string) {
    const supabase = await createClient();
    const { error } = await (supabase as any)
        .from("profiles")
        .update({ plan: newPlan })
        .eq("id", userId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/negocios");
    revalidatePath(`/admin/negocios/${userId}`);
    revalidatePath("/dashboard"); // Por si el usuario está logueado
    return { success: true };
}

export async function getConversionStats() {
    const businesses = await getAllBusinesses();

    // Candidatos: Negocios que están al 80% o más de su límite de plan actual
    const candidates = businesses.filter(b => {
        const plan = getPlanLimit(b.plan || 'basic');
        if (plan.products === Infinity) return false;
        return b.productCount >= (plan.products * 0.8);
    });

    return {
        nearLimitCount: candidates.length,
        candidates: candidates.slice(0, 5) // Mostrar los top 5
    };
}

export async function getGlobalActivity() {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log("[Admin Activity] Solicitado por:", user?.email || "Sin sesión");

        const { data, error } = await (supabase as any)
            .from("stock_movements")
            .select(`
                *,
                products (name),
                profiles (company_name, full_name)
            `)
            .order("created_at", { ascending: false })
            .limit(15);

        if (error) {
            // Log exhaustivo para PostgrestError
            console.error("[Admin Activity] ERROR PostgREST:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

            // Re-intento ultra-básico (sin joins)
            const { data: rawData, error: rawError } = await (supabase as any)
                .from("stock_movements")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(10);

            if (rawError) {
                console.error("[Admin Activity] ERROR Fallback:", rawError.message);
                return [];
            }
            return rawData || [];
        }

        return (data || []).map((item: any) => ({
            ...item,
            // Asegurar que products y profiles siempre existan como objetos, incluso si el join falló silenciosamente
            products: Array.isArray(item.products) ? item.products[0] : item.products || { name: "Producto" },
            profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles || { company_name: "Usuario" }
        }));
    } catch (e: any) {
        console.error("[Admin Activity] Excepción:", e?.message || e);
        return [];
    }
}
