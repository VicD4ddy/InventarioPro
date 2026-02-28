"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function completeProfile(
    _prevState: { error: string | null },
    formData: FormData
) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const fullName = (formData.get("full_name") as string)?.trim();
    const companyName = (formData.get("company_name") as string)?.trim() || null;

    if (!fullName) {
        return { error: "El nombre es obligatorio." };
    }

    // Usamos .from() sin generic para profiles ya que el tipo aún
    // puede no estar propagado en el cliente generado.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
        .from("profiles")
        .upsert({ id: user.id, full_name: fullName, company_name: companyName });

    if (error) {
        return { error: "No se pudo guardar el perfil. Intenta de nuevo." };
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

export async function isProfileComplete(): Promise<boolean> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

    return !!(data?.full_name?.trim());
}
