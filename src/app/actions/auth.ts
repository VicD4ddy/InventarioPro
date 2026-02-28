"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ──────────────────────────────────────────────
// INICIAR SESIÓN
// ──────────────────────────────────────────────
export async function signIn(
    _prevState: { error: string | null },
    formData: FormData
) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    });

    if (error) {
        return { error: "Credenciales incorrectas. Verifica tu email y contraseña." };
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

// ──────────────────────────────────────────────
// REGISTRARSE
// ──────────────────────────────────────────────
export async function signUp(
    _prevState: { error: string | null; success: boolean },
    formData: FormData
) {
    const supabase = await createClient();

    const fullName = formData.get("full_name") as string;
    const company = formData.get("company") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                company_name: company,
            },
        },
    });

    if (error) {
        if (error.message.includes("already registered")) {
            return { error: "Este email ya está registrado. Intenta iniciar sesión.", success: false };
        }
        return { error: error.message, success: false };
    }

    return { error: null, success: true };
}

// ──────────────────────────────────────────────
// CERRAR SESIÓN
// ──────────────────────────────────────────────
export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

// ──────────────────────────────────────────────
// OBTENER USUARIO ACTUAL
// ──────────────────────────────────────────────
export async function getCurrentUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Obtener perfil extendido
    const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("full_name, company_name, avatar_url, plan, bcv_rate")
        .eq("id", user.id)
        .single();

    return {
        id: user.id,
        email: user.email,
        fullName: (profile as any)?.full_name ?? user.email?.split("@")[0] ?? "Usuario",
        companyName: (profile as any)?.company_name ?? "",
        avatarUrl: (profile as any)?.avatar_url ?? null,
        plan: (profile as any)?.plan ?? "free",
        bcvRate: (profile as any)?.bcv_rate ?? 0,
    };
}

// ──────────────────────────────────────────────
// COMPLETAR PERFIL (ONBOARDING)
// ──────────────────────────────────────────────
export async function updateProfile(
    _prevState: { error: string | null; success: boolean },
    formData: FormData
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "No autorizado", success: false };
    }

    const fullName = formData.get("full_name") as string;
    const companyName = formData.get("company_name") as string;

    if (!fullName || !companyName) {
        return { error: "Todos los campos son obligatorios", success: false };
    }

    // Usar upsert para crear o actualizar el perfil
    const { error } = await (supabase as any)
        .from("profiles")
        .upsert({
            id: user.id,
            full_name: fullName,
            company_name: companyName,
            updated_at: new Date().toISOString(),
        });

    if (error) {
        return { error: "Error al actualizar el perfil: " + error.message, success: false };
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

export async function updateSettings(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const fullName = formData.get("full_name") as string;
    const companyName = formData.get("company_name") as string;
    const bcvRate = parseFloat(formData.get("bcv_rate") as string) || 0;

    if (!fullName || !companyName) {
        return { success: false, error: "Todos los campos son obligatorios" };
    }

    const { error } = await (supabase as any)
        .from("profiles")
        .upsert({
            id: user.id,
            full_name: fullName,
            company_name: companyName,
            bcv_rate: bcvRate,
            updated_at: new Date().toISOString(),
        });

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/configuracion");
    return { success: true };
}
