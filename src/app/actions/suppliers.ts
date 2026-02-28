"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Supplier } from "@/lib/supabase/types";

export async function getSuppliers(params?: { search?: string }): Promise<Supplier[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = (supabase as any)
        .from("suppliers")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("name", { ascending: true });

    if (params?.search) {
        query = query.ilike("name", `%${params.search}%`);
    }

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching suppliers:", error);
        return [];
    }

    return data ?? [];
}

export async function createSupplier(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const data = {
        user_id: user.id,
        name: formData.get("name") as string,
        email: (formData.get("email") as string) || null,
        phone: (formData.get("phone") as string) || null,
        country: (formData.get("country") as string) || null,
        is_active: true,
    };

    const { data: newSupplier, error } = await (supabase as any)
        .from("suppliers")
        .insert(data)
        .select()
        .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/proveedores");
    return { success: true, supplier: newSupplier };
}

export async function updateSupplier(id: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const data = {
        name: formData.get("name") as string,
        email: (formData.get("email") as string) || null,
        phone: (formData.get("phone") as string) || null,
        country: (formData.get("country") as string) || null,
    };

    const { error } = await (supabase as any)
        .from("suppliers")
        .update(data)
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/proveedores");
    return { success: true };
}

export async function deleteSupplier(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const { error } = await (supabase as any)
        .from("suppliers")
        .update({ is_active: false })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/proveedores");
    revalidatePath("/dashboard"); // Por si se usa en selectores de productos
    return { success: true };
}
