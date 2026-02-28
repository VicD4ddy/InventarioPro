"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCategories() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

    return data || [];
}

export async function createCategory(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No autorizado" };

    const name = formData.get("name") as string;
    const color_class = formData.get("color_class") as string || "bg-blue-100 text-blue-800";

    const { data, error } = await (supabase as any)
        .from("categories")
        .insert({ name, color_class, user_id: user.id })
        .select()
        .single();

    if (error) return { error: error.message };

    revalidatePath("/dashboard/categorias");
    revalidatePath("/dashboard/catalogo");
    revalidatePath("/dashboard");
    return { success: true, category: data };
}

export async function updateCategory(id: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No autorizado" };

    const name = formData.get("name") as string;
    const color_class = formData.get("color_class") as string;

    const { error } = await (supabase as any)
        .from("categories")
        .update({ name, color_class })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/categorias");
    revalidatePath("/dashboard/catalogo");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteCategory(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No autorizado" };

    const { error } = await (supabase as any)
        .from("categories")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/categorias");
    revalidatePath("/dashboard/catalogo");
    revalidatePath("/dashboard");
    return { success: true };
}
